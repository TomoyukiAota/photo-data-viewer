import { createInstance } from 'i18next';

import { appName } from '../app-integration/app-name';
import en from '../locales/en.json';
import { defaultLanguage, getLanguage, LanguageCode } from './languages';

/**
 * The texts of a language, with English for any that it does not have, as the
 * app shows them (i18n.ts), for a page's `getStaticProps`. Only the code of the
 * server runs that, when the app is built, and the page brings what it gives in
 * its props, so the browser fetches no translation for it.
 */
export async function textsOf(language: LanguageCode) {
  const translation =
    language === defaultLanguage
      ? en
      : (await getLanguage(language).load()).translation;
  const i18n = createInstance();
  await i18n.init({
    lng: language,
    fallbackLng: defaultLanguage,
    resources: {
      [defaultLanguage]: { translation: en },
      [language]: { translation },
    },
    interpolation: {
      escapeValue: false, // React escapes what it renders.
      defaultVariables: { appName: appName.standalone },
    },
  });
  return i18n.t;
}
