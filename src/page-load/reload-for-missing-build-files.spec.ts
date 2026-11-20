import {
  MAX_RELOADS,
  RELOAD_DELAY_MS,
  RELOAD_PERIOD_MS,
  RELOADS_STORAGE_KEY,
  reloadForMissingBuildFilesScript,
} from './reload-for-missing-build-files';

const origin = window.location.origin;
const appScript = `${origin}/_next/static/chunks/pages/_app-0123456789abcdef.js`;

/** The listeners that the script added to the window, which each page's end removes. */
const added: [string, EventListener, boolean | undefined][] = [];

/**
 * Runs the script as the head of a page that is being loaded runs it, with this test's `location`, `document` and
 * `sessionStorage`, and gives the stand-in of `location.reload`. The script listens on jsdom's window, as in a page.
 */
function loadPage(storage: Storage = sessionStorage) {
  endPage();
  const reload = jest.fn();
  const addEventListener = (
    type: string,
    listener: EventListener,
    capture?: boolean,
  ) => {
    added.push([type, listener, capture]);
    window.addEventListener(type, listener, capture);
  };
  // The page's document, which is still being loaded, with the root that the app renders the page into.
  const pageDocument = {
    readyState: 'loading',
    getElementById: (id: string) => document.getElementById(id),
  };
  new Function(
    'location',
    'document',
    'sessionStorage',
    'addEventListener',
    reloadForMissingBuildFilesScript,
  )({ origin, reload }, pageDocument, storage, addEventListener);
  return reload;
}

/** Ends the page that loadPage ran the script for: its listeners, and what the app rendered. */
function endPage() {
  for (const [type, listener, capture] of added.splice(0))
    window.removeEventListener(type, listener, capture);
  document.head.replaceChildren();
  document.body.replaceChildren(
    Object.assign(document.createElement('div'), { id: '__next' }),
  );
}

/** Fires the page's load event. */
function finishLoading() {
  window.dispatchEvent(new Event('load'));
}

/** Puts `element` in the page, and fires the error event of a file that it could not load. */
function failToLoad(element: HTMLElement) {
  document.head.append(element);
  element.dispatchEvent(new Event('error'));
}

function script(src: string) {
  return Object.assign(document.createElement('script'), { src });
}

function link(rel: string, href: string) {
  return Object.assign(document.createElement('link'), { rel, href });
}

/** Renders something into the root, as the app does once it runs. */
function startApp() {
  document.getElementById('__next')!.append(document.createElement('main'));
}

function storedReloads(): number[] {
  return JSON.parse(sessionStorage.getItem(RELOADS_STORAGE_KEY) ?? '[]');
}

describe('reloadForMissingBuildFilesScript', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-11-20T12:31:26Z') });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    endPage();
    sessionStorage.clear();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('loads the page again half a second after its load, when a script of its build did not load', () => {
    const reload = loadPage();
    failToLoad(script(appScript));
    jest.advanceTimersByTime(10000);
    expect(reload).not.toHaveBeenCalled(); // Never during the load.

    finishLoading();
    jest.advanceTimersByTime(RELOAD_DELAY_MS - 1);
    expect(reload).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(storedReloads()).toEqual([Date.now()]);
    expect(console.warn).toHaveBeenCalledWith(
      "A file of this page's build did not load (/_next/static/chunks/pages/_app-0123456789abcdef.js). Loading the page again.",
    );
  });

  it('loads the page again half a second after a failure that comes after the load', () => {
    const reload = loadPage();
    finishLoading();
    jest.advanceTimersByTime(3000);
    failToLoad(script(appScript));
    jest.advanceTimersByTime(RELOAD_DELAY_MS - 1);
    expect(reload).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('counts a stylesheet of the build', () => {
    const reload = loadPage();
    failToLoad(
      link('stylesheet', `${origin}/_next/static/css/0123456789abcdef.css`),
    );
    finishLoading();
    jest.advanceTimersByTime(RELOAD_DELAY_MS);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('loads the page again once for several files', () => {
    const reload = loadPage();
    failToLoad(
      script(`${origin}/_next/static/chunks/webpack-0123456789abcdef.js`),
    );
    failToLoad(
      script(`${origin}/_next/static/chunks/main-0123456789abcdef.js`),
    );
    failToLoad(script(appScript));
    finishLoading();
    jest.advanceTimersByTime(10000);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(storedReloads()).toHaveLength(1);
  });

  it.each([
    [
      "another site's stylesheet",
      () =>
        link('stylesheet', 'https://fonts.googleapis.com/css?family=Roboto'),
    ],
    [
      "another site's script",
      () => script('https://www.googletagmanager.com/gtag/js?id=G-0'),
    ],
    [
      "another site's file under /_next/static/",
      () => script('https://example.com/_next/static/chunks/main.js'),
    ],
    [
      "a script of this site's outside the build",
      () => script(`${origin}/_vercel/insights/script.js`),
    ],
    [
      'a prefetch of a file of the build',
      () => link('prefetch', `${origin}/_next/static/chunks/pages/about.js`),
    ],
    [
      'a preload of a file of the build',
      () => link('preload', `${origin}/_next/static/css/0123456789abcdef.css`),
    ],
    [
      'an image of the build',
      () =>
        Object.assign(document.createElement('img'), {
          src: `${origin}/_next/static/media/a.png`,
        }),
    ],
  ])('does nothing for %s', (_name, element) => {
    const reload = loadPage();
    failToLoad(element());
    window.dispatchEvent(
      new ErrorEvent('error', { message: 'An error of a script' }),
    );
    finishLoading();
    jest.advanceTimersByTime(10000);
    expect(reload).not.toHaveBeenCalled();
    expect(storedReloads()).toEqual([]);
  });

  it('does nothing for a file that fails once the app has started', () => {
    const reload = loadPage();
    finishLoading();
    startApp();
    failToLoad(
      script(`${origin}/_next/static/chunks/1234.0123456789abcdef.js`),
    );
    jest.advanceTimersByTime(10000);
    expect(reload).not.toHaveBeenCalled();
  });

  it('does not load the page again when the app started after the failure', () => {
    const reload = loadPage();
    failToLoad(
      link('stylesheet', `${origin}/_next/static/css/0123456789abcdef.css`),
    );
    startApp();
    finishLoading();
    jest.advanceTimersByTime(10000);
    expect(reload).not.toHaveBeenCalled();
    expect(storedReloads()).toEqual([]);
  });

  it(`loads the page again at most ${MAX_RELOADS} times within a minute, and again once a minute has passed since the first`, () => {
    const first = Date.now();
    for (let load = 1; load <= MAX_RELOADS + 1; load++) {
      const reload = loadPage();
      failToLoad(script(appScript));
      finishLoading();
      jest.advanceTimersByTime(RELOAD_DELAY_MS);
      expect(reload).toHaveBeenCalledTimes(load <= MAX_RELOADS ? 1 : 0);
    }
    expect(storedReloads()).toHaveLength(MAX_RELOADS);
    expect(console.warn).toHaveBeenLastCalledWith(
      `A file of this page's build did not load (/_next/static/chunks/pages/_app-0123456789abcdef.js). The page has loaded itself again ${MAX_RELOADS} times within a minute, so it is left as it is.`,
    );

    jest.setSystemTime(first + RELOAD_PERIOD_MS);
    const reload = loadPage();
    failToLoad(script(appScript));
    finishLoading();
    jest.advanceTimersByTime(RELOAD_DELAY_MS);
    expect(reload).toHaveBeenCalledTimes(1);
    // The first reload no longer counts; the others still do.
    expect(storedReloads()).toHaveLength(MAX_RELOADS);
    expect(storedReloads()).not.toContain(first);
  });

  it.each([
    ['read', 'getItem'],
    ['written', 'setItem'],
  ] as const)(
    'does not load the page again when the storage cannot be %s',
    (_name, method) => {
      jest.spyOn(Storage.prototype, method).mockImplementation(() => {
        throw new Error('SecurityError');
      });
      const reload = loadPage();
      failToLoad(script(appScript));
      finishLoading();
      jest.advanceTimersByTime(10000);
      expect(reload).not.toHaveBeenCalled();
    },
  );
});
