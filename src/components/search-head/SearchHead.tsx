import Head from 'next/head';

import { AppIntegration } from '../../app-integration/app-integration';
import { appName } from '../../app-integration/app-name';
import { pageTitleDefaultValue } from '../../context/page-title/page-title-default-value';

/** The address of the standalone app, which search engines show. A page's canonical address is on it, wherever the page is served from. */
export const SITE_URL = 'https://photo-data-viewer.vercel.app';

/** What search engines and link previews read of a page, besides its address. */
export interface SearchPage {
  /** The page's title in English, which Open Graph gives. */
  title: string;
  /** What the page is, which a search result shows under its title. */
  description: string;
}

/**
 * What search engines and link previews read of each page, by its path, in
 * English. TL;DR: a page has one address for every language, and search engines
 * read it in English.
 * Details: the language is chosen in the browser, from the browser's languages
 * or the Language page, and the page is served before any is applied. Google,
 * which runs the page's scripts, has the pages in English too. The ways to show
 * the other languages in search results, and the one recommended, are in
 * docs/tasks/20261118_search-results/evidence/LANGUAGES.md.
 */
export const searchPages: Readonly<Record<string, SearchPage>> = {
  '/': {
    title: pageTitleDefaultValue.index,
    description:
      'View the EXIF data of your photo in your browser: the date taken, the location on a map, the camera and its settings. The photo is not sent to any server.',
  },
  '/demo': {
    title: pageTitleDefaultValue.demo,
    description:
      'Try Photo Data Viewer with a sample photo, and see the EXIF data it shows: the date taken, the location on a map, the camera and its settings.',
  },
  '/settings': {
    title: pageTitleDefaultValue.settings,
    description:
      'Choose how Photo Data Viewer writes dates and times, and whether it sends usage data. The settings are saved in your browser.',
  },
  '/language': {
    title: pageTitleDefaultValue.language,
    description:
      'Choose the language that Photo Data Viewer is shown in, or let it follow the language of your browser.',
  },
  '/about': {
    title: pageTitleDefaultValue.about,
    description:
      'How Photo Data Viewer reads your photo in your browser without sending it to any server, the usage data it collects, its source code and who develops it.',
  },
};

/**
 * Whether the page is the standalone app, the one search engines show. On the
 * server, where Next.js prerenders the page when the app is built: unless the
 * build is the deployment for Photo Location Map (`PDV_IN_PLM`, next.config.js).
 * In the browser: unless the page is in Photo Location Map's window.
 */
function isStandaloneApp(): boolean {
  return AppIntegration.isDuringSsrOrSsg
    ? process.env.PDV_IN_PLM !== 'True'
    : AppIntegration.isStandalone;
}

/**
 * The tags of a page's head that search engines and link previews read: its
 * description, its canonical address, and Open Graph's and X's tags for a link
 * to it. With `withTitle`, the title as well, the app's name: _app.tsx renders
 * the head with it alone until the page is shown, and so the page is served
 * with it. It is the same in every language, so that nothing is shown in English
 * before the texts of the language have arrived; once the page is shown, the
 * page gives its own title, in its language.
 *
 * The deployment for Photo Location Map has none of them: its window takes the
 * title of its page, which is the photo's once it is loaded
 * (src/context/photo/PhotoProvider.tsx), and search engines are asked not to
 * index that deployment (next.config.js). A page that is not listed in
 * `searchPages`, such as the one for an address that has no page, has none
 * either.
 */
const SearchHead: React.FC<{ page: string; withTitle?: boolean }> = ({
  page,
  withTitle = false,
}) => {
  const searchPage = searchPages[page];
  if (!searchPage || !isStandaloneApp()) return null;
  const url = `${SITE_URL}${page}`;
  return (
    <Head>
      {withTitle && <title>{appName.standalone}</title>}
      <meta name='description' content={searchPage.description} />
      <link rel='canonical' href={url} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={appName.standalone} />
      <meta property='og:title' content={searchPage.title} />
      <meta property='og:description' content={searchPage.description} />
      <meta property='og:url' content={url} />
      <meta name='twitter:card' content='summary' />
    </Head>
  );
};

export default SearchHead;
