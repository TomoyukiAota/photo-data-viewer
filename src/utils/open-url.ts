import { trackOpenUrl } from "../google-analytics/track-event";

export function openUrl(url: string, urlDescription: string, from: string): void {
  window.open(url, '_blank', 'noopener');
  trackOpenUrl(url, urlDescription, from);
}
