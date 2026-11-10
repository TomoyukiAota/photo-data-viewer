# More languages: status

Started on 2026-11-11, on the branch
`claude/more-languages-and-language-page-96bbc5`, from `main` at `a884d15`. It
continues [Multiple languages](../20261108_multiple-languages/STATUS.md). See
the [results](./evidence/RESULTS.md) and [the words chosen](./evidence/TERMS.md).

## What was asked

Photo Location Map got its first translation and a list to choose the language
from. Both applications are to offer the languages that Windows and macOS are
localized in, and to ask for the language in the same way:

1. 42 languages, under the codes that Photo Location Map passes in the
   `language` parameter of this app's address.
2. The same list as Photo Location Map's: a list box with a search field above
   it.
3. A page of its own for the language, in place of a part of the Settings page.

## Current state

All of it is implemented and checked locally, and is in a pull request from
this branch. It is not merged: merging publishes the app, which is the
maintainer's to do.

- **42 languages** (`src/i18n/languages.ts`, `src/locales/`). The 40 new
  translations are machine translation that no speaker has reviewed;
  `docs/TRANSLATING.md` says so for each.
- **A Language page** (`/language`), which the menu opens, with the list
  (`src/components/language/`). The Settings page no longer has a Language
  section.
- **Each language is fetched when it is first shown** (`src/i18n/i18n.ts`):
  English is part of the app, and a visitor downloads one other language, not
  41.
- **Arabic and Hebrew are laid out from the right** (`src/direction/`, and
  logical properties in the app's styles).
- **Regional variants resolve to a language of the list**
  (`src/i18n/resolve-language.ts`).

## Decisions taken on the way

These were open in what was asked, or came up while doing it. Each is worth a
second look.

### The list

- **The first entry reads "Use browser setting (English)"**, and in Japanese
  ブラウザの設定に従う（日本語）, which is the text the maintainer reviewed for
  the select it replaces. It parallels Photo Location Map's "Use system setting
  (English)".
- **The names and their order are the maintainer's**, fixed after the first
  report, and Photo Location Map's too: each language under its own name,
  capitalized as macOS lists them, those in Latin letters by alphabet and then
  the other scripts. It is the order in which a collator for English sorts the
  names, and the check of the translation files holds the list to it.
- **The search also finds a language by its name in the language of the
  page**, as the maintainer added: ドイツ語 finds Deutsch in a page shown in
  Japanese. The browser has those names (`Intl.DisplayNames`), so the app has
  no table of them.
- **The search finds the first entry by its text alone** ("browser",
  "setting"), not by the language it stands for.
- **"No languages found" is said inside the box**, in the place of the entries,
  so the box is one line high then.
- **The box is as high as its entries, up to seven**: it is lower while a
  search leaves fewer than seven.
- **Typing a letter while the list has the focus does nothing.** Photo Location
  Map's list, made with Angular's CDK, jumps to the entry that starts with the
  letter; the search field does that here.
- **The menu's entry is "言語 (Language)"**: the language's word and the English
  one, as Photo Location Map names its Language tab. The page's title is the
  word alone. The entry has a globe for an icon.
- **The scrollbar that stays in view is Chrome's, Edge's and Safari's on
  macOS.** Firefox takes the colors and shows its scrollbar when the system
  does; Safari on iOS takes neither. No browser lets a page do more.

### The languages

- **`nn` (Nynorsk) resolves to `nb`** as `no` does, which was not asked for: a
  reader of Nynorsk reads Bokmål better than English.
- **`zh-MO` is `zh-Hant`, and `zh-SG` and a plain `zh` are `zh-Hans`.** A plain
  `pt` is `pt-BR`; a region other than Brazil is `pt-PT`.
- **Names stay in English in the 40 new languages**, Google Maps and Google
  Street View included, as the guide says. Japanese writes Google's Japanese
  names, as the maintainer reviewed it.
- **Latitude and Longitude are abbreviated in ten languages**, a few words
  carry a soft hyphen, and "12- or 24-hour" is `12/24` in eleven: see
  [the words chosen](./evidence/TERMS.md).

### Longer texts

Every language was looked at with a script at 320 and 375 pixels wide. About
half had labels cut off. The layout takes them, rather than the translations
being shortened:

- The tabs scroll when their labels are wider than the window, without MUI's
  scroll buttons, which appeared with nothing to scroll.
- A name in the General tab continues on a second line.
- The Run Demo button grows with its text.

English and Japanese are laid out as before: no screenshot of them changed but
those of the Settings page.

### Fetching each language when it is shown

- With all 42 in the app's code, every first visit would download about 96 kB
  more (compressed), a third more than now. Fetched when shown, a first visit
  is 6 kB larger than before this work, and a language is 2 to 3 kB.
- The app renders nothing until the language it starts in has arrived, so that
  the page is not shown in English first.
- **When a language cannot be fetched**: at the start, the app is shown in
  English and the setting stays; on the Language page, a line says so, and the
  app and the setting stay as they were. The error is reported as one that
  nothing handled, so it is recorded with the others.

### Right to left

- **The layout is mirrored**, rather than the texts alone being translated: in
  a layout from the left, an Arabic sentence that ends in a full stop or has
  "EXIF" in it is shown in the wrong order.
- **MUI is set up as its guide to right-to-left languages says**: the theme's
  direction, and `@mui/stylis-plugin-rtl` with Emotion's cache. That added
  three dependencies and `@types/stylis`.
- **A photo's data keeps its own direction**: file names, sizes, numbers and
  EXIF values are not Arabic, and a date is in the order of its language.
- **The photo and the map stay on the left, and the data on the right.**
  react-reflex has no right-to-left mode, and its splitter moved against the
  mouse with the panes the other way round.
- **The map's controls stay where Leaflet puts them.**

## Not verified

- **The 40 translations**: no speaker has read them.
- **The Electron suite was not run**: starting Electron can bring an
  application to the front on the machine in use. It gained the page's
  direction in its report, and one case for Arabic. The app as Photo Location
  Map's isolated window opens it was checked in a headless browser instead,
  with a stand-in for the window's bridge
  ([results](./evidence/RESULTS.md#in-photo-location-map)).
- **Safari, and a phone**: the checks ran in headless Chromium, Chrome and
  Firefox on macOS. The scrollbar was looked at in headless Chromium only, with
  its scrollbars turned on; headless Firefox draws none.
- **A screen reader** was not tried on the list.
- **Hebrew** was looked at on the Home page, wide and narrow, and on the About
  page; the browser suite covers the layout from the right in Arabic only.

## Resuming

Nothing is left to implement. What remains is the maintainer's:

- Review the pull request, and merge it when the app is to be published.
- Bring the words that this app shares with Photo Location Map into line, once
  its translations exist: [the words chosen](./evidence/TERMS.md) lists them.
- Run the Electron suite as `docs/DEVELOPMENT.md` says.
- Photo Location Map's lists of languages and of codes must stay the same as
  this app's: a code that it passes and this app does not have is shown in
  English.
