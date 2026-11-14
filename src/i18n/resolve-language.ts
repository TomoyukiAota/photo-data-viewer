import { AppIntegration } from '../app-integration/app-integration';
import { UserSettingKey } from '../utils/user-settings';
import {
  defaultLanguage,
  isLanguageCode,
  LanguageCode,
  languageCodes,
  languageSettingAuto,
} from './languages';

/** The query parameter in which Photo Location Map passes the language, as it passes `dateFormat`. */
export const LANGUAGE_PARAM = 'language';

/** Where the language can come from. */
export interface LanguageSources {
  /** Embedded in Photo Location Map, whose window hides the menu and so the Language page. */
  isPlm: boolean;
  /** `language` in the address, which Photo Location Map passes. */
  languageParam: string | null;
  /** The Language setting: `auto` (the browser's language) or a language code. */
  languageSetting: string | null;
  /** `navigator.languages`, the most preferred first. */
  browserLanguages: readonly string[];
}

/** The language of the list with this code, however its case is written, or null. */
function listed(code: string): LanguageCode | null {
  return (
    languageCodes.find(
      (supported) => supported.toLowerCase() === code.toLowerCase(),
    ) ?? null
  );
}

/** The regions that write Chinese in traditional characters: Taiwan, Hong Kong and Macao. */
const traditionalChineseRegions = ['tw', 'hk', 'mo'];

/**
 * The code of the list for a language that the list has under another code
 * than its own, from the subtags of a tag in lower case, or null.
 * - Chinese is listed by its script, while browsers name a region: `zh-TW`,
 *   `zh-HK` and `zh-MO` are `zh-Hant`; `zh`, `zh-CN` and any other are `zh-Hans`.
 * - Portuguese is listed by its region: `pt` alone is `pt-BR`, where most of its
 *   speakers are; a region other than Brazil (`pt-AO`) is `pt-PT`, whose
 *   spelling those regions follow.
 * - Norwegian is listed as Bokmål, `nb`: `no` is Bokmål by default, and a
 *   reader of Nynorsk, `nn`, reads Bokmål too.
 * - Serbian is listed in Latin letters, `sr-Latn`, which a reader of
 *   `sr-Cyrl` reads too.
 */
function listedUnderAnotherCode([language, ...rest]: string[]): string | null {
  switch (language) {
    case 'zh':
      return rest.some((subtag) => traditionalChineseRegions.includes(subtag))
        ? 'zh-Hant'
        : 'zh-Hans';
    case 'pt':
      return rest.length === 0 || rest.includes('br') ? 'pt-BR' : 'pt-PT';
    case 'no':
    case 'nn':
      return 'nb';
    case 'sr':
      return 'sr-Latn';
    default:
      return null;
  }
}

/**
 * The language of the list that one language tag asks for, or null. The tag is
 * matched as it is (`pt-BR`, `zh-Hant`), then without its last part, again and
 * again (`zh-Hant-TW` is `zh-Hant`, `en-GB` is `en`), then as a language that
 * the list has under another code (`zh-TW`, `no`), without regard to case.
 */
function matchTag(tag: string): LanguageCode | null {
  const subtags = tag.toLowerCase().split('-');
  for (let length = subtags.length; length > 0; length--) {
    const code = listed(subtags.slice(0, length).join('-'));
    if (code) return code;
  }
  const otherCode = listedUnderAnotherCode(subtags);
  return otherCode ? listed(otherCode) : null;
}

/**
 * The supported language a list of language tags asks for, or null: the first
 * tag that names a language of the list, in any of the ways of `matchTag`.
 */
export function matchLanguage(tags: readonly string[]): LanguageCode | null {
  for (const tag of tags) {
    const code = matchTag(tag);
    if (code) return code;
  }
  return null;
}

/**
 * The language to show the app in. Embedded in Photo Location Map: the language
 * it passes, or English, as its own window is English; the machine's language
 * is not followed, so that the data is not in another language than the window
 * around it. Standalone: the Language setting unless it is `auto`, then the
 * browser's languages, then English.
 */
export function resolveLanguage(sources: LanguageSources): LanguageCode {
  if (sources.isPlm) {
    const passed = sources.languageParam ? [sources.languageParam] : [];
    return matchLanguage(passed) ?? defaultLanguage;
  }
  const setting = sources.languageSetting;
  if (setting && setting !== languageSettingAuto && isLanguageCode(setting)) {
    return setting;
  }
  return matchLanguage(sources.browserLanguages) ?? defaultLanguage;
}

/** The sources as this browser has them. On the server, there are none. */
export function readLanguageSources(): LanguageSources {
  if (typeof window === 'undefined') {
    return { isPlm: false, languageParam: null, languageSetting: null, browserLanguages: [] };
  }
  let languageSetting: string | null = null;
  try {
    languageSetting = window.localStorage.getItem(UserSettingKey.Language);
  } catch {
    // Storage that cannot be read holds no setting either.
  }
  return {
    isPlm: AppIntegration.isPlm,
    languageParam: new URL(window.location.href).searchParams.get(LANGUAGE_PARAM),
    languageSetting,
    browserLanguages: navigator.languages?.length
      ? navigator.languages
      : [navigator.language],
  };
}

/** The language to show the app in, from what this browser has. */
export function currentLanguage(): LanguageCode {
  return resolveLanguage(readLanguageSources());
}

/** The language the browser asks for, which the `auto` setting follows: for the Language page. */
export function browserLanguage(): LanguageCode {
  return matchLanguage(readLanguageSources().browserLanguages) ?? defaultLanguage;
}
