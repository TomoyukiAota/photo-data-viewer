# Multiple languages: results

Checked on 2026-11-08 on macOS 27 (Apple silicon, system language Japanese),
Node 26.13.0 and npm 11.20.0, in the working tree with all three stages of the
plan.

## Checks

| Command                                          | Result                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| `npm run test:all` (lint, typecheck, Jest)       | Passed: 25 suites, 182 tests (3 suites and 25 tests of them new)           |
| `npm run build`                                  | Passed                                                                     |
| `npm run build:plm`                              | Passed                                                                     |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`     | Passed: 16 tests, 2 of them new; the screenshots as described below        |
| `npm run test:e2e` (Chromium)                    | Passed: 16 tests                                                           |
| `PDV_DEV=1 npm run test:e2e`                     | Passed: 1 test                                                             |
| `npm run test:electron` with Electron 32.0.2     | Passed: 4 tests, 1 of them new                                             |
| A clean `npm ci`                                 | The three known deprecation warnings only; `npm ls --all` passes           |
| `npm audit`                                      | 26 advisories, all in the existing Jest and ESLint tooling; none names i18next, react-i18next or html-parse-stringify |

### After merging `main` on 2026-11-10

`main` gained Photo Location Map's isolated window, which has no Node.js and
gives the photo through a bridge, with tests of its own in the Electron suite.
The Electron harness and `package.json` conflicted, and were merged by keeping
both sides. The checks were then run again, except the visual run, the
`PDV_DEV` run, the clean `npm ci` and `npm audit`; the pull request's checks
run `npm ci` and the tests on three operating systems.

| Command                                          | Result                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| `npm run test:all` (lint, typecheck, Jest)       | Passed: 27 suites, 195 tests                                               |
| `npm run build`, `npm run build:plm`             | Passed                                                                     |
| `npm run test:e2e` (Chromium)                    | Passed: 16 tests                                                           |
| `npm run test:electron` with Electron 32.0.2     | Passed: 10 tests; the language test runs in both windows, see below        |

### After the maintainer's review of the Japanese texts, 2026-11-10

Six texts in `ja.json` were changed, the note under the usage data switch lost
its second sentence in both languages, and a date in Japanese writes the day of
the week in parentheses through `dateTime.weekdayPattern` (see `STATUS.md`).
The visual run in Chrome changed `settings.png`, `narrow-loaded-ja.png`,
`settings-ja.png` and `about-ja.png`, and nothing else; in `settings.png` the
content column is narrower, and so sits further right, as the sentence that was
removed had been its widest line. The checks were run again:

| Command                                          | Result                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| `npm run test:all` (lint, typecheck, Jest)       | Passed: 27 suites, 198 tests (3 of them new, for the weekday pattern)      |
| `npm run build`, `npm run build:plm`             | Passed                                                                     |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`     | Passed: 16 tests, with the four screenshots updated                        |
| `npm run test:e2e` (Chromium)                    | Passed: 16 tests                                                           |
| `npm run test:electron` with Electron 32.0.2     | Passed: 10 tests                                                           |

Stage 1 was checked on its own before stages 2 and 3 were started: with the
texts moved out of the components and nothing else, the visual run in Chrome
passed with every one of the 14 tests and no screenshot changed, and so did the
Chromium run. That is the check that no text was lost or altered.

## Screenshots

- `settings.png`: updated for the Language section that stage 2 adds above
  Date & Time Format. Nothing else on the page moved.
- `about.png`: updated for the line that stage 3 adds, "Translations into other
  languages are welcome: see how to translate this application." The other
  paragraphs are as they were.
- `narrow-loaded-ja.png`, `settings-ja.png` and `about-ja.png`: new, from the
  tests that run with a Japanese browser context, taken on this Mac with Chrome
  like the others. The Japanese glyphs come from the system's fonts, so these
  compare on macOS only, as the English ones do.
- While looking at `settings-ja.png`, the label of the 12/24-hour select,
  "12 時間制 / 24 時間制", was cut off at the select's width; it is
  "12/24 時間制" now.

## What the new tests check

- Jest: `PhotoImage` shows "Unsupported File Format" through React in place of
  an image the browser cannot show, and shows the next image again; every file
  under `src/locales/` has only known keys, no empty text, the English
  `{{placeholders}}` and `<tags>`, and an entry in `languages.ts`;
  `resolveLanguage` for each source in both modes (the setting, the browser's
  languages with `ja-JP` → `ja`, unknown languages → English, the `language`
  parameter in Photo Location Map, where the setting and the machine's language
  are ignored); `useUserSettings` reads, stores and defaults `Language`.
- Browser, `ja-JP`: `<html lang="ja">`, Japanese on Home at 320 px with a photo
  loaded, the day of the week from dayjs' Japanese locale in Date Taken, the
  Settings page with "ブラウザの設定に従う（日本語）", switching to English
  applies at once (texts and `lang`) and survives a reload with `Language`
  stored as `en`; the About page in Japanese, with its translated title.
- Electron: the three existing tests also assert `lang="en"` and the English
  General tab, on a machine whose language is Japanese; a new test passes
  `language=ja` and sees `lang="ja"` and the Japanese tab. Since `main` was
  merged, that test runs in both windows of Photo Location Map, the one with
  Node.js and the isolated one, and the isolated window's own tests assert
  `lang="en"` too.

## Found on the way

- The Electron harness looked for the menu button as `button[aria-label=menu]`,
  which is the English label. In Japanese it found nothing, threw inside the
  polling interval, and the promise never settled, so the test timed out after
  30 s with no message. It finds the button by `button[aria-label]` now, and an
  error inside the poll rejects the promise.
- Right after an option of a MUI Select is chosen, its list is still closing
  and carries the same `aria-labelledby`, so Playwright's `getByLabel` finds two
  elements. The Japanese test finds the select by its `combobox` role.
