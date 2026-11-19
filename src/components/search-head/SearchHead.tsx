import Head from 'next/head';

import { AppIntegration } from '../../app-integration/app-integration';
import { appName } from '../../app-integration/app-name';
import { LanguageCode, languageCodes } from '../../i18n/languages';

/** The address of the standalone app, which search engines show. A page's canonical address is on it, wherever the page is served from. */
export const SITE_URL = 'https://photo-data-viewer.vercel.app';

/**
 * The image that a link to any page is previewed with, above or beside its
 * title and description: the icon's drawing and the app's name, in white on
 * the icon's blue (public/link-preview.png, drawn by
 * scripts/generate-icons.mjs). 1200 by 630 pixels is the size that sites and
 * chat apps show large. The name is all that it says, the same in every
 * language, and so is its alternative text. A link preview needs a whole
 * address, on the standalone app as the canonical addresses are.
 *
 * Sites and chat apps keep the image of an address for a while: a changed
 * image needs a new name to be shown at once.
 */
export const linkPreviewImage = {
  url: `${SITE_URL}/link-preview.png`,
  width: 1200,
  height: 630,
  alt: appName.standalone,
} as const;

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
  '/credits': {
    titleKey: 'pageTitle.credits',
    descriptionKey: 'pageDescription.credits',
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
 * the browser), and Open Graph's and X's tags for a link to it, with the image
 * of its preview (`linkPreviewImage`), which X shows large.
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
 * engines are asked not to index it (next.config.js). Its address is for Photo
 * Location Map to open, not for people to share, so it has no image of a link
 * preview either: without a title and a description, an image alone would be
 * no preview. A page without props, such as the one for an address that has no
 * page, has none of the head.
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
      <meta property='og:image' content={linkPreviewImage.url} />
      <meta property='og:image:width' content={`${linkPreviewImage.width}`} />
      <meta property='og:image:height' content={`${linkPreviewImage.height}`} />
      <meta property='og:image:alt' content={linkPreviewImage.alt} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={linkPreviewImage.url} />
      <meta name='twitter:image:alt' content={linkPreviewImage.alt} />
    </Head>
  );
};

export default SearchHead;
