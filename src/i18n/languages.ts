import en from '../locales/en.json';

/** What a language's `load` gives: its texts, and the name of its dayjs locale, which dayjs knows by then. */
export interface LoadedLanguage {
  translation: object;
  dayjsLocale: string;
}

/**
 * Fetches a language's texts and its dayjs locale, which has its days of the
 * week and AM/PM. Importing a dayjs locale also registers it with dayjs.
 */
async function load(
  translation: Promise<{ default: object }>,
  dayjsLocale: Promise<{ default: { name: string } }>,
): Promise<LoadedLanguage> {
  const [texts, locale] = await Promise.all([translation, dayjsLocale]);
  return { translation: texts.default, dayjsLocale: locale.default.name };
}

/**
 * The languages the app can be shown in, in the order the Language page lists
 * them: by their code. To add one, see docs/TRANSLATING.md: add
 * `src/locales/<code>.json` and an entry here.
 *
 * - `name` is the language's own name, as the Language page lists it;
 *   `englishName` is what the search on that page also finds it by.
 * - `direction` is `rtl` for a language written from right to left.
 * - `load` names the file of its texts and its dayjs locale
 *   (`dayjs/locale/<name>`). TL;DR: each is fetched when the language is first
 *   shown, not with the app. Details: with every language in the app's own
 *   code, each visitor would download all of them to read one. English is the
 *   exception: it is the source and the fallback, so it is part of the app, and
 *   its dayjs locale is built into dayjs.
 */
export const languages = [
  {
    code: 'en',
    englishName: 'English',
    name: 'English',
    direction: 'ltr',
    load: async (): Promise<LoadedLanguage> => ({ translation: en, dayjsLocale: 'en' }),
  },
  {
    code: 'ja',
    englishName: 'Japanese',
    name: '日本語',
    direction: 'ltr',
    load: () => load(import('../locales/ja.json'), import('dayjs/locale/ja')),
  },
] as const;

export type Language = (typeof languages)[number];
export type LanguageCode = Language['code'];

/** English: the source of the translations, and what is shown when nothing else fits. */
export const defaultLanguage: LanguageCode = 'en';

/** The value of the Language setting that means the browser's language. */
export const languageSettingAuto = 'auto';

/** The Language setting: the browser's language, or one of the languages. */
export type LanguageSetting = typeof languageSettingAuto | LanguageCode;

export const languageCodes: readonly LanguageCode[] = languages.map(
  (language) => language.code,
);

export function isLanguageCode(code: string): code is LanguageCode {
  return (languageCodes as readonly string[]).includes(code);
}

export function isLanguageSetting(value: string): value is LanguageSetting {
  return value === languageSettingAuto || isLanguageCode(value);
}

export function getLanguage(code: LanguageCode): Language {
  return languages.find((language) => language.code === code) as Language;
}
