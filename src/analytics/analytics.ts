import { EventFields, toGa4Params } from './event-fields';
import * as ga4 from './ga4';
import { Ga4EventNameType } from './ga4-event-name';
import { isUsageDataSent } from './opt-out';
import { sendToPlmBackend } from './plm-backend';

export interface AnalyticsEvent {
  /** What the analytics backends record, named as this app has always named it. */
  category: string;
  action: string;
  /** Text, or fields, which the analytics backends receive as JSON and GA4 as event parameters (event-fields.ts). */
  label?: string | EventFields;
  value?: string;
  /** What GA4 records instead of the action, as GA4's rules allow no spaces or brackets in a name. */
  ga4Name: Ga4EventNameType;
  /** Details sent to GA4 as event parameters, besides the category, the label and the value. */
  ga4Params?: ga4.Ga4Params;
}

// Every event goes through here to each place it is sent, so that where events
// are sent, and whether they are sent at all, is decided in one place. The helpers
// in track-event.ts call this, and the rest of the app calls those.
export function trackEvent(event: AnalyticsEvent): void {
  if (!isUsageDataSent()) return;

  const { category, action, value } = event;
  const label = typeof event.label === 'object' ? JSON.stringify(event.label) : event.label;
  const labelParams = typeof event.label === 'object' ? toGa4Params(event.label) : { event_label: event.label ?? '' };
  ga4.event(event.ga4Name, {
    event_category: category,
    ...labelParams,
    value: value ?? '',
    ...event.ga4Params,
  });
  sendToPlmBackend(category, action, label, value);
}

export function trackPageView(path: string): void {
  if (!isUsageDataSent()) return;

  ga4.pageview(path);
}

// Applies a change of the setting to what is sent outside this module, which is
// GA4's own automatic events. Everything else asks isUsageDataSent each time.
export function applyUsageDataSetting(send: boolean): void {
  ga4.setDisabled(!send);
}
