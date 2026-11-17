# Languages in search results: options and recommendation

The app is shown in 42 languages, and each page has one address for all of
them. This record says how search engines see that, the ways to show the other
languages in search results, what each costs and risks, and the one
recommended. It stops at the recommendation: how the language is chosen and how
the pages are rendered are not changed by this task. That is the maintainer's
decision.

Found on 2026-11-18, at `main` `76bd3b1`, with the change of this task
([RESULTS.md](./RESULTS.md)).

## How the app gives its languages

- **One address per page, for every language.** `/`, `/about`, `/demo`,
  `/settings`, `/language`. The HTML that the server sends is the same for every
  visitor: since this task, the head with an English description and the app's
  name as the title (`SearchHead.tsx`); `<html lang="en">`; an empty body.
- **The language is chosen in the browser**, after the page arrives
  (`src/i18n/resolve-language.ts`): the Language page's setting, saved in the
  browser, or else the first of the browser's languages (`navigator.languages`)
  that has a translation, or else English. Nothing is rendered until the texts
  of that language have arrived (`_app.tsx`).
- **The `language` parameter of the address is read in Photo Location Map's
  window only.** In a browser, `/?language=ja` is the same page as `/`.
- **40 of the 42 languages are machine translation** that no speaker has
  reviewed; English is the source, and Japanese has been reviewed
  ([TRANSLATING.md](../../../TRANSLATING.md#languages)).

## How search engines see it

| Reader | What it reads | Language it gets |
| --- | --- | --- |
| Google | Crawls each address, then runs every page that answers 200 and indexes what the page leaves ([JavaScript SEO basics][js]). | English. Googlebot crawls mostly from the USA and sends no `Accept-Language` ([locale-adaptive pages][locale]), and the pages it has indexed are in English: the snippet of `/` is the English Home page ([RESULTS.md](./RESULTS.md#what-google-shows)). |
| Bing | Generally runs scripts, but less predictably than Google: for sites that rely on scripts, Bing has recommended serving its crawler the page as HTML ([Bing, 2018][bing-js]). | English: the served head, and the English page if it runs it. |
| Link previews (chat apps, social networks) | The served HTML only; they run no script. | English: the served head (Open Graph). |

Google determines the language of a page from its visible content, not from the
`lang` attribute, the address or `hreflang` ([multilingual sites][multi],
[localized versions][hreflang]). It recommends a different address for each
language version rather than choosing the language from cookies or the
browser's settings: otherwise it "might not find and crawl all your
variations" ([multilingual sites][multi]).

So each page is indexed once, in English. The consequences:

- **A search in English can find the app; a search in another language finds
  it only as an English page**, if at all. Google may show an English result
  with its title and snippet machine translated, in some languages
  ([translated results][translated]).
- **Whoever comes from a search sees the app in their own language** all the
  same, as the browser's language is the default. What the other languages lack
  is being found, not the page they arrive at.

## The options

### 1. English only in search results (what this task does)

Each page is served with an English description and the app's name as its
title; Google indexes the English page; the app follows the visitor's language
once opened.

- **Cost:** none beyond this task.
- **Risks:** none new. Searches in other languages are less likely to find the
  app, as today.
- **Fits** a tool with little text of its own, whose visitors land in their own
  language anyway.

### 2. Translated head chosen by the request's `Accept-Language`

The server would send the head in the language that the request asks for, at
one address.

- **Does not help search:** Googlebot sends no `Accept-Language`, so it gets
  English; Google calls this "locale-adaptive" and warns that it might not
  index the other languages ([locale-adaptive pages][locale]).
- **Cost:** every page would be rendered on each request (a Vercel Function)
  instead of being a static file, with `Vary: Accept-Language` for caches.
- **Not recommended.**

### 3. An address per language through the `language` parameter (`/?language=ja`), with `hreflang`

The parameter that Photo Location Map already passes would choose the language
in a browser too, and each page would list its other languages with
`<link rel="alternate" hreflang="…">`.

- **What it takes:**
  - Read the parameter in a browser as well, and decide which wins when it and
    the saved setting differ, and whether a visit saves it. Today the
    parameter is read in Photo Location Map's window alone.
  - A canonical address per language, each listing all 42 and `x-default`
    (`hreflang` is ignored unless the pages point to each other).
  - The description, and `og:title`, in every language: new keys in the 42
    translation files.
- **The obstacle: the pages are static files, one per path.** `/?language=ja`
  is served the same HTML as `/`, whose canonical address is `/`: it would say
  that the Japanese page is the same as `/`. Each language's address must be
  its own canonical one for `hreflang` to count, and Google asks that a script
  not change the canonical address to another than the served one
  ([JavaScript SEO basics][js]). The canonical address and `hreflang` would
  have to be left out of the served HTML and set by the script alone, which
  Google reads when it runs the page and other search engines and link
  previews do not; or the pages would be rendered on each request.
- **Google lists parameters as "Not recommended"** for language addresses
  ([multilingual sites][multi]), though a parameter address can be indexed.
- **Risks:** a link with `?language=de`, shared, opens German for whoever
  follows it. 40 of the languages are unreviewed machine translation, which
  would be indexed under the app's name.
- **Cost:** medium; the obstacle above makes it fragile. **Not recommended.**

### 4. An address per language as a path (`/ja/`, `/ja/about`), with `hreflang`

Next.js' internationalized routing for the Pages Router ([its guide][next-i18n],
also in `node_modules/next/dist/docs/02-pages/02-guides/internationalization.md`)
generates a static version of each page for each locale, and gives the locale
to the page when it is prerendered.

- **What it gives:** the served head in each language (title, description,
  canonical address, `hreflang`) as a static file, without rendering on
  request: 42 languages × 5 pages are 210 files. Subdirectories are one of the
  structures that Google's guide lists without reservation, where it marks
  parameters "Not recommended" ([multilingual sites][multi]).
- **What it takes:**
  - Decide what `/about`, without a language, is. Kept as today (the browser's
    language or the saved setting), it is the `x-default`; English then needs
    its own address (`/en/about`) for `hreflang`. Next.js redirects `/` by
    `Accept-Language` unless `localeDetection` is turned off; Google advises
    against redirecting by language ([multilingual sites][multi]).
  - The Language page and the menu would move between addresses, and the
    language of an address would win over the saved setting while it is open.
  - GA4 and the app's analytics record the page's path, which would carry the
    language; the page titles they record are keyed by path
    (`src/analytics/ga4-page.ts`).
  - Photo Location Map passes `language` in the address and opens `/`; its
    deployment would keep doing so, untouched.
  - The description in every language (new keys in the translation files).
  - The body would still be built in the browser, as today. Rendering it on
    the server in the address's language (translated text in the served HTML)
    is a further, larger change: components read the browser's storage and the
    window as they render, and `_app.tsx` renders nothing on the server so that
    Photo Location Map's window is told apart. Google does not need it, as it
    runs the page.
- **Cost:** large. **Risk:** medium (routing, redirects, analytics).

### 5. A domain or subdomain per language

The same as 4 with more to run (domains, their verification) and nothing more
for a small app. **Not recommended.**

### Machine translation in search results

Google's earlier advice to keep automatically translated pages out of search
results is no longer in its documentation; its spam policies name translation
only as a way to generate many pages from scraped content to manipulate
rankings ([spam policies][spam]). Translations of a tool's own texts are not
that. Still, an indexed page in a language is the app's first impression in
that language, and 40 of the 42 have not been read by a speaker.

## Recommendation

1. **Now: English in search results, with one address per page** (option 1,
   this task). The app opens in the visitor's language whatever the search
   was.
2. **Measure before going further.** Add the site to Google Search Console and
   Bing Webmaster Tools and submit the sitemap (this needs the maintainer's
   account; for a `vercel.app` address, Google verifies ownership by an HTML
   file or a meta tag that it gives). After a few months, its queries and
   countries, and the usage data that the app records (the browser's languages
   in `Page Loaded`, the language each visit is shown in as `Language in Use`,
   `src/analytics/track-event.ts`), say how many visitors search and read in
   other languages.
3. **If they are many, give addresses per language as paths** (option 4), not
   parameters, and **start with the languages that a speaker has reviewed**:
   Japanese, then each language as its review is recorded in
   [TRANSLATING.md](../../../TRANSLATING.md#languages). Keep the address without
   a language as it is today (`x-default`), so that existing links and Photo
   Location Map are unaffected.

[js]: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
[locale]: https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages
[multi]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
[hreflang]: https://developers.google.com/search/docs/specialty/international/localized-versions
[translated]: https://developers.google.com/search/docs/appearance/translated-results
[spam]: https://developers.google.com/search/docs/essentials/spam-policies
[bing-js]: https://blogs.bing.com/webmaster/october-2018/bingbot-Series-JavaScript,-Dynamic-Rendering,-and-Cloaking-Oh-My
[next-i18n]: https://nextjs.org/docs/pages/guides/internationalization
