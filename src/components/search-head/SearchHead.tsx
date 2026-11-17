import Head from 'next/head';

import { AppIntegration } from '../../app-integration/app-integration';
import { appName } from '../../app-integration/app-name';
import { LanguageCode, languageCodes } from '../../i18n/languages';

/** The address of the standalone app, which search engines show. A page's canonical address is on it, wherever the page is served from. */
export const SITE_URL = 'https://photo-data-viewer.vercel.app';

/**
 * The pages that search engines are told about, by their paths, with the keys
 * of their title and their description in the translation files
 * (src/locales). The Home page's title is the app's name, the same in every
 * language.
 */
export const searchPages = {
  '/': { titleKey: null, descriptionKey: 'pageDescription.home' },
  '/demo': {
    titleKey: 'pageTitle.demo',
    descriptionKey: 'pageDescription.demo',
  },
  '/settings': {
    titleKey: 'pageTitle.settings',
    descriptionKey: 'pageDescription.settings',
  },
  '/language': {
    titleKey: 'pageTitle.language',
    descriptionKey: 'pageDescription.language',
  },
  '/about': {
    titleKey: 'pageTitle.about',
    descriptionKey: 'pageDescription.about',
  },
} as const;

export type SearchPage = keyof typeof searchPages;

/**
 * What the head of a page says, which its `getStaticProps` gives
 * (search-head-props.ts): in the language of its address, or in English for an
 * address without a language.
 */
export interface SearchHeadProps {
  page: SearchPage;
  /** The language that the page's address names, or null for an address without one, such as `/about`. */
  language: LanguageCode | null;
  /** The page's title. */
  title: string;
  /** What the page is, which a search result shows under its title. */
  description: string;
}

/** The address of a page in a language, or without one: `https://photo-data-viewer.vercel.app/ja/about`, `…/about`. */
export function addressOf(
  page: SearchPage,
  language: LanguageCode | null,
): string {
  const path = language ? `/${language}${page === '/' ? '' : page}` : page;
  return `${SITE_URL}${path}`;
}

/**
 * The tags of a page's head that search engines and link previews read: its
 * description, its canonical address, its address in each language
 * (`hreflang`, and `x-default` for the one without a language, which follows
 * the browser), and Open Graph's and X's tags for a link to it.
 *
 * With `withTitle`, the title as well: _app.tsx renders the head with it alone
 * until the page is shown, and so the page is served with it. A page whose
 * address names a language is served with its own title in that language, which
 * the page then shows. A page without one is served with the app's name, the
 * same in every language, so that nothing is shown in English before the texts
 * of the language it is shown in have arrived. Once the page is shown, the page
 * gives its own title.
 *
 * The props are the same on the server and in the browser, so the head does
 * not change when the page runs. The deployment for Photo Location Map has none
 * (search-head-props.ts): its window takes the title of its page, which is the
 * photo's once it is loaded (src/context/photo/PhotoProvider.tsx), and search
 * engines are asked not to index it (next.config.js). Neither has a page
 * without props, such as the one for an address that has no page.
 */
const SearchHead: React.FC<{
  head: SearchHeadProps | null | undefined;
  withTitle?: boolean;
}> = ({ head, withTitle = false }) => {
  if (!head || AppIntegration.isPlm) return null;
  const { page, language, title, description } = head;
  const url = addressOf(page, language);
  return (
    <Head>
      {withTitle && <title>{language ? title : appName.standalone}</title>}
      <meta name='description' content={description} />
      <link rel='canonical' href={url} />
      {languageCodes.map((code) => (
        <link
          key={`alternate-${code}`}
          rel='alternate'
          hrefLang={code}
          href={addressOf(page, code)}
        />
      ))}
      <link rel='alternate' hrefLang='x-default' href={addressOf(page, null)} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={appName.standalone} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta name='twitter:card' content='summary' />
    </Head>
  );
};

export default SearchHead;
