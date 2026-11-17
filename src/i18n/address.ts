import { isLanguageCode, LanguageCode, languageCodes } from './languages';

// TL;DR: An address can name its language, as `/ja/about` does: that page is
// in Japanese, whatever the setting. `/about` is as it always was.
// Details: Next.js gives each language an address of its own (`i18n` in
// next.config.js), so that search engines can show each page in each language
// (src/components/search-head/SearchHead.tsx). An address without a language
// shows the language of the setting or the browser.

/**
 * The locale that Next.js gives an address without a language, such as
 * `/about`: one that names no language, as Next.js' guide sets up a default
 * locale that is not one of the languages.
 */
export const DEFAULT_LOCALE = 'default';

/**
 * The part of an address that names its language, such as `/ja` of
 * `/ja/about`, written in any case, as Next.js matches it.
 */
export const LANGUAGE_PREFIX = new RegExp(
  `^/(${languageCodes.join('|')})(?=/|$)`,
  'i',
);

/** The language that the path of an address names, such as `ja` for `/ja/about`, or null. */
export function languageOfPath(pathname: string): LanguageCode | null {
  const named = LANGUAGE_PREFIX.exec(pathname)?.[1].toLowerCase();
  if (!named) return null;
  return languageCodes.find((code) => code.toLowerCase() === named) ?? null;
}

/** The page of a path, without its language: `/about` for `/ja/about`, and `/` for `/ja`. */
export function pageOfPath(pathname: string): string {
  return pathname.replace(LANGUAGE_PREFIX, '') || '/';
}

/** The language of the locale that Next.js gives a page, or null for an address without one. */
export function languageOfLocale(
  locale: string | undefined,
): LanguageCode | null {
  return locale && isLanguageCode(locale) ? locale : null;
}
