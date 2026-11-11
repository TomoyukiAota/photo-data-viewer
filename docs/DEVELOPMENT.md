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
Two tests run in a browser set to Japanese (`ja-JP`) and two in one set to
Arabic (`ar-EG`), the one language written from right to left that the suite
covers; their screenshots (`*-ja.png`, `*-ar.png`) also use the system's fonts
for those languages. The suite stays with these three languages: every
translation file is checked by the unit test `src/locales/locales.spec.ts`
instead, which takes no longer with more languages
([TRANSLATING.md](./TRANSLATING.md#what-the-check-verifies)).
One test runs as a phone, where the Language page leaves the keyboard's focus
alone. Playwright emulates a touch device in Chromium alone, so the test is
skipped in Firefox.
For visual comparisons on the same macOS/Chrome environment as the committed
baseline, run `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`. Do not update snapshots
to accept an unexplained UI change. Cross-platform CI runs functional assertions.

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
