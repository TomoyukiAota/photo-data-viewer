# Deprecation warnings: results

Checked on macOS with Node 26.13.0 and npm 11.20.0, against `main` at `3facd83`.

## Where deprecations appear

| Source                              | Method                                                                                                                                          | Deprecations             |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Installation                        | Clean `npm ci`                                                                                                                                  | The three versions below |
| Registry metadata                   | The `deprecated` field of every package version in `package-lock.json`                                                                          | The same three versions  |
| Lint, type check, unit tests        | `npm run lint`, `npm run typecheck`, `npm run test:ci`                                                                                          | None                     |
| Production builds                   | `npm run build` and `npm run build:plm` after removing `.next` and `.next_plm`, with `--trace-deprecation`                                      | None                     |
| Development servers                 | `npm run dev` and `npm run dev:plm`, requesting every page                                                                                      | None                     |
| Browser console in development mode | Chromium via Playwright: every page, JPEG, HEIC and malformed files, tabs, rotation, splitter, settings, demo, narrow layout and a missing page | None                     |
| Browser suites                      | `npm run test:e2e` and `PDV_DEV=1 npm run test:e2e`                                                                                             | None                     |
| CI                                  | Logs and annotations of all three jobs of [run 41278941194](https://github.com/TomoyukiAota/photo-data-viewer/actions/runs/41278941194)         | The same three versions  |

The deprecated versions are `eslint@9.39.5` ("This version is no longer
supported"), `glob@10.5.0` and `whatwg-encoding@3.1.1` ("Use @exodus/bytes
instead"). CI annotations were runner notices only. `npm audit` reports no
production entries and 28 development entries (5 low, 23 moderate) from three
advisories: [deepmerge](https://github.com/advisories/GHSA-gcqx-w48m-w2h4),
[glob](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4) and
[minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249).

## Alternatives evaluated

None was adopted; see the [status](../STATUS.md). The Electron integration suite
(`npm run test:electron`) was not run for them, because it needs a separate
Electron 32.0.2 runtime.

### jsdom through Jest's abstract environment

`jest-environment-jsdom` 30.5.2, the latest release, depends on jsdom `^26.1.0`.
jsdom 27 and later replace `whatwg-encoding` with `@exodus/bytes`.
[Jest documents](https://jestjs.io/docs/test-environment#extending-built-in-environments)
`@jest/environment-jsdom-abstract` for using an installed jsdom, and the package
declares `jsdom: "*"` as its peer. Its 30.5.2 release handles the jsdom 27+
console API, and Jest's own end-to-end suite covers jsdom 27 this way. Jest does
not test the combination with later jsdom majors.

A 15-line `jest.environment.js` with jsdom 30.1.3 removed the warning. Lint, type
check, unit tests (111), coverage, both builds and both browser suites passed, and
a probe test confirmed that Jest ran in jsdom 30.1.3. The lockfile changed only
the jsdom dependency graph; the production dependency tree and `npm audit` were
unchanged. jsdom 31.0.0, published on 2026-11-05, changes parsing at blocking
scripts and was not tried.

### ESLint 10 with overrides

[Next.js documents](https://nextjs.org/docs/app/api-reference/config/eslint)
that `eslint-config-next` 16.4.0 and later supports ESLint 10, and that some
bundled plugins do not yet list ESLint 10 as a peer. `eslint-config-next` 16.4.3
restores the rule-context methods ESLint 10 removed for the `react` and `import`
plugins, and adds the scope support its Babel parser needs.
`eslint-plugin-jsx-a11y` uses none of the removed APIs. With npm,
`eslint-plugin-react` 7.37.5 (peers through `^9.7`) makes ESLint 10 fail with
`ERESOLVE`; `eslint-plugin-import` 2.32.0 and `eslint-plugin-jsx-a11y` 6.10.2
peer through `^9`. All three were their latest releases.

With `eslint` overrides for the three plugins, ESLint 9.39.5 and 10.14.0 linted
the code base and probe files passed through `--stdin-filename` as `src/` files.
The probes break each enabled rule of those plugins: 17 `react` rules plus
`react/self-closing-comp`, `import/no-anonymous-default-export` and all six
`jsx-a11y` rules, together with `react-hooks` and `@next/next` samples.

The code base produced no findings in either version. The probes produced the same
findings at the same positions, with one exception: ESLint 10 removes
`SourceCode#getJSDocComment`, so `eslint-plugin-react` no longer treats a class
whose only React marker is a JSDoc `@extends React.Component` tag as a component.
That class's `react/no-direct-mutation-state` finding was missing under ESLint 10. This code base has no class components.

Some rules that are not enabled call other removed `SourceCode` methods, such as
the `react/jsx-*-spacing` rules and `import/order`. ESLint 10 also depends on
minimatch 10, which is in the minimatch advisory's range, so `npm audit` counted
33 development entries with the same three advisories.

### test-exclude 8 with an override

`babel-plugin-istanbul` 8.0.0, the latest release, requires `test-exclude`
`^7.0.1`. The published packages of `test-exclude` 7.0.2 and 8.0.0 differ only in
the `glob` range (`^10.4.1` → `^13.0.6`) and `engines`. With an override,
`jest --coverage` passed. Jest loads this code only to collect coverage, which CI
does not do, and glob 13 is still in the glob advisory's range.
