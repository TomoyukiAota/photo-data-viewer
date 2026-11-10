import 'dayjs/locale/ja';

import en from '../locales/en.json';
import ja from '../locales/ja.json';

/**
 * The languages the app can be shown in, in the order the Settings page lists
 * them. To add one, see docs/TRANSLATING.md: add `src/locales/<code>.json` and
 * an entry here, with the language's own name and the dayjs locale that has its
 * days of the week (`import 'dayjs/locale/<code>'` above; English is built into
 * dayjs).
 */
export const languages = [
  { code: 'en', name: 'English', dayjsLocale: 'en', translation: en },
  { code: 'ja', name: '日本語', dayjsLocale: 'ja', translation: ja },
] as const;

export type Language = (typeof languages)[number];
export type LanguageCode = Language['code'];

/** English: the source of the translations, and what is shown when nothing else fits. */
export const defaultLanguage: LanguageCode = 'en';

/** The value of the Language setting that means the browser's language. */
export const languageSettingAuto = 'auto';

export const languageCodes: readonly LanguageCode[] = languages.map(
  (language) => language.code,
);

export function isLanguageCode(code: string): code is LanguageCode {
  return (languageCodes as readonly string[]).includes(code);
}

export function getLanguage(code: LanguageCode): Language {
  return languages.find((language) => language.code === code) as Language;
}

/** The translations as i18next takes them: one namespace, `translation`, per language. */
export const resources = Object.fromEntries(
  languages.map((language) => [
    language.code,
    { translation: language.translation },
  ]),
);
