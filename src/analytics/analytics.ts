import * as ga4 from './ga4';
import { sendToPlmBackend } from './plm-backend';

// Every event goes through here to each place it is sent, so that where events
// are sent, and whether they are sent at all, is decided in one place. The helpers
// in track-event.ts call this, and the rest of the app calls those.
export function trackEvent(category: string, action: string, label?: string, value?: string): void {
  ga4.event(category, action, label ?? '', value ?? '');
  sendToPlmBackend(category, action, label, value);
}
