# Vercel Web Analytics and Speed Insights: results

## Sources

Vercel's documentation, read on 2026-11-18:

- Web Analytics: [quickstart](https://vercel.com/docs/analytics/quickstart),
  [package](https://vercel.com/docs/analytics/package),
  [privacy](https://vercel.com/docs/analytics/privacy-policy),
  [redacting sensitive data](https://vercel.com/docs/analytics/redacting-sensitive-data)
  (`beforeSend`, and an opt-out kept in `localStorage`),
  [limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing),
  [troubleshooting](https://vercel.com/docs/analytics/troubleshooting).
- Speed Insights: [quickstart](https://vercel.com/docs/speed-insights/quickstart),
  [package](https://vercel.com/docs/speed-insights/package),
  [privacy](https://vercel.com/docs/speed-insights/privacy-policy),
  [metrics](https://vercel.com/docs/speed-insights/metrics),
  [limits and pricing](https://vercel.com/docs/speed-insights/limits-and-pricing),
  [managing usage](https://vercel.com/docs/speed-insights/managing-usage),
  [using Speed Insights](https://vercel.com/docs/speed-insights/using-speed-insights),
  and the [free tier's announcement](https://vercel.com/changelog/speed-insights-free-tier)
  of 2026-08-25.
- Next.js' guide to analytics for the Pages Router,
  `node_modules/next/dist/docs/02-pages/02-guides/analytics.md`, which names
  `useReportWebVitals` and Vercel's service.

## The plan's limits

| | Web Analytics | Speed Insights |
| --- | --- | --- |
| On Hobby | 50,000 events a month, for all the account's projects | 10,000 events over the last 30 days, for the team |
| An event | A page view (custom events need Pro) | One measurement: 3 to 5 for a page load, up to 4 for a page opened from the menu |
| Past the limit | Notified; after 3 days, collection stops, for 7 days or until the next month | Collection stops for at least 14 days, and while the last 30 days hold more than half the allowance |
| Billed on Hobby | Never | Never |
| Kept | 1 month | 24 hours and 7 days shown |
| On the free tier | Every report but custom events and UTM parameters | The Real Experience Score per page and route, with Great and Needs Improvement entries; the measurements one by one, the Poor entries, the countries and the elements need Plus (Pro, $10 a month per project) |

## The packages and the scripts

Both packages are MIT or Apache 2.0, with no dependencies and no install
scripts, so `.npmrc`'s `strict-allow-scripts` needs no approval. The lockfile
adds these two packages and nothing else.

The packages' code for Next.js (`dist/next/index.mjs`) was read, and so were
the scripts as Vercel's CDN serves them
(`https://va.vercel-scripts.com/v1/script.js` and
`/v1/speed-insights/script.js`; on Vercel, the deployment serves them from its
own address).

- **Where the scripts come from.** In production, from the path that Vercel
  gives at build time (`NEXT_PUBLIC_VERCEL_OBSERVABILITY_CLIENT_CONFIG`, chosen
  anew for each build), or else `/_vercel/insights/script.js` and
  `/_vercel/speed-insights/script.js`. When `NODE_ENV` is `development` or
  `test`, Vercel's debug versions from `va.vercel-scripts.com`, which log to
  the console and send nothing.
- **When they load.** Each component adds its script with `defer` in an
  effect, after the page is rendered. The app renders them last, once the page
  is shown.
- **`beforeSend`.** Web Analytics sends nothing when it returns `null` or
  `false`. Speed Insights drops each measurement it returns a false value for,
  and sends nothing when none is left. Both use the address it returns.
- **What they send.** Web Analytics posts the address, the route, the referrer
  of the first page view when it is another site, and its own version.
  Speed Insights posts, for each measurement, its name, its value, the route,
  the address, the kind of navigation and the CSS selector of the element it
  concerns, with the network's speed (`navigator.connection.effectiveType`).
  The rest, such as the location and the browser, Vercel takes from the
  request.
- **Storage and cookies.** Neither script writes cookies. Web Analytics reads
  a key of `localStorage` and writes it only for `identify` and `group`, which
  the app does not use; Speed Insights uses no storage.
- **A browser driven by automation.** Both return before doing anything when
  `navigator.webdriver` is true or the user agent says "Headless", so the
  browser suite could send nothing even with the real scripts.

| Size | Web Analytics | Speed Insights |
| --- | --- | --- |
| The script, loaded after the page | 4,518 B (2,047 B compressed) | 20,277 B (7,335 B compressed) |
| The component, in the app's code (minified) | 3,833 B (1,628 B compressed) | 3,574 B (1,519 B compressed) |

The app's code for every page (`pages/_app`) was 525 KB, 215 KB compressed,
with them.

## On Vercel, before the merge

On 2026-11-18, <https://photo-data-viewer.vercel.app> answered
`/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js` with
JavaScript of 4,518 and 20,277 bytes, the sizes of Vercel's scripts above:
Web Analytics was enabled in the project already. <https://pdv-in-plm.vercel.app>
answered `/_vercel/insights/script.js` with 404.

## Local behavior

On 2026-11-18, on macOS, in headless Chromium. Requests to other hosts were
stopped, so nothing left the machine.

| Opened | Asked for | Queued for the scripts |
| --- | --- | --- |
| The build, `/` | `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`, which `next start` answers with 404 | Both queues |
| The build, as Photo Location Map's isolated window (`/?plmBridge=1`) | Nothing of Vercel's | Nothing |
| The build for Photo Location Map, the same two | The same | The same |
| A development server, `/` | `https://va.vercel-scripts.com/v1/script.debug.js` and `/v1/speed-insights/script.debug.js` | Both queues |
| A development server, `/?plmBridge=1` | Nothing of Vercel's | Nothing |

No error on the page in any. Where a script is missing, the component logs
`[Vercel Web Analytics] Failed to load script…` to the console, and the app
works on. The build for Photo Location Map opened in an ordinary browser counts
as the standalone app and asks for the scripts too; its address is for Photo
Location Map only.

## Checks

| Check | Result |
| --- | --- |
| `npm run test:all` | Passed: lint, types, 665 unit tests, the new ones among them |
| `npm run build`, `npm run build:plm` | Passed |
| A clean `npm ci` | The three known deprecation warnings only; no install script to approve |
| The browser suite, on the build, in Chromium | 26 passed, the new test among them |
| The visual comparison, macOS/Chrome | 24 passed, and `about.png` and `about-ja.png` differed in the text on usage data alone; with those two updated, 26 passed |

The new browser test checks that the app asks for both scripts and queues a
page view of `/` with its route, and one of `/settings` when it is opened from
the menu; that Speed Insights' script has the route; that the function each
script would pass an event through takes the photo's path out of the address
and keeps the rest; that it gives nothing once "Send usage data" is turned
off; and that the page opened again with it off asks for neither script.

In the screenshots, the English text on usage data has five lines instead of
four, each a part of the sentence, and the Japanese four instead of three,
the first ending with 応答にかかった時間、.

Not run: the Electron suite, which opens windows, and Firefox.
`PDV_DEV=1 npm run test:e2e`, against a development server on port 3251,
failed where the photo is rotated, with no style on the photo after the click;
it failed the same with `<VercelAnalytics />` taken out of `_app.tsx`, on the
same server, so it is not from this change.
