import { appName } from '../app-integration/app-name';
import { pageTitleDefaultValue } from '../context/page-title/page-title-default-value';

// What GA4 records of the page: its address and its title, which gtag.js would
// otherwise read from the page as it is. Neither may carry the photo: Photo Location
// Map opens this app with the photo's path on the user's computer in the address,
// and the home page's title takes the photo's file name once one is loaded.

/** The query parameter Photo Location Map passes the photo's path in. */
export const PHOTO_PATH_PARAM = 'photoPath';

/** Each page's own title, as GA4 records it: never the photo's. */
export const GA4_PAGE_TITLES: Readonly<Record<string, string>> = {
  '/': pageTitleDefaultValue.index,
  '/demo': pageTitleDefaultValue.demo,
  '/settings': pageTitleDefaultValue.settings,
  '/about': pageTitleDefaultValue.about,
};

export const GA4_FALLBACK_TITLE = appName.standalone;

export interface Ga4PageFields {
  page_location: string;
  page_title: string;
}

// The address without the photo's path, any other parameter kept (a campaign's,
// say), and the page's own title. Given to gtag.js with each 'config', whose fields
// it keeps for the events after it. _document.tsx does the same for the first page.
export function ga4PageFields(href: string): Ga4PageFields {
  const url = new URL(href);
  url.searchParams.delete(PHOTO_PATH_PARAM);
  return {
    page_location: url.toString(),
    page_title: GA4_PAGE_TITLES[url.pathname] ?? GA4_FALLBACK_TITLE,
  };
}
