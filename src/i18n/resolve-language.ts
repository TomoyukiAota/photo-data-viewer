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
  /** Embedded in Photo Location Map, whose window hides the menu and so the Settings page. */
  isPlm: boolean;
  /** `language` in the address, which Photo Location Map passes. */
  languageParam: string | null;
  /** The Language setting: `auto` (the browser's language) or a language code. */
  languageSetting: string | null;
  /** `navigator.languages`, the most preferred first. */
  browserLanguages: readonly string[];
}

/**
 * The supported language a list of language tags asks for, or null. Each tag is
 * matched as it is (`pt-BR`) and then by its language alone (`pt`) before the
 * next tag is tried, without regard to case.
 */
export function matchLanguage(tags: readonly string[]): LanguageCode | null {
  for (const tag of tags) {
    for (const candidate of [tag, tag.split('-')[0]]) {
      const code = languageCodes.find(
        (supported) => supported.toLowerCase() === candidate.toLowerCase(),
      );
      if (code) return code;
    }
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

/** The language the browser asks for, which the `auto` setting follows: for the Settings page. */
export function browserLanguage(): LanguageCode {
  return matchLanguage(readLanguageSources().browserLanguages) ?? defaultLanguage;
}
