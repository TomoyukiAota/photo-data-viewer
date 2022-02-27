export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '';
export const GA_ID_EXISTS = !!GA_ID;

// Send a pageview to Google Analytics.
// See https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(path: string) {
  window.gtag('config', GA_ID, {
    page_path: path,
  });
}

// Send a Google Analytics Event.
// See https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event(category: string, action: string, label: string, value = '') {
  if (!GA_ID_EXISTS) {
    return;
  }

  if (typeof window === 'undefined') {
    return; // Avoid compile error during Next.js SSR
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}
