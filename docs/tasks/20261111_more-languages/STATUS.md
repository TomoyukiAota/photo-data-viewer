# More languages: status

Started on 2026-11-11, on the branch
`claude/more-languages-and-language-page-96bbc5`, from `main` at `a884d15`. It
continues [Multiple languages](../20261108_multiple-languages/STATUS.md). See
the [results](./evidence/RESULTS.md) and [the words chosen](./evidence/TERMS.md).

On 2026-11-12 the 40 machine translations were read through again, and the
layout was made one for every language:
[One layout for every language](#one-layout-for-every-language).

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
  `docs/TRANSLATING.md` says so for each. A machine read them through again,
  in rounds, for a wording that is more natural or more accurate.
- **One layout for every language**, which holds whatever length a language's
  words and sentences have. No text is shortened or abbreviated for room.
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
- **The search field has a magnifying glass at its end**, the usual sign of a
  search field, which the maintainer asked for in this app, in Photo Location
  Map and on its website alike. It is 20 pixels, in the grey of the field's
  placeholder, 8 pixels from the field's edge, where a line ends: at the right,
  and at the left in Arabic and Hebrew. It is drawn over the field and takes
  no click, and the field's text and the button that clears it end before it.
  It is not read aloud, as the field has its name.
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

### No flags

The maintainer asked for a flag beside each language in the lists of both
applications, and this app had them for a short while, from the flag-icons
package. The maintainer then decided against them, and they were taken out of
both applications:

- **A flag stands for a country, not for a language.** English is the language
  of many countries, so is Arabic, and a country has more than one language.
  Any one flag for a language leaves someone out, which is why lists of
  languages are usually without flags.
- **The list is read by the languages' names**, each in its own language,
  which is what a reader looks for.

### The languages

- **`nn` (Nynorsk) resolves to `nb`** as `no` does, which was not asked for: a
  reader of Nynorsk reads Bokmål better than English. Photo Location Map does
  the same, and the maintainer kept it when asked.
- **`zh-MO` is `zh-Hant`, and `zh-SG` and a plain `zh` are `zh-Hans`.** A plain
  `pt` is `pt-BR`; a region other than Brazil is `pt-PT`.
- **The English text on usage data names the file format of the loaded
  photo**, on the About page, as the Japanese text and the 40 translations
  do, and as is collected. It said "what kind of photo was loaded"; the
  maintainer had it changed on 2026-11-13. Its three items are noun phrases
  alike: the pages that are opened, the file format of the loaded photo and
  the errors that occurred.
- **Names stay as the English text writes them.** Google's products are the
  exception: they are written as Google names them in the language, as Photo
  Location Map writes them and as Japanese did already (`Google マップ`, `Mapy
  Google`). At first the 40 new languages kept the English names.
- **Nothing is abbreviated for room.** At first Latitude and Longitude were
  abbreviated in ten languages and "12- or 24-hour" was `12/24` in twelve,
  so that they fitted where they are shown. Both are written out since the
  layout was made to hold them: see
  [One layout for every language](#one-layout-for-every-language). A few long
  words of the table carry a soft hyphen, which says where they are best
  divided.

### The words shared with Photo Location Map

Photo Location Map's 42 translations were compared with this app's, and 324
texts in 40 languages were changed to its words. The review that followed
changed the two applications together.
[The words chosen](./evidence/TERMS.md) lists what was taken, what the review
changed and what still differs.

- **Its word is taken unless this app's is clearly the better one**: for the
  texts that are the same in English in both, and for the words inside the
  other sentences (a photo, location data, EXIF data, usage data, Google's
  products, "Use ... setting").
- **The form of a command and the capitals follow it too** where a language
  had them otherwise: the imperative in Dutch, the singular imperative in
  Romanian, the informal form in Galician, forms that address no one in
  Hebrew, and a capital on the first word alone in Indonesian, Malay and
  Turkish.
- **Nothing is kept different any more** for the texts that are the same in
  English in both. Five differences were kept at first, each for a reason:
  the label "12- or 24-hour" in five languages, "Twitter" in Latin letters in
  Arabic, the no-break space of French, the verb for rotating in Finnish, and
  the word for usage data in Polish. The review settled each in both
  applications. The verb for choosing a photo still differs in five
  languages, where Photo Location Map's is the one for marking: the English
  texts differ there too.
- **The label "12- or 24-hour" was short here for a day**, `12/24` and the
  word for hours, where the longer form was cut in this app's field: the
  maintainer decided so when asked, and Photo Location Map took the short
  form. The maintainer's later decision that the wording comes before the
  layout withdrew it: the label names the setting as the language does, and
  the field is as wide as it needs.
- **Japanese**: the sentence that welcomes translations is Photo Location
  Map's (`他の言語`). A map is `マップ`, as Photo Location Map writes it, in the
  four texts that name one: the Map tab, the two messages in its place, and
  the sentence about Photo Location Map on the About page. It was `地図`. Both
  words had been reviewed by the maintainer, who chose this one when asked.
- **A character that is not drawn is written as an escape** in a translation
  file, and the check holds every file to it. French's no-break spaces were
  written as the characters themselves, and the guide showed a soft hyphen as
  one.

### One layout for every language

On 2026-11-12 the maintainer decided how the layout and the texts relate, in
four instructions:

1. A natural and accurate translation comes before the layout, by far. The
   layout is to be changed for the texts, and readily.
2. The layout is not to differ from language to language: it is one layout
   for every language, in which a language's texts may be longer or shorter.
3. "Longer or shorter" is the length of a language's words and of its
   sentences.
4. The layout is not to be sized for the longest language either, which
   leaves the others with room that they do not need: it stretches and
   shrinks with each language's texts, and never breaks. What fits in English
   keeps the size that it has there.

So no text is shortened or abbreviated for room, no style or size is set for
one language or for the longest, and the same rules hold everywhere: a
sentence continues on the next line, a word wider than its place is divided
and never cut, a box is as large as its own text needs, and two things side
by side are one under the other where they do not fit. What was changed for
it:

- **The header** is as high as its sentence and its button need, and at least
  the 130 pixels that it had. It was a pane of a fixed height, in which a
  sentence of three lines pushed the button out of view on a phone. It is
  above the panes now, not one of them, in both layouts.
- **The menu's button** has room kept for it at the end of the header, by an
  invisible copy of its icon and its word, so that the sentence ends before
  the button whatever the word under the icon is. The word may be wider than
  the icon's 40 pixels (`IZBORNIK`), up to the button's 64.
- **The names of the General tab's table** continue on the next line between
  two words. A word wider than the column is divided as the language divides
  its words, with a hyphen (`hyphens: auto`), where the browser knows the
  language; a soft hyphen in the text says where, if the translator knows
  better. Where the browser cannot, the word goes on at the column's end,
  which is still all of it.
- **The latitude and the longitude** are a grid of their own in their row:
  each name shares a line of the grid with its number, so the number stays
  beside the name however many lines the name takes. They were two names in
  one cell and two numbers in the next, which came apart when a name took two
  lines.
- **The values of the General tab** continue on the next line as well, all
  but the file's name, which stays on one line and is cut where the column
  ends, as it always was. A date has the day of the week and AM or PM as the
  language writes them: with a 12-hour clock, a Russian date was cut on a
  phone (`… 05:29:58 веч`), and a Chinese one by a pixel. It is divided
  between its day and its time now (`2019-03-16 сбт / 05:29:58 вечера`).
- **The fields of the Settings page** are as wide as their labels and their
  chosen values need, and never narrower than in English (150 and 110
  pixels). MUI makes a field as wide as its chosen value, draws the field's
  label on its border, on one line, and cuts the label where it is wider than
  the field: with the reviewed texts, in 29 languages. Each field is in a box
  that lays out its label without showing it, and fills the box, so that it
  is as wide as the wider of the two; Photo Location Map sizes its fields
  with such a box too. A box that laid out every choice, as Photo Location
  Map's does, made the English date field 152 pixels wide on Linux, where a
  choice that is not the chosen one is that wide; the chosen value alone is
  what the field always followed. The two fields are side by side where both
  fit, as in English, and one under the other where they do not. At first
  the names were put above the fields, which holds for a name of any length
  but changed the page in English and Japanese; the maintainer's fourth
  instruction took that back. What is left open by it: a label wider than
  the window would be cut by MUI. The longest, Slovak's, makes its field 234
  pixels wide, of the 280 that a window of 320 has.
- **The dialog for a file that cannot be read** is as wide and as high as its
  texts need, from 250 by 150 pixels up to the window's width. Its title and
  its message are divided into lines of about the same length
  (`text-wrap: balance`), and its three parts keep a space between them.
- **The message in the map's place** has the 280 pixels for its sentence that
  it had, and is as high as its lines. The box has 4 more pixels at each
  side, which is as far as the English sentence was from the box's edges: the
  Ukrainian sentence's first line is as wide as the 280 pixels, and touched
  them. In a narrower pane the box is narrower.
- **The messages in the photo's place** continue on the next line, in the
  middle of the pane and clear of its edges.
- **The menu's entries** continue on the next line, and the About page ends
  with space under its last text where it is longer than the window.
- **The tabs scroll** when their labels are wider than the window, without
  MUI's scroll buttons, which appeared with nothing to scroll, and the Run
  Demo button grows with its text. Both are from 2026-11-11.
- **For every text**, the last line is not left with a letter or a short word
  alone (`text-wrap: pretty`), no line starts with a small kana or a long
  vowel mark (`line-break: strict`), and a line of Japanese ends between two
  phrases (`word-break: auto-phrase`). They matter most in the languages
  that write no spaces between their words. A line of Korean, which does
  write them, ends between two words (`word-break: keep-all` for Korean): a
  browser ends it between any two letters otherwise. That is a rule of how
  the language is written, as the division of a word is, not a size or a
  place for one language. A browser that does not know one of these divides
  the text as it always did.

Two things were weighed and left:

- **The names' column of the table stays 130 pixels wide on a phone.** A wider
  one would keep more names on one line on the larger phones, but the values
  beside it need the rest: a date with a 12-hour clock fills the values'
  column at 320 pixels in a dozen languages, Japanese among them.
- **The tabs scroll, and do not take two lines.** A label of one long word
  (`Fotografija`) does not fit a third of a phone's width, and would be
  divided.

English and Japanese are laid out as they were: of their screenshots, four
differ, by a text drawn a pixel lower, and the two of the Settings page are
the ones from before this change. What differs for a reader of the two is how
some texts are divided into lines where they take more than one, on a phone
above all: a Japanese title of two lines in the dialog is
`対応していない / ファイル形式です`, where it was `…ファイル形式で / す`;
Japanese sentences end their lines between phrases; and the box of the
message in the map's place is 8 pixels wider. The
[results](./evidence/RESULTS.md#screenshots) list the screenshots that changed
and why.

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

- **The 40 translations**: no speaker has read them. The review was a
  machine's, as the translations were.
- **How a browser other than Chrome divides the texts.** The division of a
  word by the language's rules, the last line that is not left alone and the
  phrases of Japanese were looked at in Chrome on macOS. Chrome divides words
  in most of the languages, not in Bulgarian, Latvian, Lithuanian and Turkish.
  A browser that knows none of it shows every text whole all the same, on
  lines divided as before.
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
