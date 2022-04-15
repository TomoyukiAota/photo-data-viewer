import { trackOpenUrl } from "../google-analytics/track-event";

export function openUrl(url: string, urlDescription: string, from: string): void {
  openTabWithoutOpener(url);
  trackOpenUrl(url, urlDescription, from);
}

export function openTabWithoutOpener(url: string): void {
  // Ideally 'noopener' is passed to window.open, but it causes macOS's Safari to open a window instead of a tab.
  // As a workaround, 'noopener' is not specified but opener is set to null.
  const openedWindow = window.open(url, '_blank');
  if (openedWindow) {
    openedWindow.opener = null;
  }
}
