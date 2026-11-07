# localStorage hook: results

Checked on macOS with Node 26.13.0 and npm 11.20.0, against `main` at `a65cc6b`.

## The warning

| Where                                         | Before                                      | After |
| --------------------------------------------- | ------------------------------------------- | ----- |
| `npm run build`                               | 7 (one per worker)                          | 0     |
| `npm run build:plm`                           | 7                                           | 0     |
| `next dev`, first page request                | 1                                           | 0     |
| `next start`, requesting every page and a 404 | (recorded in the deprecation-warnings task) | 0     |
| Browser suites' server output                 |                                             | 0     |

`node --trace-warnings` places it in `localStorageAvailable`
(`@rehooks/local-storage/lib/storage.js:13`), called when the module loads. In
Node 26, `typeof localStorage` prints it and `typeof window` does not.

## Behavior

- Development-mode console, with Chromium through Playwright: a profile with no
  settings opened `/settings`; then non-default settings (`DD/MM/YYYY`,
  `12-hour`, flex `0.3` and `0.7`, usage data off) were saved and `/` (loading a
  photo), `/settings`, `/about`, `/demo` and `/settings` were reloaded. Before and
  after, warm servers gave identical logs: no hydration warnings or page errors,
  the same stored values, the Settings page's first rendered state already showing
  the saved values, the same pane flex and dates. The only error, in both, was the
  analytics script the check blocks.
- A temporary Jest test, not committed, compared the hook with the library's
  2.4.5 code over 30 values and 6 defaults: stored strings, first-render values,
  defaults stored on mount, same-tab writes and other-tab changes. All 1134
  results were identical.
- Breaking the hook in seven ways (reading `typeof localStorage`, the default on
  the first render, JSON-quoted strings, no `storage` listener, no same-tab event,
  no default stored, a null default stored) each failed a unit test.
- Running the settings initializer during render again, as before the review fix,
  fails two unit tests: React logs "Cannot update a component (`DateFormat`)
  while rendering a different component (`Root`)" after another tab removes the
  setting.
- With `localStorage` throwing a `SecurityError` on every read, as Chrome does
  when site data is blocked, `/` and `/settings` were blank with that page error,
  on `main` and with this change alike.

All checks below were run again after the review fix, with the same results; the
console comparison was again identical to the baseline.

## Checks

| Check                                        | Result                                                                        |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| Clean `npm ci`                               | Only the three known deprecation warnings; 859 packages                       |
| `npm ls --all`                               | Passes                                                                        |
| `npm audit`                                  | No production entries; 28 development entries (5 low, 23 moderate), as before |
| `npm run test:all`                           | Passes; 132 tests (111 before)                                                |
| `npm run test:e2e`                           | 12 passed                                                                     |
| `PDV_DEV=1 npm run test:e2e`                 | 1 passed, with the known `/_next/hmr` notice                                  |
| `npm run test:electron` with Electron 32.0.2 | 2 passed                                                                      |
| Prettier on the new files                    | Passes                                                                        |

## After merging `main`

`main` meanwhile removed the unused SVGR loader, which also changed
`package.json` and `package-lock.json`. After merging it, a clean `npm ci` (728
packages) printed only the three known deprecation warnings, and these passed:
`npm ls --all`, `npm run test:all` (130 tests), both builds (no warning),
`npm run test:e2e` (12), `PDV_DEV=1 npm run test:e2e` (1) and
`npm run test:electron` (2).

## After handling a cleared storage

A `storage` event with a null key, which another tab's `localStorage.clear()`
fires, now makes the hook read its value again. Two unit tests cover it: one fails
without the change, and the other also fails if the hook takes the event's null
value instead of reading again. Then `npm run test:all` (132 tests), both builds (no
warning), `npm run test:e2e` (12), `PDV_DEV=1 npm run test:e2e` (1) and
`npm run test:electron` (2) passed.
