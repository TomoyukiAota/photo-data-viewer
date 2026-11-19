import type { GetStaticProps } from 'next';

import { appName } from '../../app-integration/app-name';
import { languageOfLocale } from '../../i18n/address';
import { defaultLanguage } from '../../i18n/languages';
import { textsOf } from '../../i18n/static-texts';
import { SearchHeadProps, SearchPage, searchPages } from './SearchHead';

/**
 * What the head of a page says to search engines (SearchHead.tsx), in the
 * language of its address, the `locale` that Next.js gives `getStaticProps`:
 * for a page whose `getStaticProps` gives other props as well. The others use
 * `searchHeadStaticProps`.
 *
 * The deployment for Photo Location Map is served without that head, as its
 * window takes the title of its page (SearchHead.tsx).
 */
export async function searchHeadOf(
  page: SearchPage,
  locale: string | undefined,
): Promise<SearchHeadProps | null> {
  if (process.env.PDV_IN_PLM === 'True') return null;
  const language = languageOfLocale(locale);
  const t = await textsOf(language ?? defaultLanguage);
  const { titleKey, descriptionKey } = searchPages[page];
  return {
    page,
    language,
    title: titleKey ? t(titleKey) : appName.standalone,
    description: t(descriptionKey),
  };
}

/**
 * The `getStaticProps` of a page: what its head says to search engines
 * (SearchHead.tsx), in the language of its address. Next.js prerenders a page
 * once for each language when the app is built (`i18n` in next.config.js), and
 * gives its props to the browser with the page, so the browser has the texts at
 * once, before the texts of the language arrive. Only the code of the server
 * runs it, so the browser fetches no translation for it.
 */
export function searchHeadStaticProps(
  page: SearchPage,
): GetStaticProps<{ searchHead: SearchHeadProps | null }> {
  return async ({ locale }) => ({
    props: { searchHead: await searchHeadOf(page, locale) },
  });
}
