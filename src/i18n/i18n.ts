import dayjs from 'dayjs';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { appName } from '../app-integration/app-name';
import {
  defaultLanguage,
  getLanguage,
  LanguageCode,
  resources,
} from './languages';
import { currentLanguage } from './resolve-language';

// The texts of the app, in the language it is shown in. _app.tsx imports this
// first, so that the language is decided and the texts are ready before
// anything is rendered; with the translations bundled, i18next initializes at
// once. On the server, where Next.js prerenders the pages, nothing is rendered,
// and English is set.
const initialLanguage = currentLanguage();

i18next.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false, // React escapes what it renders.
    defaultVariables: { appName: appName.standalone }, // `{{appName}}` in any text.
  },
});

/**
 * Shows the app in a language: the texts, the days of the week and the
 * meridiem that dayjs formats, and the page's `lang`, by which browsers choose
 * the glyphs of Japanese and Chinese. The Settings page calls this when the
 * setting changes, before it loads the photo again for its dates.
 */
export function applyLanguage(code: LanguageCode): void {
  if (i18next.language !== code) {
    i18next.changeLanguage(code);
  }
  dayjs.locale(getLanguage(code).dayjsLocale);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
  }
}

applyLanguage(initialLanguage);

export default i18next;
