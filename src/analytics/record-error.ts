import { AnalyticsEvent, trackEvent } from './analytics';
import { Ga4EventName } from './ga4-event-name';
import { PHOTO_PATH_PARAM } from './ga4-page';

// Records errors that nothing else handled, as Photo Location Map records its own:
// what the error is and where in this app's code it was thrown, so that the errors
// users hit can be found and fixed. Nothing of the user's is sent: the photo's path
// and name, and any path on their computer, are taken out of the text first.
//
// An error thrown again and again must not flood the analytics, so a page load
// sends at most 20 errors, at most 3 with the same text, and the same error once.
// Recording never throws: it runs while another error is being handled.

export const MAX_ERRORS_PER_PAGE_LOAD = 20;
export const MAX_ERRORS_WITH_SAME_TEXT = 3;
/** The top of the stack is enough to tell where an error was thrown. */
const MAX_FRAMES = 5;
const MAX_TEXT_LENGTH = 200;

/** Where the error was caught: the window's error event, a promise nothing awaited, or an error boundary. */
export type ErrorSource = 'error' | 'unhandledrejection' | 'render';

export interface ErrorDetails {
  /** For an error in rendering, the error boundary that caught it. */
  boundary?: string;
  /** For an error in rendering, React's component stack. */
  componentStack?: string;
}

export interface ErrorRecorderOptions {
  track: (event: AnalyticsEvent) => void;
  /** This page's address: its host tells this app's code from others', and Photo Location Map passes the photo's path in it. */
  location: () => Pick<Location, 'host' | 'pathname' | 'search'>;
  /** The user's home folder, where Photo Location Map's window can tell it; null elsewhere. */
  homeDir: () => string | null;
}

// The options are passed in so that this can be unit-tested.
export function createErrorRecorder(options: ErrorRecorderOptions) {
  let recordedErrors = 0;
  const recordedTexts = new Map<string, number>();
  const recordedErrorObjects = new WeakSet<object>();
  let isRecording = false;

  return (error: unknown, source: ErrorSource, details: ErrorDetails = {}): void => {
    if (isRecording || recordedErrors >= MAX_ERRORS_PER_PAGE_LOAD) return;

    isRecording = true;
    try {
      if (typeof error === 'object' && error !== null) {
        if (recordedErrorObjects.has(error)) return;
        recordedErrorObjects.add(error);
      }

      const location = options.location();
      const scrub = createScrubber(location, options.homeDir());
      const text = scrub(errorText(error)).slice(0, MAX_TEXT_LENGTH);
      const sameText = recordedTexts.get(text) ?? 0;
      if (sameText >= MAX_ERRORS_WITH_SAME_TEXT) return;
      recordedTexts.set(text, sameText + 1);
      recordedErrors++;

      options.track({
        category: 'Unhandled Error',
        action: 'Unhandled Error',
        label: {
          error: text,
          errorSource: source,
          boundary: details.boundary,
          pathname: location.pathname,
          stack: stackFrames(error instanceof Error ? error.stack : undefined, scrub, location.host),
          componentStack: stackFrames(details.componentStack, scrub, location.host),
        },
        ga4Name: Ga4EventName.UnhandledError,
      });
    } catch {
      // Nothing more can be done here.
    } finally {
      isRecording = false;
    }
  };
}

function errorText(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  try {
    return String(error);
  } catch {
    return Object.prototype.toString.call(error); // An object that cannot be turned into text.
  }
}

/** A path on the user's computer, as `<path>`, keeping the name of a file of code, which tells where an error was thrown. */
function hidePath(path: string): string {
  const name = path.replace(/[\\/]+$/, '').split(/[\\/]/).pop() ?? '';
  return /\.(?:[cm]?js|jsx|tsx?|node)$/i.test(name) ? `<path>/${name}` : '<path>';
}

/** An address as its host and path, or its path alone for this app's own; never its query or fragment, which can hold anything. */
function shortenUrl(address: string, host: string): string {
  try {
    const url = new URL(address);
    if (url.protocol === 'file:') return hidePath(decodeURIComponent(url.pathname));
    if (url.protocol === 'blob:' || url.protocol === 'data:') return `${url.protocol}…`;
    return `${url.host === host ? '' : url.host}${url.pathname}`;
  } catch {
    return '<address>';
  }
}

// Paths as errors give them. Most quote a path; one that is not quoted runs to a
// character no path has, spaces included, so that no part of a folder's name is
// left, at the cost of any text after it. "~" is the home folder, which the
// scrubber writes so for the paths under it (Windows' included) to be found.
const QUOTED_PATH = /(['"`])((?:[A-Za-z]:[\\/]|\\\\|\/|~[\\/])[^'"`\n]*)\1/g;
const URL_IN_TEXT = /\b[a-z][a-z\d+.-]*:\/\/[^\s'"`<>()]+/gi;
const WINDOWS_PATH = /(?<![A-Za-z\d])[A-Za-z]:[\\/][^'"`()<>|:*?\n]*/g;
const UNC_PATH = /\\\\[^'"`()<>|:*?\n]+/g;
const POSIX_PATH = /(?<![\w.~-])(?:~[\\/]|\/(?:Users|home|root|private|var|tmp|Volumes|mnt|media|opt|Applications|Library)\/)[^'"`()<>|:*?\n]*/g;

function createScrubber(location: Pick<Location, 'host' | 'search'>, homeDir: string | null): (text: string) => string {
  const photoPath = new URLSearchParams(location.search).get(PHOTO_PATH_PARAM);
  const photoName = photoPath?.split(/[\\/]/).pop();

  return (text) => {
    let result = text;
    // The photo's path before its name, which is in it; the home folder before the
    // name too, so that a path under it is found whole.
    if (photoPath) result = result.split(photoPath).join('<path>');
    if (homeDir) result = result.split(homeDir).join('~');
    if (photoName) result = result.split(photoName).join('<photo>');
    return result
      .replace(QUOTED_PATH, (_match, quote: string, path: string) => `${quote}${hidePath(path)}${quote}`)
      .replace(URL_IN_TEXT, (address) => shortenUrl(address, location.host))
      .replace(WINDOWS_PATH, (path) => hidePath(path.trimEnd()))
      .replace(UNC_PATH, (path) => hidePath(path.trimEnd()))
      .replace(POSIX_PATH, (path) => hidePath(path.trimEnd()));
  };
}

/**
 * The top frames of a stack, each with its address shortened: this app's code by
 * its path, a file on the user's computer by the name of the file. Chrome writes
 * a frame as "at name (address:line:column)", Firefox and Safari as
 * "name@address:line:column", and React's component stack as Chrome's.
 */
function stackFrames(stack: string | undefined, scrub: (text: string) => string, host: string): string[] | undefined {
  if (!stack) return undefined;

  const frames = stack
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('at ') || /^[^\s@]*@\S/.test(line))
    .slice(0, MAX_FRAMES)
    .map((frame) => shortenFrame(frame, scrub, host).slice(0, MAX_TEXT_LENGTH));
  return frames.length > 0 ? frames : undefined;
}

function shortenFrame(frame: string, scrub: (text: string) => string, host: string): string {
  let name: string;
  let address: string;
  let end = '';
  if (frame.startsWith('at ')) {
    const open = frame.lastIndexOf('(');
    if (open >= 0 && frame.endsWith(')')) {
      name = frame.slice(0, open + 1);
      address = frame.slice(open + 1, -1);
      end = ')';
    } else {
      name = 'at ';
      address = frame.slice(3);
    }
  } else {
    const at = frame.indexOf('@');
    name = frame.slice(0, at + 1);
    address = frame.slice(at + 1);
  }

  const [, place, position = ''] = /^(.*?)(:\d+(?::\d+)?)?$/.exec(address) ?? ['', address];
  let shortened: string;
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(place)) shortened = shortenUrl(place, host);
  else if (/^(?:[A-Za-z]:[\\/]|\\\\|\/|~\/)/.test(place)) shortened = hidePath(place);
  else shortened = scrub(place); // Such as <anonymous>, native, node:internal/…, or webpack-internal:///….
  return `${scrub(name)}${shortened}${position}${end}`;
}

// In Photo Location Map's window, which enables nodeIntegration, Node's os module
// tells the user's home folder, where most paths in errors there would start.
function loadHomeDirFromElectron(): string | null {
  try {
    const electronRequire = (window as unknown as { require?: (id: string) => { homedir?: () => string } }).require;
    return electronRequire?.('os')?.homedir?.() || null;
  } catch {
    return null;
  }
}

let homeDir: string | null | undefined; // undefined until an error is recorded.

export const recordError = createErrorRecorder({
  track: (event) => trackEvent(event),
  location: () => window.location,
  homeDir: () => (homeDir === undefined ? (homeDir = loadHomeDirFromElectron()) : homeDir),
});

// Where the browser reports an error that is no failure of this app: a script of
// another site, whose errors the browser keeps from this page, and a resize put off
// to the next frame, which the browser reports as an error but recovers from.
const IGNORED_MESSAGES = /^(?:Script error\.?|ResizeObserver loop .*)$/;

const INSTALLED = Symbol.for('photo-data-viewer.recordErrorsNothingHandled');

// Records the errors thrown outside React's rendering, in an event handler or a
// timer, and the promises rejected with nothing awaiting them. Errors in rendering
// never reach the window, as Next.js catches them first; the error boundaries
// record those (ErrorBoundary.tsx).
export function recordErrorsNothingHandled(): void {
  if (typeof window === 'undefined') return;

  // Once per page load, though development reloads this module.
  const flags = window as unknown as Record<symbol, boolean>;
  if (flags[INSTALLED]) return;
  flags[INSTALLED] = true;

  window.addEventListener('error', (event) => {
    if (!event.error && IGNORED_MESSAGES.test(event.message)) return;
    recordError(event.error ?? event.message, 'error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    recordError(event.reason, 'unhandledrejection');
  });
}
