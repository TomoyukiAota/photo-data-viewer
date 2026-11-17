# Search results: status

## Where it stands

Done, on its branch, not merged. Each page is served with a title, a
description, a canonical address and the tags of a link preview; `robots.txt`
and a sitemap are served; the deployment for Photo Location Map asks search
engines not to index it. The languages are worked out to a recommendation,
with nothing changed in how the language is chosen
([evidence/LANGUAGES.md](./evidence/LANGUAGES.md)).

What was found and checked is in [evidence/RESULTS.md](./evidence/RESULTS.md);
the plan and the reasons are in [PLAN.md](./PLAN.md).

## What changed

| File | Change |
| --- | --- |
| `src/components/search-head/SearchHead.tsx` | New: the head that search engines and link previews read, and the description of each page. |
| `src/pages/_app.tsx` | Renders `SearchHead`: with the title until the page is shown, so that the page is served with it, and without it once the page gives its own. |
| `src/pages/*.tsx` | The pages no longer set a description of their own ("View your photo data."). |
| `next.config.js` | `X-Robots-Tag: noindex` on every response of the build for Photo Location Map. |
| `public/robots.txt`, `public/sitemap.xml` | New. |
| `src/components/search-head/*.spec.tsx` | Unit tests: each page's tags, the title left to the page once shown, nothing for Photo Location Map (in its window, and when built for it), the files, the header. |
| `tests/e2e/browser/regression.spec.mjs` | "What search engines read" (each page as served with scripts off; the head after the page runs and moves to another page; robots.txt and the sitemap) and, in Japanese, the page before its texts arrive. |
| `docs/DEVELOPMENT.md`, `docs/CONTRIBUTING.md` | Where the head for search engines comes from; the deployment for Photo Location Map is not indexed. |

## For the maintainer to review or decide

1. **The wording of the descriptions**, in `searchPages` of `SearchHead.tsx`;
   the Home page's above all, which Google shows under the app's name:

   > View the EXIF data of your photo in your browser: the date taken, the
   > location on a map, the camera and its settings. The photo is not sent to
   > any server.

   The others are in [evidence/RESULTS.md](./evidence/RESULTS.md#the-served-html-1).
   Google chooses whether to show the description or text of the page; it
   shows the description when that says better what the page is.
2. **The title that a page is served with is the app's name on every page.**
   An English title per page ("About - Photo Data Viewer") would show in
   English in the tab, for a moment, before the texts of another language
   arrive. Google reads each page's own title anyway, as it runs the page.
3. **The sitemap lists the Home page and the About page.** Demo, Settings and
   Language can be found and read, and have their own descriptions, but are not
   listed; none of the pages is kept out of search results.
4. **The languages: English in search results for now**, then measure, then
   addresses per language as paths for the languages that a speaker has
   reviewed ([evidence/LANGUAGES.md](./evidence/LANGUAGES.md#recommendation)).
5. **After the deployment**, which needs the maintainer's Google account: add
   `https://photo-data-viewer.vercel.app` to Google Search Console (for a
   `vercel.app` address, verified by an HTML file or a meta tag that Google
   gives, which can be added to `public/` or to `SearchHead`), submit the
   sitemap, and ask Google to read `/` again with the URL Inspection tool.
   Until Google reads the page again, its result keeps the old snippet.
6. **An image for link previews.** There is none yet: the app has only
   `favicon.ico`. Once it has an icon of 512 pixels or more, or an image made
   for previews (1200 × 630 pixels), add `og:image` to `SearchHead`; with a
   wide image, `twitter:card` becomes `summary_large_image`.

## Not verified

- What Google and other search engines do with the new head after it is
  deployed: that needs the deployment, and Google to read the pages again.
- How chat apps and social networks draw a link to the app: the tags were
  checked in the HTML, not in those apps.
- Photo Location Map's window itself (the Electron suite opens windows on the
  machine): its deployment was checked with `curl` and a headless browser,
  where it has none of the new tags and the same title as before.

## To resume

Everything is in place. To change what search engines read, edit `searchPages`
in `SearchHead.tsx` and, for a new page to be listed, `public/sitemap.xml`;
the unit test of `SearchHead` checks the sitemap against `searchPages`, and the
browser suite checks what each page is served with.
