import { createInstance } from 'i18next';
import type { GetStaticProps } from 'next';

import { appName } from '../../app-integration/app-name';
import { languageOfLocale } from '../../i18n/address';
import {
  defaultLanguage,
  getLanguage,
  LanguageCode,
} from '../../i18n/languages';
import en from '../../locales/en.json';
import { SearchHeadProps, SearchPage, searchPages } from './SearchHead';

/** The texts of a language, with English for any that it does not have, as the app shows them (src/i18n/i18n.ts). */
async function textsOf(language: LanguageCode) {
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

/**
 * The `getStaticProps` of a page: what its head says to search engines
 * (SearchHead.tsx), in the language of its address. Next.js prerenders a page
 * once for each language when the app is built (`i18n` in next.config.js), and
 * gives its props to the browser with the page, so the browser has the texts at
 * once, before the texts of the language arrive. Only the code of the server
 * runs it, so the browser fetches no translation for it.
 *
 * The deployment for Photo Location Map is served without that head, as its
 * window takes the title of its page (SearchHead.tsx).
 */
export function searchHeadStaticProps(
  page: SearchPage,
): GetStaticProps<{ searchHead: SearchHeadProps | null }> {
  return async ({ locale }) => {
    if (process.env.PDV_IN_PLM === 'True')
      return { props: { searchHead: null } };
    const language = languageOfLocale(locale);
    const t = await textsOf(language ?? defaultLanguage);
    const { titleKey, descriptionKey } = searchPages[page];
    return {
      props: {
        searchHead: {
          page,
          language,
          title: titleKey ? t(titleKey) : appName.standalone,
          description: t(descriptionKey),
        },
      },
    };
  };
}
