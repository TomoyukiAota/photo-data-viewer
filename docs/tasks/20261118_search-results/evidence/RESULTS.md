# Search results: evidence

## Before the change

Checked on 2026-11-18 against production, which served `main` `76bd3b1`.

### The served HTML

`curl` of each address of both deployments:

| Address                                    | Standalone (`photo-data-viewer.vercel.app`) | Photo Location Map (`pdv-in-plm.vercel.app`) |
| ------------------------------------------ | ------------------------------------------- | -------------------------------------------- |
| `/`, `/about`, `/demo`, `/settings`, `/language` | 200, about 3 KB each                    | 200, the same HTML                           |
| `/robots.txt`, `/sitemap.xml`              | 404                                         | 404                                          |

- The head had `<meta charSet>`, `<meta name="viewport">`, the stylesheets, the
  GA4 snippet and the scripts: **no `<title>`, no `<meta name="description">`**,
  no canonical address, no Open Graph tags.
- The body was `<div id="__next"></div>`, empty, and the root `<html lang="en">`.
- Neither deployment sent `X-Robots-Tag`.

### What Google shows

A `site:` search for each deployment on google.com, in English:

`site:photo-data-viewer.vercel.app` had two results:

| Title                     | Address                                        | Snippet                                                                                                                                  |
| ------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Photo Data Viewer         | `https://photo-data-viewer.vercel.app`         | View your photo data. Select your photo to display EXIF data. Latitude Longitude Home Demo Settings Language                             |
| About - Photo Data Viewer | `https://photo-data-viewer.vercel.app › about` | View your photo data. This application fetches EXIF data from your file within your browser, the locations of many photos all at once? |

- The titles are those that the pages set when they run, and each snippet
  starts with the description that the page set when it ran, followed by the
  page's text, in English: Google ran the pages, as a browser set to English.
  On Home, the text after the description is the header, the names of the
  table and the menu.
- Demo, Settings and Language are not indexed. The menu opens them by script;
  only the About page links to one of them (Settings).

`site:pdv-in-plm.vercel.app` had no results.

A search for `"Photo Data Viewer"` did not have the app on its first page,
which had other EXIF viewers. Their snippets say what the tool shows (the
camera, the location, the date taken) and that the photo is read in the
browser.

## After the first change: one address, in English

The first commit of this task, before the addresses of the languages. Built
from this branch: `npm run build`, with `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=`
as for the browser suite, served with `next start -p 3210`; `npm run build:plm`,
served with `PDV_IN_PLM=True next start -p 3212`.

### The served HTML

Every page of the standalone app, `/about` for instance (React adds
`data-next-head=""` to each tag):

```html
<title>Photo Data Viewer</title>
<meta name="description" content="How Photo Data Viewer reads your photo in your browser without sending it to any server, the usage data it collects, its source code and who develops it."/>
<link rel="canonical" href="https://photo-data-viewer.vercel.app/about"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Photo Data Viewer"/>
<meta property="og:title" content="About - Photo Data Viewer"/>
<meta property="og:description" content="How Photo Data Viewer reads your photo in your browser without sending it to any server, the usage data it collects, its source code and who develops it."/>
<meta property="og:url" content="https://photo-data-viewer.vercel.app/about"/>
<meta name="twitter:card" content="summary"/>
```

The descriptions, now `pageDescription` in `src/locales/en.json`. A search
result shows about 155 to 160 characters of one on a computer, fewer on a
phone.

| Page        | Characters | Description                                                                                                                                                  |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`         | 154        | View the EXIF data of your photo in your browser: the date taken, the location on a map, the camera and its settings. The photo is not sent to any server. |
| `/about`    | 154        | How Photo Data Viewer reads your photo in your browser without sending it to any server, the usage data it collects, its source code and who develops it.  |
| `/demo`     | 142        | Try Photo Data Viewer with a sample photo, and see the EXIF data it shows: the date taken, the location on a map, the camera and its settings.              |
| `/settings` | 125        | Choose how Photo Data Viewer writes dates and times, and whether it sends usage data. The settings are saved in your browser.                                |
| `/language` | 102        | Choose the language that Photo Data Viewer is shown in, or let it follow the language of your browser.                                                      |

The maintainer reworded the Home page's afterwards, as STATUS.md says.

The deployment for Photo Location Map serves its pages without any of these
tags, as before: no title, no description. The page for an address that has
no page (404) has none of them in either deployment, as before.

### The headers, robots.txt and the sitemap

| Response                                   | Standalone                         | Photo Location Map                                    |
| ------------------------------------------ | ---------------------------------- | ----------------------------------------------------- |
| `/`, `/about`                              | 200                                | 200, `X-Robots-Tag: noindex`                          |
| `/robots.txt`                              | 200, `text/plain`                  | 200, `X-Robots-Tag: noindex`                          |
| `/sitemap.xml`                             | 200, `application/xml`             | 200, `X-Robots-Tag: noindex`                          |
| A missing script, an address with no page  | 404                                | 404, `X-Robots-Tag: noindex`                          |

### The head after the page runs

Headless Chromium against the two servers:

| Case                                                                      | Title                                       | Description | Canonical address |
| ------------------------------------------------------------------------- | ------------------------------------------- | ----------- | ----------------- |
| English, `/`                                                              | Photo Data Viewer                           | Home's      | `/`               |
| English, from Home to About with the menu                                 | About - Photo Data Viewer                   | About's     | `/about`          |
| English, a photo loaded on Home                                           | demo.jpg - Photo Data Viewer                | Home's      | `/`               |
| Japanese, `/about`, while the texts of Japanese are held back             | Photo Data Viewer; the body empty           | About's     | `/about`          |
| Japanese, once they have arrived                                          | このアプリについて - Photo Data Viewer       | About's     | `/about`          |
| Photo Location Map's deployment, `/?plmBridge=1&language=en`, once it ran | Photo Data Viewer, the Home page's own      | none        | none              |

Each case had one `<title>` and at most one description. The last case is
what the Home page set before this change as well; the photo's title replaces
it once Photo Location Map gives the photo.

## After the addresses of the languages

Built as above, from the commit that gives each language its addresses.
`next build` prerendered 301 static pages: the five pages, the 404 page and
the 500 page, for each of the 43 locales.

### The addresses

| Address                  | Answer | What it is                                                                       |
| ------------------------ | ------ | -------------------------------------------------------------------------------- |
| `/`, `/about`            | 200    | As before: served in English, `lang="en"`, title Photo Data Viewer             |
| `/ja`, `/ja/about`         | 200    | Served in Japanese, `lang="ja"`                                                |
| `/ar`                    | 200    | `lang="ar" dir="rtl"`                                                          |
| `/pt-BR/about`, `/pt-br/about` | 200 | Either case; the canonical address is `/pt-BR/about`                          |
| `/ja/`                   | 308    | To `/ja`                                                                       |
| `/default/about`         | 200    | The locale of the address without a language; its canonical address is `/about` |
| `/xx/about`, `/ja/nonexistent` | 404 | No such language, no such page                                              |
| `/robots.txt`, `/sitemap.xml` | 200 | Not localized                                                                 |

A redirect from `/default/…` to the address without a language was tried and
removed: Next.js gives every address without a language the locale `default`
before it applies redirects, so `/about` and `/robots.txt` redirected to
themselves.

The head that `/ja/about` is served with (as above, `data-next-head=""` left
out):

```html
<html lang="ja" dir="ltr">
<title>このアプリについて - Photo Data Viewer</title>
<meta name="description" content="Photo Data Viewer は写真をサーバーに送信せず、ブラウザ内部で読み取ります。収集する使用状況データ、ソースコード、開発者についても説明しています。"/>
<link rel="canonical" href="https://photo-data-viewer.vercel.app/ja/about"/>
<link rel="alternate" hrefLang="id" href="https://photo-data-viewer.vercel.app/id/about"/>
<!-- … one for each of the 42 languages … -->
<link rel="alternate" hrefLang="x-default" href="https://photo-data-viewer.vercel.app/about"/>
<meta property="og:title" content="このアプリについて - Photo Data Viewer"/>
```

React writes the attribute `hrefLang`, which HTML reads as `hreflang`.

### In the browser

Headless Chromium against the standalone server:

| Case                                                                         | Address after it | `lang` | Shown in |
| ---------------------------------------------------------------------------- | ---------------- | ------ | -------- |
| A browser set to English opens `/ja/about`                                 | `/ja/about`      | ja     | Japanese; title このアプリについて - Photo Data Viewer from the first byte |
| The menu, to Settings                                                        | `/ja/settings`   | ja     | Japanese |
| The Language page there, English chosen                                      | `/en/language`   | en     | English; setting `en` |
| Back, then Forward                                                           | `/ja/language`, `/en/language` | ja, en | Japanese, English |
| "Use browser setting" chosen                                                 | `/language`      | en     | English; setting `auto` |
| A browser set to Japanese opens `/`                                         | `/`              | ja     | Japanese, as before |
| The same browser opens `/de`                                                | `/de`            | de     | German |
| `/pt-br`, then the menu, to About                                          | `/pt-BR/about`   | pt-BR  | Portuguese (Brazil) |

Each had one title, one description, one canonical address and 43 alternates,
and no error on the page. Before `useLanguageAttribute`, `lang` was
`default` after "Use browser setting": Next.js' router writes the locale into
`lang` after each change of page.

The deployment for Photo Location Map (`npm run build:plm`, port 3212): `/` is
served as before, with `lang="en"` and none of the tags, `/ja` is 404, every
response has `X-Robots-Tag: noindex`, and `/?plmBridge=1&language=ja` shows the
app in Japanese with no description, canonical address or alternate. Its pages
now have `getStaticProps`, which gives `searchHead: null` there.

## Checks

- `npm run test:all`: lint and type check clean; all suites pass (counts in
  the pull request).
- `npm run build` and `npm run build:plm`: pass. Next.js 16.4.3 ended some of
  the runs with exit code 1 after building every page, saying that its version
  has a known vulnerability (`npm audit`: GHSA-mfr8-8qww-v76h, moderate, about
  `'use cache'`, which this app does not use; fixed in 16.4.6); run again, it
  continued with a warning and exit code 0.
- The browser suite, `PDV_BASE_URL=http://127.0.0.1:3210 PDV_CHROME=1
  PDV_VISUAL=1 npm run test:e2e`, with the visual comparison against the
  committed screenshots: all pass (32 with the addresses of the languages), the
  new ones among them. No reference screenshot changed: what is drawn on the
  pages is the same.
- The development-mode smoke test, `PDV_DEV=1` against `next dev` on port
  3211: passes. In development mode, which reports more, the console had no
  warning from React or Next.js on any of the five pages, in English and in
  Japanese, nor on the addresses of the languages (`/ja`, `/ja/about`,
  `/ar/settings`, `/pt-BR/language`, `/de/demo`).
- Not run: the Electron suite, which opens windows on the machine, and Firefox.
  The deployment for Photo Location Map was checked with `curl` and headless
  Chromium as above.

## The image of a link preview

Added on 2026-11-20, after this task was merged
([PLAN.md](../PLAN.md#the-image-of-a-link-preview)).

### Before

Checked on 2026-11-20 with `curl`, against production and against
`npm run build` and `npm run build:plm` of `main` at `92da7e6`, served with
`next start` on ports 3350 and 3352:

- The standalone app, at `/`, `/ja`, `/ja/about`, `/ar/credits` and
  `/de/settings`: the title, the description, the canonical address, and
  `og:type`, `og:site_name`, `og:title`, `og:description` and `og:url` in the
  language of the address, with `twitter:card` `summary`. No `og:image` and no
  `twitter:image`. Production served the same.
- The deployment for Photo Location Map, at `/`, `/?plmBridge=1&language=ja`
  and `/about`, and production's `/`: `X-Robots-Tag: noindex`, and no title, no
  description, no `og:*` and no `twitter:*`.

### After

Built from the branch, on `main` at `7cec082`, and served as above, with
`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=` as in CI.

Each page checked, `/`, `/demo`, `/ja`, `/ja/about`, `/ar/credits` and
`/de/settings`, is served with these after `og:url`, once each (React adds
`data-next-head=""` to each):

```html
<meta property="og:image" content="https://photo-data-viewer.vercel.app/link-preview.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="Photo Data Viewer"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://photo-data-viewer.vercel.app/link-preview.png"/>
<meta name="twitter:image:alt" content="Photo Data Viewer"/>
```

- They are in the head, within the first 6 KB of each page, which has 8.5 to
  9 KB.
- `/link-preview.png` is answered with 200, `image/png` and the 19,269 bytes
  of `public/link-preview.png`: 1200 by 630 pixels, without transparency.
  Measured in Chromium, the drawing spans x 493 to 706 and y 153 to 366, and
  the name x 339 to 864 and y 428 to 477: together they are 153 pixels from the
  top and 152 from the bottom, and inside the square of 630 in the middle,
  x 285 to 915.
- `node scripts/generate-icons.mjs`, run twice, wrote the same
  `public/link-preview.png`, and the icons as they are committed, byte for
  byte.
- The deployment for Photo Location Map is served as before: `/`,
  `/?plmBridge=1&language=ja` and `/about` have `X-Robots-Tag: noindex` and no
  `og:*` or `twitter:*`. It serves `/link-preview.png` too, with
  `X-Robots-Tag: noindex`, as both deployments serve `public/`; no page of it
  names the file.

### Checks

- `npm run test:all`: lint and type check clean; 56 suites, 787 tests pass
  (785 on `main`, and the two new tests of `SearchHead`).
- `npm run build` and `npm run build:plm`: pass, at the first run.
- The browser suite with the visual comparison against the committed
  screenshots, `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e` against the server
  on port 3350 (`PDV_BASE_URL`): all 55 pass. No reference screenshot changed.
  The check that a page which runs has one `og:image` was added after that run;
  the six tests of "what search engines read", run again with it, pass.
- Breakage (temporary): a width of 1201 in `linkPreviewImage` fails the test
  of the head and the test of the file.
- Not run: the Electron suite, which opens windows on the machine, and Firefox.
  No address was given to a service that previews links, so how chat apps and
  social networks draw the preview is not checked
  ([STATUS.md](../STATUS.md#not-verified)).

With `main` merged in at `e1bd4b0` (#101, which also changes
`docs/DEVELOPMENT.md` and the browser suite), the checks were run again:
`npm run test:all` (57 suites, 796 tests), both builds and the browser suite
with the visual comparison (58 tests) passed, and no screenshot changed. The
served heads, checked again with `curl` in both builds, are as above. The
Electron tests were not run.
