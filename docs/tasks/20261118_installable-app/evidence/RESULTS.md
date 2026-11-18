# Installable app: results

Checked on 2026-11-18 on macOS 27 (Apple silicon), Node 26.13.0 and npm 11.20.0.
Every browser ran headless, without a window.

## Checks

| Command                                                   | Result                                                                       |
| --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run test:all` (lint, typecheck, Jest)                | Passed: 40 suites, 658 tests                                                 |
| `npm run build`                                           | Passed                                                                       |
| `npm run build:plm`                                       | Passed                                                                       |
| `npm run test:e2e` (Playwright's Chromium)                | Passed: 26 tests, 1 of them new                                              |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e` (Chrome 157) | Passed: 26 tests; every screenshot matched, none was updated                 |
| `npm run test:electron`                                   | Not run: it opens Electron's windows. The change adds nothing to that build. |
| `node scripts/generate-icons.mjs`, run twice              | The same files, byte for byte                                                |

The browser suites ran against `next start` on a port of their own
(`PDV_BASE_URL`), with the build of `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID= npm run build`.

## Whether Chrome can install the app

Asked through the DevTools protocol (`Page.getInstallabilityErrors`,
`Page.getAppManifest`), with a listener for `beforeinstallprompt`, which the
browser fires when it offers to install the page, on the production builds:

| Browser                                                | Page                                                                 | Installability errors                                                                    | `beforeinstallprompt`       |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------- |
| Chromium 156, full browser, a profile of its own       | Standalone build                                                     | None                                                                                     | Fired, 0.2 s after the load |
| Chrome 157, a profile of its own                       | Standalone build                                                     | None                                                                                     | Fired, 0.2 s after the load |
| Chrome 157, a profile of its own                       | Photo Location Map's build                                           | `no-manifest`                                                                            | Not fired                   |
| Chromium 156, full browser, a profile of its own       | Standalone build, with a manifest of no icons and `display: browser` | `manifest-display-not-supported`, `manifest-missing-suitable-icon`, `no-acceptable-icon` | Not checked                 |
| Chromium 156, full browser, Playwright's usual context | Standalone build                                                     | `in-incognito`                                                                           | Not checked                 |
| Chromium 156, headless shell (Playwright's default)    | Either build, and the broken manifest                                | None, for every page: the shell does not check                                           | Not checked                 |

So the test runs the full browser in a profile of its own. Chrome parsed the
manifest with no errors: the name, `start_url` and `scope` of the app's
origin, `display` standalone, white theme and background, and the four icons.
For the installed app's icon it took one of the icons shown as they are (not
a maskable one), scaled to 144 pixels.

The new test failed, as it should, when it was pointed at Photo Location
Map's build: `no-manifest`.

## The two builds

- The pages of `npm run build` (Home, Demo, Settings, Language, About and the
  404 page) have `<link rel="manifest" href="/manifest.webmanifest"/>` and
  `<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>`.
- The pages of `npm run build:plm` have neither.
- `next start` serves `manifest.webmanifest` as `application/manifest+json`,
  `apple-touch-icon.png` as `image/png` and `favicon.ico` as `image/x-icon`.

## Not checked here

The checks here open no window, so nothing was installed:

- the window of the installed app, its title bar and the icon in the Dock;
- Edge, which is not on this machine; it is built on Chromium and makes the
  same check;
- Safari's Add to Dock and Add to Home Screen, which Playwright's WebKit does
  not have, nor which icon Safari on macOS takes;
- Android, whose launcher cuts the maskable icon to its shape.

[STATUS.md](../STATUS.md#resuming) lists how to try them once deployed.

## The title bar in dark mode

Checked on 2026-11-18, on `main` with the day's other changes (Next.js 16.4.6,
an address for each language) and the two `theme-color`s added.

| Command                                      | Result                                                                 |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run test:all`                           | Passed: 53 suites, 748 tests                                           |
| `npm run build`                              | Passed. Each of its 344 pages has the manifest and both `theme-color`s |
| `npm run build:plm`                          | Passed. None of its 8 pages has the manifest or a `theme-color`        |
| `npm run test:e2e` (Playwright's Chromium)   | Passed: 47 tests, 1 of them new                                        |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e` | Passed: 47 tests; every screenshot matched, none was updated           |

The new test emulates each color scheme and reads the `theme-color` that
matches it: `#ffffff` in the light one, `#202124` in the dark one. What Chrome
makes of it, the installed app's title bar and file dialog, only a window
shows ([STATUS.md](../STATUS.md#resuming)).

## `next build` run by a coding agent

When a coding agent runs `next build`, Next.js 16.4.3 stops it
once after the pages are built, with exit code 1, to recommend an upgrade:
the npm registry lists 16.3.0 to 16.4.4 in an advisory,
[GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h), for
a function with `'use cache'` called through `unstable_cache()`, which this
Pages Router app does not use. The same command run again within five minutes
passes, with a warning (`node_modules/next/dist/lib/upgrade/nudge.js`). The
builds above passed that way.
