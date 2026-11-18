// How the page is shown, as the `display-mode` media feature tells it:
// `standalone` in the window of the installed app (Chrome and Edge install it
// from public/manifest.webmanifest) and on an iPhone or iPad opened from the
// Home Screen, `browser` in a tab of the browser, and `fullscreen` in the
// browser's full screen. Safari on iPhone and iPad also tells the Home Screen
// apart with `navigator.standalone`, its own property, which is read as well.
const DISPLAY_MODES = [
  'standalone',
  'window-controls-overlay',
  'minimal-ui',
  'fullscreen',
  'browser',
] as const;

export type DisplayMode = (typeof DISPLAY_MODES)[number] | 'unknown';

export function displayMode(): DisplayMode {
  if ((navigator as Navigator & { standalone?: boolean }).standalone === true) {
    return 'standalone';
  }
  if (typeof window.matchMedia !== 'function') return 'unknown';
  return (
    DISPLAY_MODES.find(
      (mode) => window.matchMedia(`(display-mode: ${mode})`).matches,
    ) ?? 'unknown'
  );
}
