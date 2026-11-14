import dayjs from 'dayjs';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

import { appName } from '../app-integration/app-name';
import { loadRtlStyles } from '../direction/rtl-styles';
import en from '../locales/en.json';
import { defaultLanguage, getLanguage, LanguageCode } from './languages';
import { currentLanguage } from './resolve-language';

// The texts of the app, in the language it is shown in. _app.tsx imports this
// first, so that the language is decided before anything is rendered. English
// is part of the app's code, and i18next initializes with it at once; any other
// language is fetched when it is first shown (`load` in languages.ts), and the
// app renders nothing until the language it starts in has arrived
// (useLanguageReady). On the server, where Next.js prerenders the pages,
// nothing is rendered, and English is set.
i18next.use(initReactI18next).init({
  resources: { [defaultLanguage]: { translation: en } },
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false, // React escapes what it renders.
    defaultVariables: { appName: appName.standalone }, // `{{appName}}` in any text.
  },
});

/** The dayjs locale of each language whose texts are loaded. */
const dayjsLocales = new Map<LanguageCode, string>();
/** The languages being fetched, so that one is fetched once however often it is asked for. */
const loading = new Map<LanguageCode, Promise<void>>();

/** Whether a language's texts and dayjs locale are here, so that it can be shown at once. */
export function isLanguageLoaded(code: LanguageCode): boolean {
  return dayjsLocales.has(code);
}

/**
 * Fetches a language's texts and its dayjs locale, unless they are here
 * already, and, for a language written from right to left, the styles that lay
 * MUI's components out that way. When they cannot be fetched, with no
 * connection for instance, the error is reported and the promise is rejected;
 * asking again then tries again.
 */
export function loadLanguage(code: LanguageCode): Promise<void> {
  if (isLanguageLoaded(code)) return Promise.resolve();
  let fetching = loading.get(code);
  if (!fetching) {
    const language = getLanguage(code);
    fetching = Promise.all([
      language.load(),
      language.direction === 'rtl' ? loadRtlStyles() : undefined,
    ])
      .then(([{ translation, dayjsLocale }]) => {
        i18next.addResourceBundle(code, 'translation', translation);
        dayjsLocales.set(code, dayjsLocale);
      })
      .catch((error) => {
        report(error);
        throw error;
      })
      .finally(() => loading.delete(code));
    loading.set(code, fetching);
  }
  return fetching;
}

/** Shows the app in a language that is loaded: its texts, its days of the week, and the page's `lang` and `dir`. */
function showLanguage(code: LanguageCode): void {
  if (i18next.language !== code) {
    i18next.changeLanguage(code);
  }
  dayjs.locale(dayjsLocales.get(code));
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
    document.documentElement.dir = getLanguage(code).direction;
  }
}

/**
 * Shows the app in a language, once it is loaded: the texts, the days of the
 * week and the meridiem that dayjs formats, and the page's `lang`, by which
 * browsers choose the glyphs of Japanese and Chinese, and `dir`, the direction
 * the language is written in, which the layout follows (DirectionProvider.tsx
 * for MUI's components). The Language page calls this when the setting
 * changes, before it loads the photo again for its dates. The promise is
 * rejected, and the language stays as it was, when the language cannot be
 * fetched.
 */
export async function applyLanguage(code: LanguageCode): Promise<void> {
  await loadLanguage(code);
  showLanguage(code);
}

/** Reports an error as one that nothing handled, which logs it and records it (src/analytics/record-error.ts). */
function report(error: unknown): void {
  if (typeof reportError === 'function') reportError(error);
  else console.error(error);
}

// English is loaded from the start. Its dayjs locale is built into dayjs.
dayjsLocales.set(defaultLanguage, 'en');

const initialLanguage = currentLanguage();
let isReady = isLanguageLoaded(initialLanguage);
if (isReady) showLanguage(initialLanguage);

/**
 * Settled when the app shows the language it starts in. A language that cannot
 * be fetched leaves the app in English, so that it is shown rather than not;
 * the setting stays, and is tried again the next time the app is opened.
 */
export const languageReady: Promise<void> = isReady
  ? Promise.resolve()
  : applyLanguage(initialLanguage)
      .catch(() => showLanguage(defaultLanguage)) // loadLanguage reported why.
      .then(() => {
        isReady = true;
      });

/** Whether the app shows the language it starts in, so that it can be rendered: at once in English, after its texts arrive otherwise. */
export function useLanguageReady(): boolean {
  const [ready, setReady] = useState(isReady);
  useEffect(() => {
    let isMounted = true;
    languageReady.then(() => {
      if (isMounted) setReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return ready;
}

export default i18next;
