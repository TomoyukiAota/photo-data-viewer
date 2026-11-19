# Development and verification

For basic setup and the standalone/embedded development servers, see
[CONTRIBUTING.md](./CONTRIBUTING.md). Run the commands below from the repository root.

## Runtime and package management

Node.js is selected in [mise.toml](../mise.toml). Use that release's bundled npm
rather than installing npm separately.

Local development, CI and Vercel use Node's bundled npm: Node 26.13.0 / npm 11.20.0.
[`vercel.json`](../vercel.json) logs the runtime versions and runs `npm ci` with
the existing npm; it does not download a separate npm release. Vercel's default
build command runs `npm run build`. The Node major comes from `engines.node`;
Vercel controls minor/patch rollout, so check its build logs after Node updates
and keep `mise.toml` and `packageManager` aligned with the selected bundle.
The embedded project's `PDV_IN_PLM=True` setting selects its existing build mode.

[`package.json`](../package.json) retains version-specific `allowScripts`
approvals. [`.npmrc`](../.npmrc) sets `strict-allow-scripts=true`, so npm 11 fails
installation if a dependency has unreviewed install scripts. Review newly
introduced scripts before adding an approval; do not bypass this policy to make
an install pass. See [npm's configuration reference](https://docs.npmjs.com/cli/v11/using-npm/config/#strict-allow-scripts).

### Stay on the documented setup

Use each tool the way its documentation sets it up, such as Jest with
`jest-environment-jsdom` as the
[Next.js Jest guide](https://nextjs.org/docs/pages/guides/testing/jest) installs
it. Depart from that setup, for example with npm `overrides`, a custom test
environment or a patch, only for a specific reason: a feature that cannot be
built otherwise, or avoiding a serious security vulnerability.

Removing a deprecation warning is not such a reason. Upstream updates to the
standard setup resolve it over time, and it is not urgent. Record the warning in
the next section instead.

### Known deprecation warnings

A clean `npm ci` prints three deprecation warnings. Each comes from the latest
release of a package in the standard setup.

| Warning                       | Comes from                                                                                                                                                            | Revisit when                                                                                                                                                                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint@9.39.5` (end-of-life) | `eslint-config-next` bundles `eslint-plugin-react`, `eslint-plugin-import` and `eslint-plugin-jsx-a11y`, whose peer ranges end at ESLint 9, so npm refuses ESLint 10. | The plugins publish ESLint 10 support ([react](https://github.com/jsx-eslint/eslint-plugin-react/issues/3977), [import](https://github.com/import-js/eslint-plugin-import/issues/3278), [jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/1075)). |
| `glob@10.5.0`                 | Jest → `babel-plugin-istanbul` 8.0.0, which collects coverage → `test-exclude` 7.                                                                                     | `babel-plugin-istanbul` accepts `test-exclude` 8 ([upstream issue](https://github.com/istanbuljs/babel-plugin-istanbul/issues/337)).                                                                                                                                   |
| `whatwg-encoding@3.1.1`       | `jest-environment-jsdom` 30.5.2 → jsdom 26.                                                                                                                           | `jest-environment-jsdom` moves to jsdom 27 or later ([upstream issue](https://github.com/jestjs/jest/issues/16000)).                                                                                                                                                   |

After dependency changes, check that a clean `npm ci` prints no other
`npm warn deprecated` lines. The
[deprecation warnings record](./tasks/20261106_deprecation-warnings/STATUS.md)
describes the check and the alternatives that were evaluated.

## Verification

End-to-end tests live in [`tests/e2e`](../tests/e2e). Both Playwright configuration
files are there, alongside `browser` (tests and reference screenshots), `electron`
(integration tests and launcher), and shared `fixtures`. The npm scripts select
the appropriate configuration. App-server working directories and test output
paths are anchored to the repository root.

Use `mise exec -- <command>` when the current shell still has an older runtime
selected after changing `mise.toml`.

```bash
npm run test:all
npm run build
npm run build:plm
npx playwright install chromium
npm run test:e2e
```

`npm run typecheck` generates Next.js types before running TypeScript, including
on a fresh checkout. Next.js manages `next-env.d.ts`; it is ignored by Git because
its imports depend on the active build mode.

The browser suite starts the standalone production server on port 3200. It uses
public/synthetic fixtures, intercepts analytics and map tiles, and loads the same
Roboto font used by the reference application.
Four tests run in a browser set to Japanese (`ja-JP`) and six in one set to
Arabic (`ar-EG`), the one language written from right to left that the suite
covers; their screenshots (`*-ja.png`, `*-ar.png`) also use the system's fonts
for those languages. The suite stays with these three languages and Polish
(below): every translation file is checked by the unit test
`src/locales/locales.spec.ts` instead, which takes no longer with more
languages
([TRANSLATING.md](./TRANSLATING.md#what-the-check-verifies)).
Seven tests run in Polish at the width of a phone (320 pixels). Polish stands
for the languages that write more than English does: its sentences take more
lines, and its names of the latitude and the longitude take two each. The
tests hold the layout to what it is made for, that a text of any length is
shown whole: the header as high as its text, which ends before the menu's
button, each name beside its number, a field as wide as its label, the
dialogs, the veil over a page that a file is dragged over, the messages, the
box of the button about drag and drop, the submenu of the layouts, the button
Layout of Photo Location Map's window with its menu, and the Credits page
uncut, and the split panes inside the window.
They find their elements by where they are and name no Polish text, so that a
change of a translation does not break them.
Three tests, in English, Polish and Arabic, open the Home page as Photo
Location Map's isolated window does: with `plmBridge=1` and the other
parameters that it passes in the address, and a stand-in for its bridge,
which gives the photo and keeps the events that the page sends it. The page
is the standalone server's, which the address puts in the mode of that
window: the deployment for Photo Location Map is built from the same pages,
and the Electron tests below open it.
The tests of a photo dropped on the page dispatch the drag's events, with a
`DataTransfer` that holds the file: Playwright cannot drag a file from outside
the browser, and its own drag, which starts in the page, gives the page no
file. A browser does not let a page set the drop effect of a `DataTransfer`
that the page made, so what the pointer shows over the page and over a dialog
is checked by the unit test `src/components/drop-photo/DropPhoto.spec.tsx`.
The button about drag and drop beside Select Photo is there where the main
pointer is a mouse or a trackpad, as in the suite's browser, so the Home
page's screenshots show it. Its box names the Finder on a Mac and File
Explorer elsewhere: its tests make the page say that it runs on the one or
the other (`navigator.platform`), whatever the machine is.
Two tests run as a phone that is touched: the Language page leaves the
keyboard's focus alone, and the Home page has no button about drag and drop.
Playwright emulates a touch device in Chromium alone, so the tests are
skipped in Firefox.
One test asks Chrome, through the DevTools protocol, whether the app can be
installed as an app of its own. The headless shell that Playwright runs by
default does not check that, and Chrome installs nothing from an Incognito
window, so the test opens Playwright's full Chromium, which
`npx playwright install chromium` installs beside the shell, in a profile of
its own, without a window as well. It is skipped in Firefox.
The tests of the mouse on the menu wait until the menu has grown open
(`untilStill`) before they put the pointer on an entry or measure one.
Playwright's own wait for a stable element can end before Chrome has
started the menu's growing, and once the menu has grown, the pointer is on
another entry.
For visual comparisons on the same macOS/Chrome environment as the committed
baseline, run `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`. Do not update snapshots
to accept an unexplained UI change. Cross-platform CI runs functional assertions.

When a browser test fails in CI, the run keeps Playwright's results as an
artifact, `browser-test-results-<os>-attempt-<n>`: the failed test's trace,
with the page's requests, console and snapshots. Download it from the run's
summary and open the trace with `npx playwright show-trace <trace.zip>`. The
test's output in the log already says when its page was loaded, the requests
that failed and the errors on the page. The repository is public, and so are
its artifacts: a test uses its fixtures and made-up data only.

For Firefox, install Playwright's matching browser with `npx playwright install
firefox`, then run `PDV_BROWSER=firefox npm run test:e2e`. On macOS 27, a
`Could not find profile folder` startup error can occur while Firefox resolves
its app-data directory. Run with an isolated test-owned app-data home:

```bash
mkdir -p .upgrade-artifacts/firefox-home
CFFIXED_USER_HOME="$PWD/.upgrade-artifacts/firefox-home" PDV_BROWSER=firefox npm run test:e2e
```

This setting applies to that command and its child processes. See the
[upstream issue](https://github.com/microsoft/playwright/issues/42768).

Headless Chrome and Firefox draw no scrollbars, so the screenshot of the
Language page shows its list without the scrollbar that a window shows.

The scripts of Vercel's Web Analytics and Speed Insights exist on Vercel only:
the suite answers them with empty scripts. Elsewhere, a production server is
asked for `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`
in vain, and a development server loads Vercel's debug versions, which log to
the console and send nothing.

`PDV_DEV=1 npm run test:e2e` starts a development server on port 3200 and runs
navigation/photo regression checks, including the About-to-Settings link. Close
other test servers on that port first; suites intentionally do not reuse servers.

For embedded integration checks, build with `npm run build:plm` and set
`PDV_ELECTRON_PATH` to a separate Electron runtime executable before running
`npm run test:electron`. The tests open the app in both windows of the companion:
the earlier one, with Node integration, where the app reads the photo by its path,
and the isolated one, without Node.js, in a sandbox, whose bridge gives the photo
(`tests/e2e/electron/isolated-preload.cjs` copies the companion's preload). Run
them with Electron 32.0.2, the runtime of the installed companion 1.12.1, which the
tests of the earlier window check for. Run the isolated window's tests with the
companion's current Electron too: `npm run test:electron -- --grep "isolated window"`.
Tests create disposable profiles.
`PDV_ELECTRON_BASE_URL=http://localhost:3100` can target an already running
`npm run dev:plm` server instead of starting a production one.

## The app's icon

The icon of the installed app, the icon for iPhone and iPad and the favicon
(`public/icons/`, `public/apple-touch-icon.png` and `public/favicon.ico`) are
drawn by [`scripts/generate-icons.mjs`](../scripts/generate-icons.mjs), which
holds the drawing. It also draws the image of a link preview,
`public/link-preview.png` ([below](#search-engines)), whose app name it writes
in Roboto from Google Fonts, so it needs the network. After changing the
drawing, run `node scripts/generate-icons.mjs` and commit the files it writes.
The web app manifest,
[`public/manifest.webmanifest`](../public/manifest.webmanifest), lists the icons
of the installed app; the
[installable app record](./tasks/20261118_installable-app/PLAN.md) says why each
is there.

## Search engines

Every page has an address in each language, such as `/ja/about`, besides the
one without a language, `/about` (`i18n` in [`next.config.js`](../next.config.js),
[`address.ts`](../src/i18n/address.ts)). The address of a language shows the
page in it, whatever the setting; the one without a language shows the language
of the setting or the browser, as it always did. Next.js prerenders each page
once for each language, and gives the address without a language the locale
`default`; it redirects nothing by the browser's language.

The app renders nothing until it runs in the browser, so each page is served
with its head alone: the head that search engines and link previews read, from
[`SearchHead.tsx`](../src/components/search-head/SearchHead.tsx), with the
texts that the page's `getStaticProps` gives in the language of its address
(`pageTitle` and `pageDescription` in the translation files). It has the page's
title, description and canonical address, its address in every language
(`hreflang`, and `x-default` for the one without a language), and Open Graph's
and X's tags. The address without a language is served in English, with the
app's name as the title, which is the same in every language; the page sets its
own title once it is shown. [`robots.txt`](../public/robots.txt) names
[the sitemap](../public/sitemap.xml), which lists the Home page and the About
page at every address. The deployment for Photo Location Map has no addresses
for the languages, is served without that head, and is sent with
`X-Robots-Tag: noindex`.

A link to any page is previewed with the same image,
[`public/link-preview.png`](../public/link-preview.png): the icon's drawing and
the app's name in white on the icon's blue, 1200 by 630 pixels, which most
sites show large, as X does for `summary_large_image`. The name is all that it
says, so the image is the same in every language, and so is its alternative
text. The deployment for Photo Location Map has none, as it has none of the
head. Sites and chat apps keep the image of an address for a while: a changed
image needs a new name, in `linkPreviewImage` in `SearchHead.tsx`, to be shown
at once.

To see what a page is served with, `curl` it, or open it in a browser with
JavaScript turned off. The ways to show the languages in search results that
were weighed are in
[the task record](./tasks/20261118_search-results/evidence/LANGUAGES.md).

## Task records

Keep task-specific plans, progress and evidence under
`docs/tasks/YYYYMMDD_title/`. Use the task's start date in Asia/Tokyo and a short
English title; keep the directory name fixed when resuming the work.

Use `PLAN.md` for the plan, `STATUS.md` for progress and resume instructions, and
`evidence/` for supporting records. Browse [the task directories](./tasks/) to
find the relevant work, then read its `STATUS.md` before resuming. The directory
listing itself is the task list.

Keep ongoing development procedures and application documentation in the shared
documents, including this guide and the repository README.
