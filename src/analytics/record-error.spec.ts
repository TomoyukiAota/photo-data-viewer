import { AnalyticsEvent, trackEvent } from './analytics';
import {
  createErrorRecorder,
  MAX_ERRORS_PER_PAGE_LOAD,
  MAX_ERRORS_WITH_SAME_TEXT,
  recordErrorsNothingHandled,
} from './record-error';

jest.mock('./analytics');

const host = 'photo-data-viewer.vercel.app';

/** A recorder for a page of this app, whose events go to the returned mock, with the label of each call. */
function setUp({ search = '', homeDir = null as string | null } = {}) {
  const track = jest.fn<void, [AnalyticsEvent]>();
  const record = createErrorRecorder({
    track,
    location: () => ({ host, pathname: '/', search }),
    homeDir: () => homeDir,
  });
  const label = (call = 0) => track.mock.calls[call][0].label as Record<string, unknown>;
  return { record, track, label };
}

/** An error whose stack has the given frames below its first line, as Chrome writes one. */
function errorWithStack(message: string, stack: string[], name = 'Error') {
  const error = new Error(message);
  error.name = name;
  error.stack = [`${name}: ${message}`, ...stack].join('\n');
  return error;
}

describe('createErrorRecorder', () => {
  it('records what the error is, where it was caught, and the top of its stack', () => {
    const { record, track, label } = setUp();
    record(
      errorWithStack('Invalid LatLng object: (NaNNaN, NaNNaN)', [
        `    at new LatLng (https://${host}/_next/static/chunks/pages/index-abc123.js:1:2345)`,
        `    at toLatLng (https://${host}/_next/static/chunks/pages/index-abc123.js:1:3456)`,
      ]),
      'render',
      { boundary: 'map', componentStack: `\n    at UpdateMap (https://${host}/_next/static/chunks/42.js:1:10)\n    at MapContainer (https://${host}/_next/static/chunks/42.js:2:20)` }
    );

    expect(track).toHaveBeenCalledTimes(1);
    expect(track.mock.calls[0][0]).toMatchObject({ category: 'Unhandled Error', action: 'Unhandled Error', ga4Name: 'unhandled_error' });
    expect(label()).toEqual({
      error: 'Error: Invalid LatLng object: (NaNNaN, NaNNaN)',
      errorSource: 'render',
      boundary: 'map',
      pathname: '/',
      stack: [
        'at new LatLng (/_next/static/chunks/pages/index-abc123.js:1:2345)',
        'at toLatLng (/_next/static/chunks/pages/index-abc123.js:1:3456)',
      ],
      componentStack: ['at UpdateMap (/_next/static/chunks/42.js:1:10)', 'at MapContainer (/_next/static/chunks/42.js:2:20)'],
    });
  });

  it('reads the stacks of Firefox and Safari, and keeps the host of code from another site, without its query', () => {
    const { record, label } = setUp();
    record(
      errorWithStack('x is undefined', [
        `onClick@https://${host}/_next/static/chunks/pages/index.js?v=3:4:5`,
        '@https://unpkg.com/leaflet@1.9.4/dist/leaflet.js?token=secret:6:7',
      ], 'TypeError'),
      'error'
    );
    expect(label().stack).toEqual([
      'onClick@/_next/static/chunks/pages/index.js:4:5',
      '@unpkg.com/leaflet@1.9.4/dist/leaflet.js:6:7',
    ]);
  });

  it('takes out paths on the user\'s computer, with spaces, keeping the name of a file of code', () => {
    const { record, label } = setUp();
    record(
      errorWithStack("ENOENT: no such file or directory, open 'C:\\Users\\Taro Yamada\\Pictures\\Family trip\\IMG 0001.jpg'", [
        '    at Object.openSync (node:fs:573:18)',
        '    at readPhoto (C:\\Users\\Taro Yamada\\AppData\\Local\\Programs\\Photo Location Map\\resources\\app.asar\\dist\\main.js:10:20)',
        '    at file:///Users/taro/Library/Photo%20Viewer/reader.mjs:1:2',
      ]),
      'unhandledrejection'
    );
    expect(label().error).toBe("Error: ENOENT: no such file or directory, open '<path>'");
    expect(label().stack).toEqual([
      'at Object.openSync (node:fs:573:18)',
      'at readPhoto (<path>/main.js:10:20)',
      'at <path>/reader.mjs:1:2',
    ]);
    expect(JSON.stringify(label())).not.toMatch(/Taro|taro|Family|IMG/);
  });

  it('takes out paths that are not quoted, up to a character no path has', () => {
    const { record, label } = setUp();
    record(new Error('Cannot read /Users/taro/Pictures/My Trip/a.jpg (permission denied)'), 'error');
    record(new Error('Cannot read \\\\nas\\photos\\My Trip\\a.jpg'), 'error');
    expect(label(0).error).toBe('Error: Cannot read <path>(permission denied)');
    expect(label(1).error).toBe('Error: Cannot read <path>');
  });

  it('takes out the photo Photo Location Map passes in the address, its name, and the home folder', () => {
    const photoPath = 'D:\\Photos\\2024 Kyoto\\Grandma.HEIC';
    const { record, label } = setUp({
      search: `?photoPath=${encodeURIComponent(photoPath)}`,
      homeDir: 'C:\\Users\\Taro Yamada',
    });
    record(new Error(`Failed to decode ${photoPath}`), 'error');
    record(new Error('Failed to decode Grandma.HEIC'), 'error');
    record(new Error('Cannot find C:\\Users\\Taro Yamada\\AppData\\Roaming\\x\\settings.json'), 'error');
    expect(label(0).error).toBe('Error: Failed to decode <path>');
    expect(label(1).error).toBe('Error: Failed to decode <photo>');
    expect(label(2).error).toBe('Error: Cannot find <path>');
  });

  it('keeps an address without its query, and this app\'s by its path', () => {
    const { record, label } = setUp();
    record(new Error(`Failed to fetch https://${host}/?photoPath=C%3A%5Cx.jpg and https://example.com/a/b?key=1`), 'error');
    expect(label().error).toBe('Error: Failed to fetch / and example.com/a/b');
  });

  it('records what is thrown when it is not an Error', () => {
    const { record, label } = setUp();
    record('a plain text', 'unhandledrejection');
    record(undefined, 'unhandledrejection');
    record(Object.create(null), 'unhandledrejection');
    expect(label(0)).toMatchObject({ error: 'a plain text', errorSource: 'unhandledrejection' });
    expect(label(0).stack).toBeUndefined();
    expect(label(1).error).toBe('undefined');
    expect(label(2).error).toBe('[object Object]');
  });

  it('records the same error once, and the same text a few times', () => {
    const { record, track } = setUp();
    const error = new Error('same');
    record(error, 'error');
    record(error, 'unhandledrejection');
    expect(track).toHaveBeenCalledTimes(1);

    for (let i = 0; i < 10; i++) record(new Error('same'), 'error');
    expect(track).toHaveBeenCalledTimes(MAX_ERRORS_WITH_SAME_TEXT);
  });

  it('records a limited number of errors per page load', () => {
    const { record, track } = setUp();
    for (let i = 0; i < MAX_ERRORS_PER_PAGE_LOAD + 10; i++) record(new Error(`error ${i}`), 'error');
    expect(track).toHaveBeenCalledTimes(MAX_ERRORS_PER_PAGE_LOAD);
  });

  it('never throws, even when sending fails', () => {
    const { record, track } = setUp();
    track.mockImplementation(() => {
      throw new Error('gtag is not defined');
    });
    expect(() => record(new Error('first'), 'error')).not.toThrow();
    expect(() => record(new Error('second'), 'error')).not.toThrow();
    expect(track).toHaveBeenCalledTimes(2);
  });
});

describe('recordErrorsNothingHandled', () => {
  const mockedTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;
  const actions = () => mockedTrackEvent.mock.calls.map(([event]) => (event.label as Record<string, unknown>).error);

  beforeAll(() => {
    recordErrorsNothingHandled();
    recordErrorsNothingHandled(); // Listens once, however often it is called.
  });
  afterEach(() => jest.clearAllMocks());

  it('records an error thrown outside rendering', () => {
    window.dispatchEvent(new ErrorEvent('error', { error: new TypeError('x is not a function'), message: 'Uncaught TypeError: x is not a function' }));
    expect(actions()).toEqual(['TypeError: x is not a function']);
  });

  it('records a promise rejected with nothing awaiting it', () => {
    window.dispatchEvent(Object.assign(new Event('unhandledrejection'), { reason: new RangeError('out of range') }));
    expect(actions()).toEqual(['RangeError: out of range']);
    expect((mockedTrackEvent.mock.calls[0][0].label as Record<string, unknown>).errorSource).toBe('unhandledrejection');
  });

  it('leaves out what the browser reports without an error to learn from', () => {
    window.dispatchEvent(new ErrorEvent('error', { message: 'Script error.' }));
    window.dispatchEvent(new ErrorEvent('error', { message: 'ResizeObserver loop completed with undelivered notifications.' }));
    expect(mockedTrackEvent).not.toHaveBeenCalled();
  });
});
