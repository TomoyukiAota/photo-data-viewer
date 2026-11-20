# Search results: status

## Where it stands

Done, and merged on 2026-11-18 as `b1cb101` (#81), as the maintainer asked.
The maintainer's wording of the Home page's description, which names the
latitude and the longitude, was merged on the same day as `1acacf4` (#84).
Every page is served with a title, a description, a canonical address, its
address in every language and the tags of a link preview, in the language of
its address; every page has an address in each of the 42 languages;
`robots.txt` and a sitemap are served; the deployment for Photo Location Map
asks search engines not to index it.

On 2026-11-20 a link to any page got an image for its preview, the icon's
drawing and the app's name on the icon's blue, which the maintainer chose
from three ([PLAN.md](./PLAN.md#the-image-of-a-link-preview)). It was merged
on the same day as `cf4b714` (#102).

What was found and checked is in [evidence/RESULTS.md](./evidence/RESULTS.md);
the plan and the reasons are in [PLAN.md](./PLAN.md); the ways to show the
languages in search results, and the decision, in
[evidence/LANGUAGES.md](./evidence/LANGUAGES.md).

## What changed

| File | Change |
| --- | --- |
| `next.config.js` | `i18n`: an address for each language, for the standalone app only. `X-Robots-Tag: noindex` for the build for Photo Location Map. |
| `src/i18n/address.ts` | New: the language that an address names, and its page without it. |
| `src/i18n/resolve-language.ts` | The address's language comes first, before the setting and the browser. |
| `src/components/search-head/SearchHead.tsx`, `search-head-props.ts` | New: the head for search engines, and each page's `getStaticProps` that gives its texts in the address's language. |
| `src/pages/_app.tsx` | Renders `SearchHead`: with the title until the page is shown, so that the page is served with it, and without it once the page gives its own. |
| `src/pages/*.tsx` | `getStaticProps`; the pages no longer set a description of their own ("View your photo data."). |
| `src/pages/_document.tsx` | `lang` and `dir` of the address's language; GA4's page title by the page without the language. |
| `src/components/language/Language.tsx` | At an address of a language: that language is chosen, a choice opens the address of the language chosen, and Back and Forward are followed. |
| `src/hooks/useLanguageAttribute.ts`, `useAppRoot.ts` | Sets `lang` back to the language shown after Next.js sets it to the locale. |
| `src/hooks/useLanguagePageTracker.ts`, `src/analytics/ga4-page.ts` | A page is told by its path without the language. |
| `src/locales/*.json` | `pageDescription`: the descriptions of the five pages, in every language. |
| `public/robots.txt`, `public/sitemap.xml` | New. |
| Tests | Unit tests of all of the above; browser tests in `regression.spec.mjs` ("what search engines read", and in Japanese, the page before its texts arrive). |
| `docs/TRANSLATING.md`, `docs/DEVELOPMENT.md`, `docs/CONTRIBUTING.md`, `README.md` | The addresses of the languages, the descriptions and the sitemap; the deployment for Photo Location Map is not indexed. |
| `public/link-preview.png`, `scripts/generate-icons.mjs`, `SearchHead.tsx` (2026-11-20) | The image of a link preview, which the icon's script draws, and its tags: `og:image` with its width, height and alternative text, and X's `summary_large_image` with `twitter:image`. Tested in `SearchHead.spec.tsx` and the browser suite. |

## For the maintainer to review

1. **The wording of the descriptions**, `pageDescription` in `src/locales/en.json`.
   The maintainer reworded the Home page's, which Google shows under the app's
   name, to name the latitude and the longitude:

   > View the EXIF data of your photo in your browser: the date taken, the
   > location (latitude and longitude) on a map, the camera settings, etc. The
   > photo is not sent to any server.

   It has 176 characters, so a search result on a computer may cut its last
   sentence. The other languages follow it, with their own files' words for the
   latitude and the longitude (`photoData.general`). The Japanese ones, which
   the maintainer reviews, are in `src/locales/ja.json`; TRANSLATING.md lists
   `pageDescription` as not reviewed in Japanese yet. The others are machine
   translation, as most texts are.
2. **The address without a language is served with the app's name as its
   title on every page.** An English title per page would show in English in the
   tab, for a moment, before the texts of another language arrive. Google reads
   each page's own title anyway, as it runs the page.
3. **The sitemap lists the Home page and the About page** at every address. The
   other pages have addresses and heads in every language, but are not listed.
4. **The image of a link preview**, which the maintainer chose on 2026-11-20
   from three: the icon as it is, a small square beside the text; a wide image
   on white; and this one, a wide image on the icon's blue, which looks the same
   on a light page and on a dark one
   ([PLAN.md](./PLAN.md#the-image-of-a-link-preview)).

## After the deployment

These need the maintainer's Google account:

- Add `https://photo-data-viewer.vercel.app` to Google Search Console. For a
  `vercel.app` address, Google verifies ownership by an HTML file or a meta tag
  that it gives, which can be added to `public/` or to `SearchHead`. Submit the
  sitemap, and ask Google to read `/` again with the URL Inspection tool; until
  it does, its result keeps the old snippet. Bing Webmaster Tools can import the
  site from Search Console.
- After a few weeks, Search Console's report of the pages says how many of the
  addresses of the languages Google has indexed.

Once the image of a link preview is deployed, share a link to a page in a
chat app or on a social network, and see the image in its preview. A site that
previewed the address before may keep its old preview for a while.

## Not verified

- What Google and other search engines do with the new pages: that needs the
  deployment, and Google to read them.
- How chat apps and social networks draw a link to the app, and its image: the
  tags and the image were checked as they are served, not in those apps, and no
  address was given to a service that previews links.
- Photo Location Map's window itself (the Electron suite opens windows on the
  machine): its deployment was checked with `curl` and a headless browser.

## Follow-ups

None: the one there was, an image for link previews, was added on 2026-11-20.

## To resume

To change what search engines read, edit `searchPages` in `SearchHead.tsx`, the
texts `pageTitle` and `pageDescription` in the translation files, and, for a
page to be listed, `public/sitemap.xml`; the unit tests of `SearchHead` check the
sitemap against the languages, and the browser suite checks what the pages are
served with.

To change the image of a link preview, change its drawing in
`scripts/generate-icons.mjs` and run it, and give the file a new name, in the
script and in `linkPreviewImage` in `SearchHead.tsx`, as sites keep the image
of an address for a while.
