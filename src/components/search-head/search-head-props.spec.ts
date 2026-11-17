/**
 * @jest-environment node
 */
import type { GetStaticPropsContext } from 'next';

import { DEFAULT_LOCALE } from '../../i18n/address';
import { languageCodes } from '../../i18n/languages';
import en from '../../locales/en.json';
import ja from '../../locales/ja.json';
import { SearchHeadProps, SearchPage, searchPages } from './SearchHead';
import { searchHeadStaticProps } from './search-head-props';

// Next.js calls a page's getStaticProps on Node.js when the app is built, once
// for each locale (next.config.js), with the build's environment:
// `PDV_IN_PLM=True` for the deployment for Photo Location Map.
const original = process.env.PDV_IN_PLM;
afterEach(() => {
  if (original === undefined) delete process.env.PDV_IN_PLM;
  else process.env.PDV_IN_PLM = original;
});

async function headOf(
  page: SearchPage,
  locale: string | undefined,
): Promise<SearchHeadProps | null> {
  const result = await searchHeadStaticProps(page)({
    locale,
  } as GetStaticPropsContext);
  if (!('props' in result)) throw new Error('no props');
  return result.props.searchHead;
}

it("gives a page at a language's address its title and its description in that language", async () => {
  expect(await headOf('/about', 'ja')).toEqual({
    page: '/about',
    language: 'ja',
    title: 'このアプリについて - Photo Data Viewer',
    description: ja.pageDescription.about.replace(
      '{{appName}}',
      'Photo Data Viewer',
    ),
  });
});

it("gives the Home page the app's name as its title in every language", async () => {
  expect(await headOf('/', 'de')).toMatchObject({
    page: '/',
    language: 'de',
    title: 'Photo Data Viewer',
  });
});

it('gives a page at the address without a language its English title and description', async () => {
  expect(await headOf('/about', DEFAULT_LOCALE)).toEqual({
    page: '/about',
    language: null,
    title: 'About - Photo Data Viewer',
    description: en.pageDescription.about.replace(
      '{{appName}}',
      'Photo Data Viewer',
    ),
  });
  expect(await headOf('/', DEFAULT_LOCALE)).toMatchObject({
    description: en.pageDescription.home,
  });
});

it('gives every page a title and a description in every language, with the name of the app filled in', async () => {
  for (const page of Object.keys(searchPages) as SearchPage[]) {
    for (const code of languageCodes) {
      const head = await headOf(page, code);
      expect(head?.language).toBe(code);
      expect(head?.title).toMatch(/Photo Data Viewer/);
      expect(head?.description.trim()).not.toBe('');
      expect(head?.description).not.toMatch(/\{\{/);
    }
  }
});

it('gives the deployment for Photo Location Map nothing, as its window takes the title of its page', async () => {
  process.env.PDV_IN_PLM = 'True';
  expect(await headOf('/', undefined)).toBeNull();
});
