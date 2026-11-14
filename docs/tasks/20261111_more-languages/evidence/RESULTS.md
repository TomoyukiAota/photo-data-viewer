# More languages: results

Checked on 2026-11-11, 2026-11-12 and 2026-11-14 on macOS 27 (Apple silicon,
system language Japanese), Node 26.13.0 and npm 11.20.0, in the working tree
of the branch `claude/more-languages-and-language-page-96bbc5`. Every browser
ran headless. The numbers under [Checks](#checks) are those of 2026-11-14,
after the language that the app is shown in was added to what the usage data
records.

On 2026-11-12, after the translations were read through again and the layout
was made one for every language, there were 39 suites and 638 unit tests, and
23 tests in the browser suite (22 in Firefox), and all passed. They passed
again on 2026-11-13, after two English sentences were reworded
(`npm run test:all`, `npm run build` and the browser suite in Chromium,
Chrome and Firefox).

## Checks

| Command                                              | Result                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `npm run test:all` (lint, typecheck, Jest)           | Passed: 40 suites, 658 tests, in about two seconds                        |
| `npm run build`, `npm run build:plm`                 | Passed                                                                    |
| `npm run test:e2e` (Chromium)                        | Passed: 25 tests, 9 of them new, in 43 s                                  |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`         | Passed: 25 tests; the screenshots as described below                      |
| `PDV_BROWSER=firefox npm run test:e2e`               | Passed: 24 tests, after the list's box was taken out of the Tab key's stops; the one for a touch device is skipped, as Playwright emulates one in Chromium alone |
| `PDV_DEV=1 npm run test:e2e`                         | Passed: 1 test                                                            |
| `npm run test:electron`                              | **Not run**; see [In Photo Location Map](#in-photo-location-map)          |
| A clean `npm ci`                                     | On 2026-11-11: the three known deprecation warnings only; 731 packages, 3 more than before. No dependency changed since |
| `npm audit`                                          | On 2026-11-11: 26 advisories, the number before; none names a package added here |

Before this work, `main` had 27 suites and 198 tests, and 16 tests in the
browser suite.

## The tests do not multiply with the languages

- The unit test of the translation files, `src/locales/locales.spec.ts`, checks
  every file: 42 files, 8 checks each, and 4 for the list as a whole, 340 tests
  in 0.4 s. It also loads every language as the app does, and compares what it
  got with the file, and holds the list to the order of its names.
- One unit test writes a date in each of the 42 languages, in every format of
  the settings, and tells if a digit is not one of 0 to 9.
- The browser suite has English, Japanese and Arabic, one test for a touch
  device, three tests in Polish at the width of a phone, which stands for
  the languages that write more than English does, and two tests of what is
  recorded about the language: 9 more tests than before, for 42 languages in
  place of 2. The Polish tests find their elements by where they are and name
  no Polish text, so a change of a translation does not break them.
- Unit tests hold the layout's parts to what they are for: each name of the
  latitude and the longitude on the line of its number, the header's room for
  the menu's button, the names of the Settings page's fields tied to their
  fields, and every value of the General tab but the file's name free to take
  a second line.
- Looking at every language in a browser is done with scripts that are not
  part of the repository; see [Every language at the width of a
  phone](#every-language-at-the-width-of-a-phone) and [Every language again,
  with one layout](#every-language-again-with-one-layout).

## Screenshots

Taken with Chrome on this Mac, like the others. Of the 26, 7 changed on
2026-11-12 and 19 did not.

- `settings.png`, `settings-ja.png`: on 2026-11-11 the Language section left
  the Settings page. On 2026-11-12 they did not change: the two fields of
  the date and time follow their texts now, and in English and Japanese they
  are as wide as they were. `settings.png` was updated on 2026-11-13 for the
  English note under the switch, which was reworded; that line differs, and
  no other pixel.
- `settings-ar.png`: new on 2026-11-11. On 2026-11-12 the label of the
  clock's field is the reviewed one, which is longer, and the field is as
  wide as it needs.
- `loaded-general-ar.png`, `narrow-loaded-ar.png`: new on 2026-11-11, in
  Arabic, laid out from the right. On 2026-11-12 one word changed in them,
  the label of the Raw Data tab, which the review of the translations
  changed; no other pixel differs.
- `home-1280.png`, `home-1201.png`, `empty-details.png`,
  `unsupported-dialog.png`: on 2026-11-12, the text in the photo's place
  ("The selected photo will be displayed here.", "Unsupported File Format")
  is drawn a pixel lower, and no other pixel differs. The pane is 331 pixels
  high where it was 330.98: the panes were given 669.98 pixels under the
  header by react-reflex, and have the 670 that are there now that the header
  is not one of them. The text is in the middle of the pane, at 286.5 pixels
  where it was at 286.48, which the browser draws a pixel apart.
- `language.png`, `language-ja.png`, `language-ar.png`: new on 2026-11-11, the
  Language page. Headless Chrome draws no scrollbars, so the list is shown
  without the one that a window has. They were taken again when the
  maintainer fixed the names and their order, when the search field got the
  focus, whose ring the field has in them, and when the search field got its
  magnifying glass.
- `about.png`: updated on 2026-11-13, for the English sentence on what is
  collected, which names the file format of the loaded photo now. The second
  and the third line of that sentence differ, and no other pixel.
- `about-ja.png`: updated on 2026-11-11, for one word of the sentence that
  welcomes translations (`他の言語`) and for the word for a map (`マップ`),
  which are Photo Location Map's now.
- `narrow-loaded-ja.png`: updated on 2026-11-11, for the Map tab's label
  (`マップ`). The tabs and everything else are where they were.
- Every other screenshot is as it was on `main`, which is the check that
  English and Japanese are laid out as before: the four other screenshots of
  the empty Home page (`home-1200.png`, `home-1199.png`, `home-600.png`,
  `home-320.png`), the three of a loaded photo's tabs, `heif-general.png`,
  `narrow-loaded.png`, `narrow-photo.png` and `demo.png`. The layout of
  2026-11-12 changed none of them, nor `about.png`, the three of the Language
  page, `about-ja.png` and `narrow-loaded-ja.png`.

The changed screenshots were compared with the earlier ones pixel by pixel,
at any difference, to find what moved in each. None changed on 2026-11-14,
when the language shown was added to what is recorded: nothing that is shown
changed.

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

The 41 languages other than English are 71.6 kB of texts and 24.0 kB of dayjs
locales together. In the app's own code, they would have been part of every
first visit.

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

## Every language again, with one layout

On 2026-11-12, after the translations were read through again and the rules
that shortened texts for room were withdrawn, a script opened the built app in
headless Chrome in each of the 42 languages, at 320, 390 and 1280 pixels wide,
in every state that shows a text: the Home page empty, with a photo and with
a file that cannot be read (its three tabs on a phone, the dialog, the
messages in the photo's and the map's place), the Settings page with each
clock and with each of its menus open, the Language page with its list and
with no match, the About and Demo pages, and the menu: 18 states on a phone
and 13 at 1280 pixels. In each it looked for a text that is cut or runs out of
its box, a page wider than the window, a text under the menu's button, a name
of the latitude or the longitude that is not beside its number, a word of the
table's names divided without need, and a last line of one or two letters. A
second script measured the values of the General tab, which the first leaves
out as a photo's own data, in every language at 320, 375 and 390 pixels, with
each clock and for a photo without EXIF data.

Every state was also looked at, language by language, in pictures of 14
languages side by side: at 320 pixels the Home page with a photo, the
Settings page from top to bottom, the dialog, the two messages, the menu, the
list's first entry, and the About and Demo pages; at 390 pixels the Home page
with a photo and the Settings page; at 1280 pixels the header, the data's
pane, the panes without a photo, and the Settings and About pages.

With the layout as it was and the reviewed texts, the scripts found:

| What                                                             | Languages                                                       | What was done                                                    |
| ---------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| The name of the clock's field cut, in MUI's label, at every width | 29, such as `da`, `fr`, `pl`, `ru`, `th`                        | A field is as wide as its label and its chosen value need        |
| The clock's field or its name past the window's edge at 320 px    | 30; at 390 px `cs` and `sk`                                     | The fields are one under the other where they do not fit side by side |
| The Settings page wider than the window at 320 px                 | `de`, `et`, `hu`, `nb`, `sv`                                    | The same                                                         |
| The two names of the latitude and the longitude on four lines, beside two numbers on two | `bg`, `cs`, `el`, `hr`, `hu`, `lv`, `pl`, `sk`, `sl`, `sr-Latn` | Each name shares a line of a grid with its number                |
| The date cut at 320 px with the 12-hour clock                     | `ru` by 12 px, `zh-Hans` and `zh-Hant` by 1 px                  | A value continues on the next line                               |
| A last line of one or two letters                                 | `da`, `es`, `ja`, `ko`, `th`, `zh-Hans`, `zh-Hant`              | `text-wrap: pretty` for every text                               |

Looking at the pictures, and the scripts run again on the way, found more,
each corrected in the layout:

| What                                                                                   | Where                                             | What was done                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| The dialog's title, message and button touched where the first two took two lines each | 14 languages at 320 px, such as `de`, `es`, `fr`  | A least space between them                                  |
| A title of two lines with a letter alone on the second (`…ファイル形式で / す`)         | `ja`, in the dialog; as on `main`                 | Lines of about the same length, ending between two phrases  |
| The message in the map's place on two lines where it had one, once it had space inside | `ja`                                              | The space is added to the box, not taken from the sentence  |
| A line of that message as wide as its box, touching the box's edges                    | `uk`; within 2 px in `hi` and `he`                | 4 pixels at each side, as far as English was from the edges |
| The Settings page looked different, with the fields' names above them                  | `en`, `ja`, and every other language              | MUI's labels again, in boxes that follow their texts        |
| A line ending inside a word (`방 / 법`)                                                  | `ko`, such as the About page at 390 px            | `word-break: keep-all` for Korean                           |
| A line ending inside a phrase (`…クリックする / と、`)                                   | `ja`; as on `main`                                | `word-break: auto-phrase` for every text                    |
| The text in the photo's place on two lines at 320 px where it had one                  | `en`                                              | 6 pixels of space at each side, which leaves it one line    |
| A word of the table's names divided though it fitted (`Zeměpis-ná šířka`)              | `cs`, `it`, `ro`, `sk`                            | `text-wrap: pretty` is kept away from the names             |
| A date divided inside its day of the week (`周 / 六`)                                   | `zh-Hans`, `zh-Hant`, with the 12-hour clock      | A value is divided at a space                               |
| The About page ended at its last line where it is longer than the window               | Every language at 320 px; as on `main`            | Space under the last text                                   |
| A line starting with a long vowel mark (`…のペ / ージ`)                                 | `ja`, the Settings page at 320 px; as on `main`   | `line-break: strict` for every text                         |

The last run, on the build that the checks above ran on, found no text cut,
none out of its box or out of the window, no page wider than the window, each
name beside its number, no label of a field cut, and no value cut. What it
still notes are last lines of two letters in Chinese, and one in Korean, each
a whole word (`数据。`), where `text-wrap: pretty` took a letter more to the
line: the header's sentence in Chinese at 320 pixels, and sentences of the
About and Settings pages.

The fields of the Settings page were measured in every language at 320
pixels: the date's field is 150 pixels wide in all of them, as in English,
and the clock's is from 110 pixels (English, Arabic, Korean) to 234
(Slovak), as its label needs. The two are side by side in six languages
there, and one under the other in the others.

The script was checked against itself: run on the version before these
changes, it has to find what is known to be wrong there. That showed that one
of its tests had been leaving out every element of a page laid out from left
to right, since the latitude and the longitude were given a direction of
their own. The numbers above are from the corrected script.

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
and no error was logged. It was run again on 2026-11-12, after the layout was
changed, with the same nine results.

## What is recorded about the language

On 2026-11-14 the built app was opened in headless Chrome set to French, and
what it posts to the analytics backend and gives to Google's tag was read.
Nothing left the machine: the requests to the backend were answered on it,
those to Google were stopped, and the calls to Google's tag were read from
the page.

| Step                                         | Posted to the backend                                                 | Given to Google's tag                               |
| -------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------- |
| The app is opened, nothing chosen            | `Loaded User Setting`: `Language: auto`, then `Language in Use: fr`   | `loaded_user_setting`, with the same two labels     |
| 日本語 is chosen on the Language page        | `Changed User Setting`: `Language: ja`, then `Language in Use: ja`    | `changed_user_setting`, with the same two labels    |
| The Settings page is opened from the menu    | `Left Language Page`, with the label below                            | `left_language_page`, with the parameters below     |
| The app is opened again                      | `Loaded User Setting`: `Language: ja`, then `Language in Use: ja`     | `loaded_user_setting`, with the same two labels     |
| The app is opened with "Send usage data" off | Nothing                                                               | Nothing: the tag is not loaded                      |

The label of `Left Language Page`, and the parameters of `left_language_page`:

```
{"languageSetting":"ja","languageInUse":"ja","languageSettingOnArrival":"auto","languageInUseOnArrival":"fr","isChanged":true}
{"event_category":"Language Page","language_setting":"ja","language_in_use":"ja","language_setting_on_arrival":"auto","language_in_use_on_arrival":"fr","is_changed":true,"value":""}
```

- Before, the first step gave `Language: auto` alone, which does not tell
  that the app was shown in French, and leaving the Language page gave
  nothing.
- `Page Loaded` carries the browser's languages (`fr-FR`), as before.
- In the build for Photo Location Map, opened as its isolated window opens it
  with `language=ja`, in a browser set to English, the app handed that
  application `Loaded User Setting` with `Language: auto`, the setting saved
  in that window, which is not used there, and then `Language in Use: ja`.
  Before, the language that Photo Location Map passed was in none of the
  events.
- The browser suite checks the same in an English and in a Japanese browser,
  the Language page left by the menu and by the browser's Back.

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

- **react-reflex gives its panes a little less than the room they have**:
  669.98 pixels of 670 under a header of 130. With the header out of the
  panes, they have all of it, which moved a text in the middle of a pane by
  what the browser draws as a pixel
  ([Screenshots](#screenshots)).
- **MUI sets the margin of a dialog's title to none**, over a margin given by
  a class of the app. The space above the title is in the dialog's padding.
- **A table cell lets a text on one line run through its padding** before it
  is cut. A value that may take a second line does the same, so that the
  dates that filled the cell stay on one line.
- **The browser test of the fields' English widths failed in CI**, twice on
  Ubuntu and once on macOS, where it had passed locally. On Ubuntu the date's
  field was 152 pixels wide, not 150: its box laid out every choice, and one
  that is not the chosen one is wider there than on macOS. The box lays out
  the label alone now, and the field is as wide as its chosen value, as MUI
  makes it. On macOS the test asked for the widths before the page had its
  fields; it asks until it has them.
- **The browser test of what is recorded about the language failed once in
  CI**, on Windows, in one of the two runs of a commit: the event of leaving
  the Language page had not arrived after five seconds, which is how long
  `expect` waits. It did not fail in 214 tries on this Mac, with the page's
  processor slowed down and several pages at once: the event arrived about a
  second after the page changed. What fits is a request that failed. The app
  then tries again five seconds later, so the event arrives after six, a
  second after the test stopped waiting; a request made to fail on purpose
  gave just that. The two tests wait 15 seconds now, and a failure shows what
  the app logged about sending and how often the page was loaded, as CI keeps
  no trace of a test. What made the request fail is not known. The test of
  the errors that are sent waits five seconds still, as it did not fail.
- **Firefox makes a stop of the Tab key of every box that scrolls.** The list
  took two presses to reach: the box, then the entry. The box is no longer a
  stop itself.
- **The browser suite could wait for a map on the Settings page**, which has
  none. Its helper that opens a page from the menu returned at the click,
  before the page's address had changed, and the helper that takes a
  screenshot goes by the address to tell whether to wait for the map. It
  failed once in CI, on Ubuntu, in a test that this work did not change; the
  two helpers are `main`'s. The first now waits for the new address.
- **MUI's scroll buttons on tabs** appear when a tab is less than 99% in view.
  The tab bar here is a pixel lower than its tabs while the table under it is
  tall, so the buttons appeared with nothing to scroll.
- **The menu's backdrop does not fade**: its opacity is set in the app, which
  overrides the fade, so it stays for a moment after the menu closes and then
  goes at once. Left as it is.
- **In Japanese at 320 pixels, the header's button ends a pixel inside the
  header's padding.** This is `main`'s layout: the header is the same in
  `narrow-loaded-ja.png` as it is there.
