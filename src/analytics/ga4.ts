import { ga4PageFields } from './ga4-page';

export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '';
export const GA_ID_EXISTS = !!GA_ID;

export const GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

// The property gtag.js reads to send nothing at all, its own automatic events included.
// See https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out
export const GA_DISABLE_PROPERTY = `ga-disable-${GA_ID}`;

export type Ga4Params = Record<string, string | number | boolean>;

// Send a pageview to Google Analytics.
// See https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(path: string) {
  if (!GA_ID_EXISTS) {
    return;
  }

  window.gtag('config', GA_ID, {
    page_path: path,
    ...ga4PageFields(window.location.href),
  });
}

// Send a Google Analytics Event.
// See https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(name: string, params: Ga4Params) {
  if (!GA_ID_EXISTS) {
    return;
  }

  if (typeof window === 'undefined') {
    return; // Avoid compile error during Next.js SSR
  }

  window.gtag('event', name, params);
}

// Stops or resumes everything gtag.js sends. The inline script in _document.tsx loads
// and configures gtag.js only while usage data is sent, so that nothing is fetched from
// Google otherwise, and so that a page loaded meanwhile is never reported. When sending
// is turned on again in such a page, gtag.js is loaded and configured here instead, for
// the page as it is then.
export function setDisabled(disabled: boolean) {
  if (!GA_ID_EXISTS || typeof window === 'undefined') {
    return;
  }

  (window as unknown as Record<string, unknown>)[GA_DISABLE_PROPERTY] = disabled;
  if (!disabled && !document.querySelector(`script[src="${GTAG_SRC}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = GTAG_SRC;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      page_path: window.location.pathname,
      ...ga4PageFields(window.location.href),
    });
  }
}
