import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AppIntegration } from '../../app-integration/app-integration';
import { languageCodes } from '../../i18n/languages';
import SearchHead, {
  addressOf,
  linkPreviewImage,
  SearchHeadProps,
  searchPages,
  SITE_URL,
} from './SearchHead';

// next/head puts its children into the page's head through Next.js' head
// manager, which a test has not. Rendered as they are, React puts them there
// as well.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

afterEach(() => jest.restoreAllMocks());

/** The head of the About page in Japanese, as its getStaticProps gives it. */
const aboutInJapanese: SearchHeadProps = {
  page: '/about',
  language: 'ja',
  title: 'このアプリについて - Photo Data Viewer',
  description:
    'Photo Data Viewer は写真をサーバーに送信せず、ブラウザ内部で読み取ります。',
};

/** The About page at its address without a language, which is in English. */
const about: SearchHeadProps = {
  page: '/about',
  language: null,
  title: 'About - Photo Data Viewer',
  description: 'How Photo Data Viewer reads your photo in your browser.',
};

function content(selector: string): string | null | undefined {
  return document.head.querySelector(selector)?.getAttribute('content');
}

function href(selector: string): string | null | undefined {
  return document.head.querySelector(selector)?.getAttribute('href');
}

it('serves a page whose address names a language with its title and description in that language, and that address', () => {
  render(<SearchHead head={aboutInJapanese} withTitle />);
  expect(document.title).toBe('このアプリについて - Photo Data Viewer');
  expect(content('meta[name="description"]')).toBe(aboutInJapanese.description);
  expect(href('link[rel="canonical"]')).toBe(`${SITE_URL}/ja/about`);
  expect(content('meta[property="og:title"]')).toBe(aboutInJapanese.title);
  expect(content('meta[property="og:description"]')).toBe(
    aboutInJapanese.description,
  );
  expect(content('meta[property="og:url"]')).toBe(`${SITE_URL}/ja/about`);
  expect(content('meta[property="og:site_name"]')).toBe('Photo Data Viewer');
});

it("serves a page without a language with the app's name as its title, the same in every language", () => {
  render(<SearchHead head={about} withTitle />);
  expect(document.title).toBe('Photo Data Viewer');
  expect(content('meta[name="description"]')).toBe(about.description);
  expect(href('link[rel="canonical"]')).toBe(`${SITE_URL}/about`);
  // A link to it is previewed with the page's own title.
  expect(content('meta[property="og:title"]')).toBe(
    'About - Photo Data Viewer',
  );
});

it("previews a link to any page, in any language, with the same image of the app's drawing and name, which X shows large", () => {
  const home: SearchHeadProps = { ...about, page: '/' };
  for (const head of [about, aboutInJapanese, home]) {
    const { unmount } = render(<SearchHead head={head} />);
    const image = 'https://photo-data-viewer.vercel.app/link-preview.png';
    expect(content('meta[property="og:image"]')).toBe(image);
    expect(content('meta[property="og:image:width"]')).toBe('1200');
    expect(content('meta[property="og:image:height"]')).toBe('630');
    // The name is all that the image says, the same in every language.
    expect(content('meta[property="og:image:alt"]')).toBe('Photo Data Viewer');
    expect(content('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(content('meta[name="twitter:image"]')).toBe(image);
    expect(content('meta[name="twitter:image:alt"]')).toBe('Photo Data Viewer');
    unmount();
  }
});

it('lists the address of the page in every language, and the one without a language as x-default', () => {
  for (const head of [about, aboutInJapanese]) {
    const { unmount } = render(<SearchHead head={head} />);
    const alternates = [
      ...document.head.querySelectorAll('link[rel="alternate"]'),
    ].map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]);
    expect(alternates).toEqual([
      ...languageCodes.map((code) => [code, `${SITE_URL}/${code}/about`]),
      ['x-default', `${SITE_URL}/about`],
    ]);
    unmount();
  }
});

it('gives the Home page its addresses: the root, and each language without a slash after it', () => {
  expect(addressOf('/', null)).toBe('https://photo-data-viewer.vercel.app/');
  expect(addressOf('/', 'ja')).toBe('https://photo-data-viewer.vercel.app/ja');
  expect(addressOf('/', 'pt-BR')).toBe(
    'https://photo-data-viewer.vercel.app/pt-BR',
  );
  expect(addressOf('/language', 'zh-Hant')).toBe(
    'https://photo-data-viewer.vercel.app/zh-Hant/language',
  );
});

it('leaves the title to the page once the page is shown, and keeps the rest', () => {
  render(<SearchHead head={aboutInJapanese} />);
  expect(document.head.querySelector('title')).toBeNull();
  expect(content('meta[name="description"]')).toBe(aboutInJapanese.description);
});

it('has nothing for a page without props, such as the one for an address that has no page', () => {
  render(<SearchHead head={undefined} withTitle />);
  expect(document.head.querySelector('title, meta, link')).toBeNull();
});

it("has nothing in Photo Location Map's window, whose title is the photo's", () => {
  jest.spyOn(AppIntegration, 'isPlm', 'get').mockReturnValue(true);
  render(<SearchHead head={about} withTitle />);
  expect(document.head.querySelector('title, meta, link')).toBeNull();
});

describe('the files for search engines and link previews', () => {
  // Git on Windows may check the files out with CRLF line endings.
  const publicFile = (name: string) =>
    readFileSync(join(__dirname, '../../../public', name), 'utf8').replace(
      /\r\n/g,
      '\n',
    );

  it('robots.txt lets them read every page, and names the sitemap', () => {
    const robots = publicFile('robots.txt');
    expect(robots).toMatch(/^User-agent: \*\nAllow: \/$/m);
    expect(robots).not.toMatch(/^Disallow:/m);
    expect(robots).toMatch(
      new RegExp(`^Sitemap: ${SITE_URL}/sitemap.xml$`, 'm'),
    );
  });

  it('the sitemap lists the Home page and the About page, without a language and in each language', () => {
    // A language that is added gets its two addresses in public/sitemap.xml,
    // in the order of src/i18n/languages.ts, which this names when they are not there.
    const addresses = [
      ...publicFile('sitemap.xml').matchAll(/<loc>(.*)<\/loc>/g),
    ].map(([, address]) => address);
    const expected = (['/', '/about'] as const).flatMap((page) => [
      addressOf(page, null),
      ...languageCodes.map((code) => addressOf(page, code)),
    ]);
    expect(addresses).toEqual(expected);
    expect(Object.keys(searchPages)).toEqual(
      expect.arrayContaining(['/', '/about']),
    );
  });

  it('the image of a link preview is at the path of its address, a PNG of the size that the head gives', () => {
    // Drawn by scripts/generate-icons.mjs.
    const { pathname } = new URL(linkPreviewImage.url);
    const png = readFileSync(join(__dirname, '../../../public', pathname));
    // A PNG starts with its signature, then its first chunk, IHDR, which
    // begins with the width and the height.
    expect([...png.subarray(0, 8)]).toEqual([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    expect(png.toString('latin1', 12, 16)).toBe('IHDR');
    expect(png.readUInt32BE(16)).toBe(linkPreviewImage.width);
    expect(png.readUInt32BE(20)).toBe(linkPreviewImage.height);
  });
});

describe('next.config.js', () => {
  const original = process.env.PDV_IN_PLM;
  afterEach(() => {
    if (original === undefined) delete process.env.PDV_IN_PLM;
    else process.env.PDV_IN_PLM = original;
  });

  /** The configuration of a build, standalone or for Photo Location Map. */
  function configOfBuild(pdvInPlm: string | undefined) {
    if (pdvInPlm === undefined) delete process.env.PDV_IN_PLM;
    else process.env.PDV_IN_PLM = pdvInPlm;
    let config: Record<string, unknown> & {
      i18n?: {
        locales: string[];
        defaultLocale: string;
        localeDetection: boolean;
      };
      headers: () => Promise<unknown>;
    };
    jest.isolateModules(() => {
      config = require('../../../next.config.js');
    });
    return config!;
  }

  it('gives the standalone app an address for each language, and one without a language, redirecting nothing by the browser', () => {
    const { i18n } = configOfBuild(undefined);
    expect(i18n?.defaultLocale).toBe('default');
    expect(i18n?.localeDetection).toBe(false);
    expect([...(i18n?.locales ?? [])].sort()).toEqual(
      ['default', ...languageCodes].sort(),
    );
  });

  it('leaves the deployment for Photo Location Map without addresses for the languages, and asks search engines not to index it', async () => {
    const config = configOfBuild('True');
    expect(config.i18n).toBeUndefined();
    expect(await config.headers()).toEqual([
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ]);
  });

  it('asks nothing of search engines for the standalone app', async () => {
    expect(await configOfBuild(undefined).headers()).toEqual([]);
  });
});
