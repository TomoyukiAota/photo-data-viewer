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
 * them, which is Photo Location Map's too: by their names, those written in
 * Latin letters by alphabet, then the other scripts. It is the order in which
 * a collator for English sorts the names, and the check of the translation
 * files holds the list to it. To add a language, see docs/TRANSLATING.md: add
 * `src/locales/<code>.json` and an entry here.
 *
 * - `name` is the language's own name, with a capital letter where its script
 *   has them, as macOS lists languages, and as the Language page lists it;
 *   `englishName` is what the search on that page also finds it by.
 * - `flag` is the flag shown beside the name in that list, by its name in the
 *   flag-icons package. TL;DR: the flag of the country that Unicode gives the
 *   language as its likeliest (`new Intl.Locale(code).maximize().region`, in
 *   lower case), as in Photo Location Map. Details: a language of a region
 *   that has a flag of its own has that flag, as Catalan has Catalonia's
 *   (`es-ct`), Basque the Basque Country's (`es-pv`) and Galician Galicia's
 *   (`es-ga`); Arabic, a language of many countries, has the Arab League's
 *   (`arab`). The styles of the list include each of these flags and no other
 *   (LanguageList.module.scss), which a test checks (language-flags.spec.ts).
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
    code: 'id',
    englishName: 'Indonesian',
    name: 'Bahasa Indonesia',
    flag: 'id',
    direction: 'ltr',
    load: () => load(import('../locales/id.json'), import('dayjs/locale/id')),
  },
  {
    code: 'ms',
    englishName: 'Malay',
    name: 'Bahasa Melayu',
    flag: 'my',
    direction: 'ltr',
    load: () => load(import('../locales/ms.json'), import('dayjs/locale/ms')),
  },
  {
    code: 'ca',
    englishName: 'Catalan',
    name: 'Català',
    flag: 'es-ct',
    direction: 'ltr',
    load: () => load(import('../locales/ca.json'), import('dayjs/locale/ca')),
  },
  {
    code: 'cs',
    englishName: 'Czech',
    name: 'Čeština',
    flag: 'cz',
    direction: 'ltr',
    load: () => load(import('../locales/cs.json'), import('dayjs/locale/cs')),
  },
  {
    code: 'da',
    englishName: 'Danish',
    name: 'Dansk',
    flag: 'dk',
    direction: 'ltr',
    load: () => load(import('../locales/da.json'), import('dayjs/locale/da')),
  },
  {
    code: 'de',
    englishName: 'German',
    name: 'Deutsch',
    flag: 'de',
    direction: 'ltr',
    load: () => load(import('../locales/de.json'), import('dayjs/locale/de')),
  },
  {
    code: 'et',
    englishName: 'Estonian',
    name: 'Eesti',
    flag: 'ee',
    direction: 'ltr',
    load: () => load(import('../locales/et.json'), import('dayjs/locale/et')),
  },
  {
    code: 'en',
    englishName: 'English',
    name: 'English',
    flag: 'us',
    direction: 'ltr',
    load: async (): Promise<LoadedLanguage> => ({ translation: en, dayjsLocale: 'en' }),
  },
  {
    code: 'es',
    englishName: 'Spanish',
    name: 'Español',
    flag: 'es',
    direction: 'ltr',
    load: () => load(import('../locales/es.json'), import('dayjs/locale/es')),
  },
  {
    code: 'eu',
    englishName: 'Basque',
    name: 'Euskara',
    flag: 'es-pv',
    direction: 'ltr',
    load: () => load(import('../locales/eu.json'), import('dayjs/locale/eu')),
  },
  {
    code: 'fr',
    englishName: 'French',
    name: 'Français',
    flag: 'fr',
    direction: 'ltr',
    load: () => load(import('../locales/fr.json'), import('dayjs/locale/fr')),
  },
  {
    code: 'gl',
    englishName: 'Galician',
    name: 'Galego',
    flag: 'es-ga',
    direction: 'ltr',
    load: () => load(import('../locales/gl.json'), import('dayjs/locale/gl')),
  },
  {
    code: 'hr',
    englishName: 'Croatian',
    name: 'Hrvatski',
    flag: 'hr',
    direction: 'ltr',
    load: () => load(import('../locales/hr.json'), import('dayjs/locale/hr')),
  },
  {
    code: 'it',
    englishName: 'Italian',
    name: 'Italiano',
    flag: 'it',
    direction: 'ltr',
    load: () => load(import('../locales/it.json'), import('dayjs/locale/it')),
  },
  {
    code: 'lv',
    englishName: 'Latvian',
    name: 'Latviešu',
    flag: 'lv',
    direction: 'ltr',
    load: () => load(import('../locales/lv.json'), import('dayjs/locale/lv')),
  },
  {
    code: 'lt',
    englishName: 'Lithuanian',
    name: 'Lietuvių',
    flag: 'lt',
    direction: 'ltr',
    load: () => load(import('../locales/lt.json'), import('dayjs/locale/lt')),
  },
  {
    code: 'hu',
    englishName: 'Hungarian',
    name: 'Magyar',
    flag: 'hu',
    direction: 'ltr',
    load: () => load(import('../locales/hu.json'), import('dayjs/locale/hu')),
  },
  {
    code: 'nl',
    englishName: 'Dutch',
    name: 'Nederlands',
    flag: 'nl',
    direction: 'ltr',
    load: () => load(import('../locales/nl.json'), import('dayjs/locale/nl')),
  },
  {
    code: 'nb',
    englishName: 'Norwegian Bokmål',
    name: 'Norsk bokmål',
    flag: 'no',
    direction: 'ltr',
    load: () => load(import('../locales/nb.json'), import('dayjs/locale/nb')),
  },
  {
    code: 'pl',
    englishName: 'Polish',
    name: 'Polski',
    flag: 'pl',
    direction: 'ltr',
    load: () => load(import('../locales/pl.json'), import('dayjs/locale/pl')),
  },
  {
    code: 'pt-BR',
    englishName: 'Portuguese (Brazil)',
    name: 'Português (Brasil)',
    flag: 'br',
    direction: 'ltr',
    load: () => load(import('../locales/pt-BR.json'), import('dayjs/locale/pt-br')),
  },
  {
    code: 'pt-PT',
    englishName: 'Portuguese (Portugal)',
    name: 'Português (Portugal)',
    flag: 'pt',
    direction: 'ltr',
    load: () => load(import('../locales/pt-PT.json'), import('dayjs/locale/pt')),
  },
  {
    code: 'ro',
    englishName: 'Romanian',
    name: 'Română',
    flag: 'ro',
    direction: 'ltr',
    load: () => load(import('../locales/ro.json'), import('dayjs/locale/ro')),
  },
  {
    code: 'sk',
    englishName: 'Slovak',
    name: 'Slovenčina',
    flag: 'sk',
    direction: 'ltr',
    load: () => load(import('../locales/sk.json'), import('dayjs/locale/sk')),
  },
  {
    code: 'sl',
    englishName: 'Slovenian',
    name: 'Slovenščina',
    flag: 'si',
    direction: 'ltr',
    load: () => load(import('../locales/sl.json'), import('dayjs/locale/sl')),
  },
  {
    code: 'sr-Latn',
    englishName: 'Serbian (Latin)',
    name: 'Srpski (latinica)',
    flag: 'rs',
    direction: 'ltr',
    load: () => load(import('../locales/sr-Latn.json'), import('dayjs/locale/sr')),
  },
  {
    code: 'fi',
    englishName: 'Finnish',
    name: 'Suomi',
    flag: 'fi',
    direction: 'ltr',
    load: () => load(import('../locales/fi.json'), import('dayjs/locale/fi')),
  },
  {
    code: 'sv',
    englishName: 'Swedish',
    name: 'Svenska',
    flag: 'se',
    direction: 'ltr',
    load: () => load(import('../locales/sv.json'), import('dayjs/locale/sv')),
  },
  {
    code: 'vi',
    englishName: 'Vietnamese',
    name: 'Tiếng Việt',
    flag: 'vn',
    direction: 'ltr',
    load: () => load(import('../locales/vi.json'), import('dayjs/locale/vi')),
  },
  {
    code: 'tr',
    englishName: 'Turkish',
    name: 'Türkçe',
    flag: 'tr',
    direction: 'ltr',
    load: () => load(import('../locales/tr.json'), import('dayjs/locale/tr')),
  },
  {
    code: 'el',
    englishName: 'Greek',
    name: 'Ελληνικά',
    flag: 'gr',
    direction: 'ltr',
    load: () => load(import('../locales/el.json'), import('dayjs/locale/el')),
  },
  {
    code: 'bg',
    englishName: 'Bulgarian',
    name: 'Български',
    flag: 'bg',
    direction: 'ltr',
    load: () => load(import('../locales/bg.json'), import('dayjs/locale/bg')),
  },
  {
    code: 'ru',
    englishName: 'Russian',
    name: 'Русский',
    flag: 'ru',
    direction: 'ltr',
    load: () => load(import('../locales/ru.json'), import('dayjs/locale/ru')),
  },
  {
    code: 'uk',
    englishName: 'Ukrainian',
    name: 'Українська',
    flag: 'ua',
    direction: 'ltr',
    load: () => load(import('../locales/uk.json'), import('dayjs/locale/uk')),
  },
  {
    code: 'he',
    englishName: 'Hebrew',
    name: 'עברית',
    flag: 'il',
    direction: 'rtl',
    load: () => load(import('../locales/he.json'), import('dayjs/locale/he')),
  },
  {
    code: 'ar',
    englishName: 'Arabic',
    name: 'العربية',
    flag: 'arab',
    direction: 'rtl',
    load: () => load(import('../locales/ar.json'), import('dayjs/locale/ar')),
  },
  {
    code: 'hi',
    englishName: 'Hindi',
    name: 'हिन्दी',
    flag: 'in',
    direction: 'ltr',
    load: () => load(import('../locales/hi.json'), import('dayjs/locale/hi')),
  },
  {
    code: 'th',
    englishName: 'Thai',
    name: 'ไทย',
    flag: 'th',
    direction: 'ltr',
    load: () => load(import('../locales/th.json'), import('dayjs/locale/th')),
  },
  {
    code: 'ko',
    englishName: 'Korean',
    name: '한국어',
    flag: 'kr',
    direction: 'ltr',
    load: () => load(import('../locales/ko.json'), import('dayjs/locale/ko')),
  },
  {
    code: 'ja',
    englishName: 'Japanese',
    name: '日本語',
    flag: 'jp',
    direction: 'ltr',
    load: () => load(import('../locales/ja.json'), import('dayjs/locale/ja')),
  },
  {
    code: 'zh-Hans',
    englishName: 'Chinese (Simplified)',
    name: '简体中文',
    flag: 'cn',
    direction: 'ltr',
    load: () => load(import('../locales/zh-Hans.json'), import('dayjs/locale/zh-cn')),
  },
  {
    code: 'zh-Hant',
    englishName: 'Chinese (Traditional)',
    name: '繁體中文',
    flag: 'tw',
    direction: 'ltr',
    load: () => load(import('../locales/zh-Hant.json'), import('dayjs/locale/zh-tw')),
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
