import { AnalyticsBackendEvent } from './backend-event';

const UNSENT_EVENTS_KEY = 'AnalyticsUnsentEvents';

// The most kept for the next page load: a few hundred kilobytes of storage, which
// browsers give about 5 MB of per site.
export const MAX_KEPT_EVENTS = 1_000;

// What is not sent yet when the page is hidden, kept for the next page load, as
// Photo Location Map keeps it in a file on quit. The page may be closed while it is
// hidden, and a request it starts then may not finish. Events sent anyway arrive
// twice, which queries drop by event_id, as for any retry.
export class UnsentEvents {
  constructor(private readonly storage: Storage | undefined) {}

  public save(events: AnalyticsBackendEvent[]): void {
    try {
      if (events.length === 0) {
        this.storage?.removeItem(UNSENT_EVENTS_KEY);
        return;
      }
      this.storage?.setItem(UNSENT_EVENTS_KEY, JSON.stringify(events.slice(-MAX_KEPT_EVENTS)));
    } catch {
      // Storage that is full or cannot be used: the events are sent if the page stays.
    }
  }

  /** What the last page load kept, which is removed: it is sent from this page load's queue now. */
  public loadAndRemove(): AnalyticsBackendEvent[] {
    try {
      const saved = this.storage?.getItem(UNSENT_EVENTS_KEY);
      this.storage?.removeItem(UNSENT_EVENTS_KEY);
      const events = saved ? JSON.parse(saved) : [];
      return Array.isArray(events) ? events : [];
    } catch {
      return [];
    }
  }

  public remove(): void {
    try {
      this.storage?.removeItem(UNSENT_EVENTS_KEY);
    } catch {
      // Nothing to do.
    }
  }
}
