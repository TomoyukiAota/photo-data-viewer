import { IconDataUrl } from '../../icons/icon-data-url';

/** The name of an icon of IconDataUrl. */
export type IconName = Exclude<keyof typeof IconDataUrl, 'prototype'>;

export interface IconCredit {
  /** The author's name, as Flaticon writes it. */
  author: string;
  /** The author's page on Flaticon. */
  authorUrl: string;
  /** The author's icons that the app shows. */
  icons: readonly IconName[];
  /** The license of an icon that Flaticon has under another license than its own. */
  license?: { name: string; url: string };
}

/**
 * The icons that are drawn light, which the app shows on a dark background:
 * the rotate icon is on the photo's button (PhotoImage.module.scss). The
 * Credits page shows them on one as well.
 */
export const iconsOnDark: ReadonlySet<IconName> = new Set(['rotate']);

/**
 * The authors of the icons from Flaticon that the app shows, each with its
 * icons, which the Credits page credits.
 *
 * TL;DR: A line for each author, as Flaticon's license asks of an icon that is
 * used for free.
 * Details: Flaticon asks for "Icon made by <author> from www.flaticon.com" on
 * the page where the icon is shown or on a page of credits, once for each
 * author (https://support.flaticon.com/s/article/Attribution-How-when-and-where-FI).
 * The icons of Font Awesome, by Dave Gandy, are under Creative Commons' license
 * instead, which asks for the license to be named. An icon from Flaticon that
 * is added to icon-data-url.ts is added here with its author: the unit test of
 * this list fails until it is.
 */
export const iconCredits: readonly IconCredit[] = [
  {
    author: 'Magnific',
    authorUrl: 'https://www.flaticon.com/authors/magnific',
    icons: ['googleMapsIcon', 'googleEarthIcon', 'rotate'],
  },
  {
    author: 'srip',
    authorUrl: 'https://www.flaticon.com/authors/srip',
    icons: ['googleStreetViewIcon'],
  },
  {
    author: 'Dave Gandy',
    authorUrl: 'https://www.flaticon.com/authors/dave-gandy',
    icons: ['gitHubLogo'],
    license: {
      name: 'CC BY 3.0',
      url: 'https://creativecommons.org/licenses/by/3.0/',
    },
  },
];
