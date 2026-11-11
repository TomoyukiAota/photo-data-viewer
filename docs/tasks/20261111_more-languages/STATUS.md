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
- **The words that this app shares with Photo Location Map are the same in
  both**, in each language: its translations, which were written at the same
  time, are the glossary. The list, the texts of a right-to-left language and
  the dates work as they do there.

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
- **The box keeps the height of seven entries** whatever the search leaves, as
  Photo Location Map's does, so that nothing below it moves while the user
  types. At first it was as high as its entries.
- **"No languages found" is said inside the box**, in the place of the entries.
  The line is in the page while it is empty, without height, so that a screen
  reader says the text when it comes.
- **The search field has the focus when the page opens, where that changes
  nothing else.** Photo Location Map's dialog gives its search field the focus.
  On a page, that is done where the main pointer is a mouse or a trackpad, so a
  keyboard is at hand, and while the field is inside the window, without
  scrolling. Where the user types on the screen, the focus would bring the
  keyboard up over the list, so it is left where it is.
- **A letter typed on the list moves the focus to the next language whose name
  starts with it**, and letters typed within half a second of each other are
  taken together, `de` for Deutsch. Photo Location Map's list, made with
  Angular's CDK, does this, and the WAI-ARIA practices recommend it for a list
  box of more than seven entries. At first a letter did nothing here, as the
  search field finds a language; the maintainer chose to add it, so that the
  two lists work the same. It compares as the search does, without regard to
  case or diacritics, and moves at once, where the CDK waits for a pause in
  the typing.
- **The menu's entry is "言語 (Language)"**: the language's word and the English
  one, as Photo Location Map names its Language tab. The page's title is the
  word alone. The entry has a globe for an icon, which shows no script of its
  own; the maintainer kept it when asked.
- **The scrollbar that stays in view is Chrome's, Edge's and Safari's on
  macOS.** Firefox takes the colors and shows its scrollbar when the system
  does; Safari on iOS takes neither. No browser lets a page do more.

### The languages

- **`nn` (Nynorsk) resolves to `nb`** as `no` does, which was not asked for: a
  reader of Nynorsk reads Bokmål better than English. Photo Location Map does
  the same, and the maintainer kept it when asked.
- **`zh-MO` is `zh-Hant`, and `zh-SG` and a plain `zh` are `zh-Hans`.** A plain
  `pt` is `pt-BR`; a region other than Brazil is `pt-PT`.
- **Names stay as the English text writes them.** Google's products are the
  exception: they are written as Google names them in the language, as Photo
  Location Map writes them and as Japanese did already (`Google マップ`, `Mapy
  Google`). At first the 40 new languages kept the English names.
- **Latitude and Longitude are abbreviated in ten languages**, a few words
  carry a soft hyphen, and "12- or 24-hour" is `12/24` in twelve: see
  [the words chosen](./evidence/TERMS.md).

### The words shared with Photo Location Map

Photo Location Map's 42 translations were compared with this app's, and 324
texts in 40 languages were changed to its words:
[the words chosen](./evidence/TERMS.md) lists what was taken and what is kept
different.

- **Its word is taken unless this app's is clearly the better one**: for the
  texts that are the same in English in both, and for the words inside the
  other sentences (a photo, location data, EXIF data, usage data, Google's
  products, "Use ... setting").
- **The form of a command and the capitals follow it too** where a language
  had them otherwise: the imperative in Dutch, the singular imperative in
  Romanian, the informal form in Galician, forms that address no one in
  Hebrew, and a capital on the first word alone in Indonesian, Malay and
  Turkish.
- **Kept different**, each with its reason in that file: the label "12- or
  24-hour" in five languages, where the longer form is cut in this app's
  field; "Twitter" in Latin letters in Arabic; the no-break space of French;
  the verb for rotating in Finnish; the verb for choosing a photo in five
  languages, where Photo Location Map's is the one for marking.
- **The label "12- or 24-hour" stays short here**, `12/24` and the word for
  hours, in those five languages (`cs`, `da`, `nb`, `ro`, `th`): the maintainer
  decided so when asked, and that Photo Location Map takes the short form, as
  it has it in eight other languages. The other way was to make this app's
  field wider, from 110 to about 125 pixels, which would change the Settings
  page in every language.
- **Japanese**: the sentence that welcomes translations is Photo Location
  Map's (`他の言語`). A map is `マップ`, as Photo Location Map writes it, in the
  four texts that name one: the Map tab, the two messages in its place, and
  the sentence about Photo Location Map on the About page. It was `地図`. Both
  words had been reviewed by the maintainer, who chose this one when asked.
- **A character that is not drawn is written as an escape** in a translation
  file, and the check holds every file to it. French's no-break spaces were
  written as the characters themselves, and the guide showed a soft hyphen as
  one.

### Longer texts

Every language was looked at with a script at 320 and 375 pixels wide. About
half had labels cut off. The layout takes them, rather than the translations
being shortened:

- The tabs scroll when their labels are wider than the window, without MUI's
  scroll buttons, which appeared with nothing to scroll.
- A name in the General tab continues on a second line.
- The Run Demo button grows with its text.

English and Japanese are laid out as before. Of their screenshots, the two of
the Settings page changed, which lost the Language section, and two in
Japanese changed for their words alone, with nothing moved: `about-ja.png` and
`narrow-loaded-ja.png`. The [results](./evidence/RESULTS.md#screenshots) list
them.

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
- **The chosen entry asks for its language again while the app is not shown
  in it.** After a start in English without the saved language, that
  language's entry is the chosen one on the Language page, and choosing it
  would do nothing, as it does while its language is the one shown. It fetches
  the language again there, and so does the entry that follows the browser.
  The setting is the saved one, so nothing is saved or recorded as a change.
  The review of the pull request found this.

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
- **A value that the app puts into a text is kept together** in a
  right-to-left language, between U+2068 and U+2069, as Photo Location Map does
  (`src/i18n/text-values.ts`): the name of the browser's language in the
  list's first entry, and a photo's width and height. The app's name in a
  page's title is not, as the browser draws the title.
- **A file's name keeps its own order** without anything added: it is in an
  element with `dir="auto"`, which sets it apart as `<bdi>` does in Photo
  Location Map. It is the only place where the page shows one.

### Dates

- **A date has the digits 0 to 9 in every language**, as in Photo Location
  Map. dayjs' locale of Arabic turns them into the digits of its script only
  with a plugin that this app does not use, so nothing had to change; a unit
  test now tells if that changes.

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
- Keep the words that this app shares with Photo Location Map the same in
  both when either changes: [the words chosen](./evidence/TERMS.md) lists them,
  and the ones that are kept different.
- Run the Electron suite as `docs/DEVELOPMENT.md` says.
- Photo Location Map's lists of languages and of codes must stay the same as
  this app's: a code that it passes and this app does not have is shown in
  English.
