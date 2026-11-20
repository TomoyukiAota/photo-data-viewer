# Reload on missing build files: results

Checked on 2026-11-20 on macOS 27 with Node 26.13.0 / npm 11.20.0, on the
branch `claude/reload-on-missing-build-files-d5b709` from `main` at `46342a9`.
Both builds were made as CI makes them, with `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
empty. Everything ran headless: Playwright's browsers, and Electron's windows,
which the suite creates hidden.

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 58 suites, 812 tests passed, 16 of them new (`reload-for-missing-build-files.spec.ts`). |
| `npm run build` and `npm run build:plm` | Passed. |
| `npm run test:e2e` | 64 passed, the 6 new ones included. |
| `PDV_DEV=1 npm run test:e2e` | 1 passed. |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`, Chrome on macOS | 64 passed, with the visual comparison; no screenshot changed. |
| `npm run test:electron` with Electron 32.0.2 | 13 passed, the 2 new ones included. |
| `npm run test:electron -- --grep "isolated window"` with Electron 45.2.1, Photo Location Map's | 8 passed, the new one included. |
| The browser suite in Firefox | Not run. |

## The page's head

In both builds, the script is the first script of the head, after the
`<meta>` elements, the search engines' links and Next.js' two preloads of its
stylesheets, and before every stylesheet and script. The root is empty:
`<div id="__next"></div>`. The script as served parses (`node --check`).

## Without the script

A throwaway Playwright case served the standalone build with its `_app`
script answered 404 in the first load. With the script taken out of the HTML,
the page loaded once and was still empty 5 seconds later, as users have seen
it. With the script, it loaded itself again once and showed the Home page.

With the chunks that webpack loads once the app runs answered 404 (two, the
map's, at 1280 × 800), the page loaded once, and its map stayed at "A map is
loading" 4 seconds later ([the plan](../PLAN.md#a-file-that-fails-once-the-app-runs)).

## The change watched on 2026-11-20

The page loads made while `46342a9` became the deployment, each checked for
its `_app` and `main` scripts, from one place. "Old" and "new" are the
deployments whose HTML the load got. The 703 loads before, from 12:29:49,
all got the old HTML and both scripts, and the 624 after, to 12:32:57, the new
HTML and both scripts.

| Time (UTC) | HTML of | `_app` | `main` |
| --- | --- | --- | --- |
| 12:31:26.265 | old | 404 | 200 |
| 12:31:26.580 | old | 404 | 200 |
| 12:31:27.170 | new | 404 | 200 |
| 12:31:27.661 | new | 200 | 200 |
| 12:31:27.791 | new | 404 | 200 |
| 12:31:28.143 | new | 200 | 200 |
| 12:31:28.288 | old | 200 | 404 |
| 12:31:28.437 | new | 200 | 200 |
| 12:31:29.366 to 12:31:31.865, 19 loads | new | 200 | 200 |
| 12:31:31.989 | old | 404 | 404 |
| 12:31:32.120 | old | 404 | 404 |
| 12:31:32.283 to 12:31:33.663, 12 loads | new | 200 | 200 |
| 12:31:33.793 | old | 404 | 404 |
| 12:31:33.921 | old | 404 | 404 |
| 12:31:34.056 | old | 404 | 404 |

10 of the 44 loads got a 404: 5 in the first 2 seconds, then 2 and 3 in a
row. Another place, such as CI's, can be served otherwise.

### Replayed

A page opened at each of 4,000 moments from 12:31:26.0 to 12:31:34.3, whose
loads took T seconds, loading itself again 500 ms after each load that got a
404, with each load taken as the one watched nearest in time. Of the pages
whose first load got a 404:

| T | The first load again got a 404 too | So did the second | So did the third |
| --- | --- | --- | --- |
| 0.3 s | 35% | 10% | 0 |
| 0.6 s | 28% | 6% | 0 |
| 1.0 s | 16% | 0 | 0 |

With 300 ms instead of 500, and T of 0.3 s, 8% got a 404 in all 3.

## Photo Location Map's e2e suite

A throwaway Playwright case ran a stand-in of `expectShownInViewer`
(photo-location-map#762) against the standalone build in headless Chromium:
the same polling of the page and of its 404s under `/_next/static/`, the same
2 seconds, and `webContents.isLoading()` read from the DevTools protocol's
`frameStartedLoading` and `frameStoppedLoading` of the main frame. The page
was loaded as `loadURL()` loads it, while the function waited for the Select
Photo button. Its `_app` script was answered 404 in its first 0 to 4 loads,
and its HTML came at once or after a random 0 to 600 ms. 6 runs each.

As the function is:

| Server | Loads with a 404 | Runs passed | Loads | Loads by the function |
| --- | --- | --- | --- | --- |
| at once | 0 | 6 of 6 | 1 | 0 |
| at once | 1 | 6 of 6 | 3 | 1 |
| at once | 2 | 6 of 6 | 4 | 1 |
| at once | 3 | 6 of 6 | 4 or 5 | 1 |
| at once | 4 | 6 of 6 | 5 or 6 | 1 or 2 |
| 0 to 600 ms | 0 | 6 of 6 | 1 | 0 |
| 0 to 600 ms | 1 | 6 of 6 | 3 | 1 |
| 0 to 600 ms | 2 | 6 of 6 | 4 | 1 |
| 0 to 600 ms | 3 | **2 of 6** | 4 or 5 | 1 |
| 0 to 600 ms | 4 | **5 of 6** | 5 or 6 | 1 or 2 |

Each of the 5 runs that failed failed in the function's own reload:
`page.reload: net::ERR_ABORTED; maybe frame was detached?`. The function
decides to load the page while the page's own loads are still going on, and
always loads it once more, even when the page has loaded itself and works.

With the function changed so that, after its 2 seconds, it loads only a page
that is still the same document (the same `performance.timeOrigin` as when it
saw the 404s), not loading, and still with a 404 under `/_next/static/`, and
otherwise goes back to waiting:

| Server | Loads with a 404 | Runs passed | Loads | Loads by the function |
| --- | --- | --- | --- | --- |
| at once | 1 | 6 of 6 | 2 | 0 |
| at once | 2 | 6 of 6 | 3 | 0 |
| at once | 3 | 6 of 6 | 4 | 0 |
| at once | 4 | 6 of 6 | 5 | 1 |
| 0 to 600 ms | 1 | 6 of 6 | 2 | 0 |
| 0 to 600 ms | 2 | 6 of 6 | 3 | 0 |
| 0 to 600 ms | 3 | 6 of 6 | 4 | 0 |
| 0 to 600 ms | 4 | 6 of 6 | 5 | 1 |

It loaded the page only when the page had loaded itself 3 times and left
itself as it was. A page without the script never loads itself, so the
document stays the same, and the function does what it does now.
