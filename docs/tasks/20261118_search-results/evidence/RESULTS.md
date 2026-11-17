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

## After the change

Built from this branch: `npm run build`, with `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=`
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

The descriptions, in `searchPages` of `SearchHead.tsx`. A search result shows
about 155 to 160 characters of one on a computer, fewer on a phone.

| Page        | Characters | Description                                                                                                                                                  |
| ----------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`         | 154        | View the EXIF data of your photo in your browser: the date taken, the location on a map, the camera and its settings. The photo is not sent to any server. |
| `/about`    | 154        | How Photo Data Viewer reads your photo in your browser without sending it to any server, the usage data it collects, its source code and who develops it.  |
| `/demo`     | 142        | Try Photo Data Viewer with a sample photo, and see the EXIF data it shows: the date taken, the location on a map, the camera and its settings.              |
| `/settings` | 125        | Choose how Photo Data Viewer writes dates and times, and whether it sends usage data. The settings are saved in your browser.                                |
| `/language` | 102        | Choose the language that Photo Data Viewer is shown in, or let it follow the language of your browser.                                                      |

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

## Checks

- `npm run test:all`: lint and type check clean; 42 suites, 673 tests pass.
- `npm run build` and `npm run build:plm`: pass. Next.js 16.4.3 ended some of
  the runs with exit code 1 after building every page, saying that its version
  has a known vulnerability (`npm audit`: GHSA-mfr8-8qww-v76h, moderate, about
  `'use cache'`, which this app does not use; fixed in 16.4.6); run again, it
  continued with a warning and exit code 0.
- The browser suite, `PDV_BASE_URL=http://127.0.0.1:3210 PDV_CHROME=1
  PDV_VISUAL=1 npm run test:e2e`, with the visual comparison against the
  committed screenshots: 29 tests pass, the four new ones among them. No
  reference screenshot changed: what is drawn on the pages is the same.
- The development-mode smoke test, `PDV_DEV=1` against `next dev` on port
  3211: passes. In development mode, which reports more, the console had no
  warning from React or Next.js on any of the five pages, in English and in
  Japanese.
- Not run: the Electron suite, which opens windows on the machine, and Firefox.
  The deployment for Photo Location Map was checked with `curl` and headless
  Chromium as above.
