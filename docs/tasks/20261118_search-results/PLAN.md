# Search results: plan

[`STATUS.md`](./STATUS.md) says how far the work has got.

## What was asked

1. Show a description of Photo Data Viewer in Google's search results.
2. Work out how search engines should see the app now that it is in 42
   languages. The first brief stopped at a recommendation; the maintainer then
   chose to show every language in search results from the start
   ([evidence/LANGUAGES.md](./evidence/LANGUAGES.md#decision)), and asked for the
   change to be merged.

Two things stay as they are: nothing is shown in English before the texts of
the chosen language arrive (`_app.tsx`, `src/i18n/i18n.ts`), and the
deployment for Photo Location Map changes in nothing that is not meant.

## What search engines got

Found on 2026-11-18 ([evidence/RESULTS.md](./evidence/RESULTS.md)):

- **The served HTML had no title and no description**, and an empty body. The
  app renders nothing until it runs in the browser and the texts of the
  language have arrived (`_app.tsx`), so the head that each page sets with
  `next/head` (its title, and the description "View your photo data.") existed
  only after the page ran.
- **Google runs the pages, and indexes `/` and `/about`, in English.** The
  snippet of `/` is the description, "View your photo data.", followed by the
  page's text: "Select your photo to display EXIF data. Latitude Longitude Home
  Demo Settings Language".
- **Every language shared one address**, chosen in the browser, so each page
  could be indexed in one language only.
- **There were no `robots.txt` and no sitemap** (404), and the deployment for
  Photo Location Map, which serves the same pages, asked search engines nothing.
  Google has not indexed it.
- **Link previews**, which run no script, found no title and no description.

## The change

### The head that search engines read

- **`SearchHead`** (`src/components/search-head/SearchHead.tsx`) gives each page
  the head that search engines and link previews read: its title, its
  description, its canonical address, its address in every language
  (`hreflang`, with `x-default` for the address without a language), and Open
  Graph's and X's tags. `_app.tsx` renders it with the title until the page is
  shown, so the page is served with it; once the page is shown, the page gives
  its own title, in its language.
- **Its texts come from the page's `getStaticProps`** (`search-head-props.ts`),
  in the language of the page's address: the page titles (`pageTitle`) and new
  descriptions (`pageDescription`) in every translation file. The props are the
  same on the server and in the browser, so the head does not change when the
  page runs, and the browser fetches no translation for it.
- **The address without a language is served in English, with the app's name
  as its title**, which is the same in every language: the tab shows it before
  the texts of the language arrive, and so nothing in English is shown first.
  An address of a language is served with its own title in that language, which
  is what the page then shows.

### An address for each language

- **Next.js' internationalized routing** (`i18n` in `next.config.js`) gives every
  page an address in each language (`/ja`, `/ja/about`), prerendered as a static
  file (5 pages × 43 locales, with the 404 and 500 pages). The address without a
  language gets the locale `default`, which names no language, as Next.js'
  guide sets up a default locale with a prefix of its own;
  `localeDetection: false`, as Google advises against redirecting by language.
- **The address's language wins** in the browser (`src/i18n/address.ts`,
  `resolve-language.ts`): `/ja/about` is in Japanese whatever the setting and the
  browser. The address without a language follows the setting and the browser,
  as before. The menu and the links keep the language of the address, as
  Next.js keeps the locale.
- **The Language page** at an address of a language has that language chosen,
  and a choice there is saved and opens the address of the language chosen, or
  the one without a language for the browser's language. The browser's Back
  and Forward between those addresses show their language.
- **`lang`** of the served page is the address's language (`dir` too), or
  English without one. Next.js' router sets `lang` to the locale after each
  change of page, which is `default` for an address without a language; the app
  sets it back to the language shown (`useLanguageAttribute.ts`).
- **The analytics** tell a page by its path without the language: GA4's page
  title, and the visits of the Language page, of which `/ja/language` and
  `/de/language` are one page. GA4's page path keeps the language.

### The rest

- **The deployment for Photo Location Map** has none of it: no addresses for the
  languages, and no head for search engines (`getStaticProps` gives none), as
  its window takes the title of its page, which must be the photo's. It is sent
  with `X-Robots-Tag: noindex` (`next.config.js`). It is opened at its root with
  the language in a parameter, as before.
- **`public/robots.txt`** lets search engines read every page and names the
  sitemap; **`public/sitemap.xml`** lists the Home page and the About page at all
  86 addresses. A language that is added gets its two addresses there, which a
  unit test names.
- **No image for link previews yet** (see STATUS.md).

## Steps

- [x] Find what search engines get: the served HTML, how Google renders it,
      what Google shows.
- [x] Each page's head in the served HTML, without a change to Photo Location
      Map's window.
- [x] `robots.txt`, the sitemap, and `noindex` for the deployment for Photo
      Location Map.
- [x] The languages: options and recommendation; then, as the maintainer
      decided, an address for each language, its head translated, `hreflang`.
- [x] The descriptions in the 42 languages.
- [x] Tests: unit tests of the head, its props in every language, the
      addresses, the Language page, the analytics and `lang`; browser tests of
      the served heads, a page at a language's address, the Language page there
      with Back, and the sitemap.
- [ ] After the deployment, by the maintainer: Google Search Console (see
      STATUS.md).
