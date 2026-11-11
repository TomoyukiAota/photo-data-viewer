# More languages: results

Checked on 2026-11-11 on macOS 27 (Apple silicon, system language Japanese),
Node 26.13.0 and npm 11.20.0, in the working tree of the branch
`claude/more-languages-and-language-page-96bbc5`. Every browser ran headless.

## Checks

| Command                                              | Result                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `npm run test:all` (lint, typecheck, Jest)           | Passed: 36 suites, 628 tests, in about two seconds                        |
| `npm run build`, `npm run build:plm`                 | Passed                                                                    |
| `npm run test:e2e` (Chromium)                        | Passed: 20 tests, 4 of them new, in 26 s                                  |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`         | Passed: 20 tests; the screenshots as described below                      |
| `PDV_BROWSER=firefox npm run test:e2e`               | Passed: 19 tests, after the list's box was taken out of the Tab key's stops; the one for a phone is skipped, as Playwright emulates a touch device in Chromium alone |
| `PDV_DEV=1 npm run test:e2e`                         | Passed: 1 test                                                            |
| `npm run test:electron`                              | **Not run**; see [In Photo Location Map](#in-photo-location-map)          |
| A clean `npm ci`                                     | The three known deprecation warnings only; 732 packages, 4 more than before |
| `npm audit`                                          | 26 advisories, the number before; none names a package added here         |

Before this work, `main` had 27 suites and 198 tests, and 16 tests in the
browser suite.

## The tests do not multiply with the languages

- The unit test of the translation files, `src/locales/locales.spec.ts`, checks
  every file: 42 files, 8 checks each, and 4 for the list as a whole, 340 tests
  in 0.4 s. It also loads every language as the app does, and compares what it
  got with the file, and holds the list to the order of its names.
- One unit test writes a date in each of the 42 languages, in every format of
  the settings, and tells if a digit is not one of 0 to 9.
- The browser suite has English, Japanese and Arabic, and one test for a
  phone: 4 more tests than before, for 42 languages in place of 2.
- Looking at every language in a browser was done once, with scripts that are
  not part of the repository; see [Every language at the width of a
  phone](#every-language-at-the-width-of-a-phone).

## Screenshots

Taken with Chrome on this Mac, like the others.

- `settings.png`, `settings-ja.png`: updated. The Language section is no longer
  on the Settings page.
- `language.png`, `language-ja.png`: new, the Language page. Headless Chrome
  draws no scrollbars, so the list is shown without the one that a window has.
  They and `language-ar.png` were taken again when the maintainer fixed the
  names and their order, when the search field got the focus, whose ring the
  field has in them, and when the flags came: the suite waits until each flag
  is drawn before it takes them.
- `about-ja.png`: updated, for one word of the sentence that welcomes
  translations (`他の言語`) and for the word for a map (`マップ`), which are
  Photo Location Map's now.
- `narrow-loaded-ja.png`: updated, for the Map tab's label (`マップ`). The
  tabs and everything else are where they were.
- `loaded-general-ar.png`, `narrow-loaded-ar.png`, `settings-ar.png`,
  `language-ar.png`: new, in Arabic, laid out from the right.
- Every other screenshot is unchanged, which is the check that English and
  Japanese are laid out as before: the six of the empty Home page, the three of
  a loaded photo's tabs, `heif-general.png`, `empty-details.png`,
  `unsupported-dialog.png`, `narrow-loaded.png`, `narrow-photo.png`,
  `about.png` and `demo.png`.

Two of them caught mistakes on the way, which were corrected:

- `demo.png` changed when the Run Demo button was given a minimum width in
  place of a width: MUI's own minimum width took precedence, and the button was
  narrower in English.
- With MUI's scroll buttons on the tabs, the buttons appeared in English once a
  photo was loaded and Details was chosen, with nothing to scroll.

A screenshot taken right after the menu was used showed the page under the
menu's grey backdrop, which stays for a moment after the menu closes; the
suite now waits for the menu to be closed first.

## The size of what a visitor downloads

Compressed with Brotli, as the host serves it; measured from the build.

| What                                                      | Before | Now      |
| --------------------------------------------------------- | ------ | -------- |
| The app's own code, loaded with every page (`_app`)        | 267.0 kB | 272.9 kB |
| A language's texts, fetched when it is shown               | (in the app) | 1.5 to 2.1 kB |
| Its dayjs locale, fetched with them                        | (in the app) | up to 0.9 kB |
| The styles for right-to-left languages, fetched with one   | none   | 2.0 kB   |
| The flags, fetched when the Language page opens            | none   | 90.8 kB in 42 files |
| The Language page's styles, which name the flags           | none   | 1.5 kB   |

The 41 languages other than English are 71.6 kB of texts and 24.0 kB of dayjs
locales together. In the app's own code, they would have been part of every
first visit.

The flags are 380.7 kB before Brotli. Five of them are most of what is
fetched: Serbia's 41.4 kB, Spain's 12.2 kB, Croatia's 11.3 kB, the Arab
League's 6.7 kB and Galicia's 5.1 kB; the other 37 are 14.1 kB together. No
page but the Language page fetches them.

## Every language at the width of a phone

A script opened the app in each of the 42 languages at 320 pixels wide, and the
table of a loaded photo at 375 pixels too, where its names' column is tightest
for its font. It looked for what a screenshot of one language would not show.

The first run found, in the languages named:

| What                                             | Languages                                  | What was done                                             |
| ------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------- |
| The last tab past the window's edge, by up to 110 px | 21, such as `el`, `sk`, `ru`, `nl`     | The tabs scroll                                           |
| A name of the General tab cut off                | 22, such as `pl`, `hu`, `bg`, `fr`         | A name continues on a second line                         |
| Run Demo on two lines in a button of fixed width | 29                                         | The button grows with its text                            |
| The label "12- or 24-hour" cut off               | `cs`, `da`, `nb`, `ro`, `sk`, `sv`, `th`   | `12/24` and the word for hours                            |
| Latitude and Longitude on more than two lines, beside two numbers | `bg`, `cs`, `el`, `hr`, `hu`, `lv`, `pl`, `sk`, `sl`, `sr-Latn` | Abbreviated |
| A single word broken in the middle               | `da`, `de`, `nl`                           | A soft hyphen where the word may be broken                |

The last run found nothing in any language: no text cut off, no page wider
than the window, the dialog and the map's message inside their boxes, the
header's button inside the header, the menu inside the window, and the About
page no wider than in English at a wide window.

## After the words were brought into line with Photo Location Map

The same script was run again over the 42 languages, with the values shown in
the selects of the Settings page added to what it measures.

| What                                   | Languages                    | What was done                         |
| -------------------------------------- | ---------------------------- | ------------------------------------- |
| The label "12- or 24-hour" cut off, by 1 to 11 px, with Photo Location Map's longer form | `cs`, `da`, `nb`, `ro`, `th` | This app's short form is kept         |

Nothing else was cut: the longer words for a photo in a tab (`Фотография`),
the two forms of the clock in the select (`12 godzin`, `24 godziny`), and the
other labels fit, or scroll with the tabs.

The list was looked at with one match and with none, in English and in Arabic:
the box stays 226 px high (seven entries and its border), and "No languages
found" is at the top of it.

## A language that could not be fetched at the start

The built app was opened in a headless browser with Japanese saved and the file
of its texts blocked, on the Language page:

| Step                                             | Shown in | Chosen entry | What the page says                      |
| ------------------------------------------------ | -------- | ------------ | --------------------------------------- |
| The start, with the file blocked                 | `en`     | 日本語       | Nothing                                 |
| 日本語 chosen again, the file still blocked      | `en`     | 日本語       | "The language could not be loaded. ..." |
| 日本語 chosen again, the file no longer blocked  | `ja`     | 日本語       | Nothing                                 |

The setting stayed `ja` throughout. With the keyboard, Enter on the chosen
entry did the same. Before, choosing the chosen entry did nothing, and the page
had to be loaded again.

## In Photo Location Map

The Electron suite was not run: it starts an Electron application, which can
come to the front of the screen on the machine in use. It has one more case,
for Arabic in the isolated window, and reports the page's direction.

In its place, the build for Photo Location Map was opened in a headless browser
as the isolated window opens it: `plmBridge=1` and the settings in the address,
and a stand-in for the bridge that gave the photo. The browser was set to
German, which the app is to ignore there.

| `language` | Shown in | Direction | The General tab | Date Taken                    |
| ---------- | -------- | --------- | --------------- | ----------------------------- |
| none       | `en`     | `ltr`     | General         | 16/03/2019 Sat 05:29:58 pm    |
| `ja`       | `ja`     | `ltr`     | 全般            | 16/03/2019 (土) 05:29:58 午後 |
| `zh-Hant`  | `zh-Hant` | `ltr`    | 一般            | 16/03/2019 週六 05:29:58 下午 |
| `pt-BR`    | `pt-BR`  | `ltr`     | Geral           | 16/03/2019 sáb 05:29:58 pm    |
| `sr-Latn`  | `sr-Latn` | `ltr`    | Opšte           | 16/03/2019 Sub. 05:29:58 pm   |
| `ar`       | `ar`     | `rtl`     | عام             | 16/03/2019 سبت 05:29:58 م     |
| `he`       | `he`     | `rtl`     | כללי            | 16/03/2019 ש׳ 05:29:58 pm     |
| `xx`       | `en`     | `ltr`     | General         | 16/03/2019 Sat 05:29:58 pm    |
| `zh-TW`    | `zh-Hant` | `ltr`    | 一般            | 16/03/2019 週六 05:29:58 下午 |

In each, the title was "demo.jpg - Photo Location Map", the menu was hidden,
and no error was logged.

## Right to left

Looked at in Arabic at a wide and a narrow window, and in Hebrew on the Home
and About pages:

- The menu is at the top left; the header's text, the tabs and the table start
  from the right; the selects, the switch and the menu's entries are mirrored.
- "3.09 MB", "3024 × 4032" and "-122.005661" keep their order, and a date is
  in the order of its language: the date, the day of the week, the time, from
  the right.
- A long value of the Details tab is cut at its end, with the ellipsis after
  it. Raw Data is from left to right.
- The splitter between the panes moved 100 px to the right when the mouse
  moved 100 px to the left, with the panes laid out from the right. With the
  panes kept on their sides, it follows the mouse. The browser suite checks
  this.
- "No data" is in the middle of the empty table.

## Found on the way

- **Firefox makes a stop of the Tab key of every box that scrolls.** The list
  took two presses to reach: the box, then the entry. The box is no longer a
  stop itself.
- **MUI's scroll buttons on tabs** appear when a tab is less than 99% in view.
  The tab bar here is a pixel lower than its tabs while the table under it is
  tall, so the buttons appeared with nothing to scroll.
- **The menu's backdrop does not fade**: its opacity is set in the app, which
  overrides the fade, so it stays for a moment after the menu closes and then
  goes at once. Left as it is.
- **In Japanese at 320 pixels, the header's button ends a pixel inside the
  header's padding.** This is `main`'s layout: the header is the same in
  `narrow-loaded-ja.png` as it is there.
