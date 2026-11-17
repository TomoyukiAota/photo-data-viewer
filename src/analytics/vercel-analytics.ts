import { PHOTO_PATH_PARAM } from './ga4-page';
import { isUsageDataSent } from './opt-out';

// What the scripts of Vercel's Web Analytics and Speed Insights pass each event
// through before they send it (their `beforeSend`, as Vercel documents it for
// an opt-out and for an address to redact): nothing is sent while usage data
// is turned off in Settings, and the page's address goes without the photo's
// path, as GA4 is given it (ga4-page.ts). VercelAnalytics.tsx does not load
// the scripts while the setting is off; this stops what they send once it is
// turned off.
export function beforeSendToVercel<Event extends { url: string }>(
  event: Event,
): Event | null {
  if (!isUsageDataSent()) return null;

  try {
    const url = new URL(event.url);
    url.searchParams.delete(PHOTO_PATH_PARAM);
    return { ...event, url: url.toString() };
  } catch {
    return null; // An address that cannot be read is not sent.
  }
}
