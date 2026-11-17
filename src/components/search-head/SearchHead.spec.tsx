import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AppIntegration } from '../../app-integration/app-integration';
import SearchHead, { searchPages, SITE_URL } from './SearchHead';

// next/head puts its children into the page's head through Next.js' head
// manager, which a test has not. Rendered as they are, React puts them there
// as well.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

afterEach(() => jest.restoreAllMocks());

function content(selector: string): string | null | undefined {
  return document.head.querySelector(selector)?.getAttribute('content');
}

it.each(Object.keys(searchPages))(
  'gives %s the title it is served with, its description and its canonical address',
  (page) => {
    render(<SearchHead page={page} withTitle />);
    const url = `${SITE_URL}${page}`;
    // The app's name, the same in every language.
    expect(document.title).toBe('Photo Data Viewer');
    expect(content('meta[name="description"]')).toBe(
      searchPages[page].description,
    );
    expect(
      document.head
        .querySelector('link[rel="canonical"]')
        ?.getAttribute('href'),
    ).toBe(url);
    expect(content('meta[property="og:title"]')).toBe(searchPages[page].title);
    expect(content('meta[property="og:description"]')).toBe(
      searchPages[page].description,
    );
    expect(content('meta[property="og:url"]')).toBe(url);
    expect(content('meta[property="og:site_name"]')).toBe('Photo Data Viewer');
  },
);

it('gives the canonical address of the Home page with its slash', () => {
  render(<SearchHead page='/' />);
  expect(
    document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  ).toBe('https://photo-data-viewer.vercel.app/');
});

it('leaves the title to the page once the page is shown, and keeps the rest', () => {
  render(<SearchHead page='/about' />);
  expect(document.head.querySelector('title')).toBeNull();
  expect(content('meta[name="description"]')).toBe(
    searchPages['/about'].description,
  );
});

it('has nothing for an address that is not a page of the app', () => {
  render(<SearchHead page='/404' withTitle />);
  expect(document.head.querySelector('title, meta, link')).toBeNull();
});

it("has nothing in Photo Location Map's window, whose title is the photo's", () => {
  jest.spyOn(AppIntegration, 'isStandalone', 'get').mockReturnValue(false);
  render(<SearchHead page='/' withTitle />);
  expect(document.head.querySelector('title, meta, link')).toBeNull();
});

describe('the files for search engines', () => {
  const publicFile = (name: string) =>
    readFileSync(join(__dirname, '../../../public', name), 'utf8');

  it('robots.txt lets them read every page, and names the sitemap', () => {
    const robots = publicFile('robots.txt');
    expect(robots).toMatch(/^User-agent: \*\nAllow: \/$/m);
    expect(robots).not.toMatch(/^Disallow:/m);
    expect(robots).toMatch(
      new RegExp(`^Sitemap: ${SITE_URL}/sitemap.xml$`, 'm'),
    );
  });

  it('the sitemap lists the canonical addresses of the Home page and the About page', () => {
    const addresses = [
      ...publicFile('sitemap.xml').matchAll(/<loc>(.*)<\/loc>/g),
    ].map(([, address]) => address);
    expect(addresses).toEqual([`${SITE_URL}/`, `${SITE_URL}/about`]);
    // Each is the address that SearchHead gives a page as its canonical one.
    const canonical = Object.keys(searchPages).map(
      (page) => `${SITE_URL}${page}`,
    );
    for (const address of addresses) expect(canonical).toContain(address);
  });
});

describe('the deployment for Photo Location Map', () => {
  const original = process.env.PDV_IN_PLM;
  afterEach(() => {
    if (original === undefined) delete process.env.PDV_IN_PLM;
    else process.env.PDV_IN_PLM = original;
  });

  /** The headers that next.config.js gives the responses of a build. */
  async function headersOfBuild(pdvInPlm: string | undefined) {
    if (pdvInPlm === undefined) delete process.env.PDV_IN_PLM;
    else process.env.PDV_IN_PLM = pdvInPlm;
    let config: { headers: () => Promise<unknown> } | undefined;
    jest.isolateModules(() => {
      config = require('../../../next.config.js');
    });
    return config!.headers();
  }

  it('asks search engines not to index any of it', async () => {
    expect(await headersOfBuild('True')).toEqual([
      {
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ]);
  });

  it('is the only one that does', async () => {
    expect(await headersOfBuild(undefined)).toEqual([]);
  });
});
