# Search results: plan

[`STATUS.md`](./STATUS.md) says how far the work has got.

## What was asked

1. Show a description of Photo Data Viewer in Google's search results.
2. Work out how search engines should see the app now that it is in 42
   languages, with a recommendation; how the language is chosen and how the
   pages are rendered stay as they are, for the maintainer to decide.

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
- **Google runs the pages, and indexes `/` and `/about`.** The title of
  `/about` in its results is the one the page sets when it runs. The snippet
  of `/` is the description, "View your photo data.", followed by the page's
  text: "Select your photo to display EXIF data. Latitude Longitude Home Demo
  Settings Language".
- **There were no `robots.txt` and no sitemap** (404), and the deployment for
  Photo Location Map, which serves the same pages, asked search engines nothing.
  Google has not indexed it.
- **Link previews**, which run no script, found no title and no description.

## The change

- **`SearchHead`** (`src/components/search-head/SearchHead.tsx`) gives each page
  the head that search engines and link previews read: a description of the
  page, its canonical address on `https://photo-data-viewer.vercel.app`, and
  Open Graph's and X's tags. `_app.tsx` renders it with the app's name as the
  title until the page is shown, so the page is served with all of it; once the
  page is shown, the page gives its own title, in its language, and
  `SearchHead` the rest. The pages no longer set a description of their own.
- **The served title is the app's name on every page**, which is the same in
  every language: the tab shows it before the texts of the language arrive, and
  so nothing in English is shown first. Google, which runs the page, reads each
  page's own title ("About - Photo Data Viewer").
- **The deployment for Photo Location Map is served without any of it**, as it
  is now. Its window takes the title of its page, which must be the photo's
  (`PhotoProvider.tsx`; Photo Location Map sets the same title on the window),
  so a title served before the photo's would show in the window while the page
  loads. `SearchHead` tells it apart when the app is built (`PDV_IN_PLM`) and,
  in the browser, by the window it is in.
- **`X-Robots-Tag: noindex`** on every response of the deployment for Photo
  Location Map (`next.config.js`), so that search engines do not index it. It
  is a header rather than a robots.txt rule, as a search engine must be able to
  read a page to see that it is not to be indexed.
- **`public/robots.txt`**, which lets search engines read every page and names
  the sitemap, and **`public/sitemap.xml`**, which lists the Home page and the
  About page. The other pages are tools of the app, reached from its menu.
- **No image for link previews yet**: the app has none of a suitable size. An
  `og:image` can be added once there is one (see STATUS.md).

## Languages

The options for showing the other languages in search results, their costs and
risks, and the recommendation are in
[evidence/LANGUAGES.md](./evidence/LANGUAGES.md). In short: English in search
results for now, as this change does; measure with Search Console; then, if
there is demand, an address per language as a path, starting with the languages
that a speaker has reviewed.

## Steps

- [x] Find what search engines get today: the served HTML, how Google renders
      it, what Google shows.
- [x] Give each page its title, description, canonical address and link
      preview tags in the served HTML, without a change to Photo Location Map's
      window.
- [x] `robots.txt`, the sitemap, and `noindex` for the deployment for Photo
      Location Map.
- [x] Tests: unit tests of `SearchHead`, the files and the header; browser
      tests of the served head, the head after the page runs, and a Japanese
      page before its texts arrive.
- [x] The languages: options and recommendation.
- [ ] After the merge and deployment, by the maintainer: check
      `https://photo-data-viewer.vercel.app/` with Google's URL Inspection tool,
      and submit the sitemap in Search Console.
