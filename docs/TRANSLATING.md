# Translating this application

Photo Data Viewer can be shown in several languages. The translations are files
in this repository, so anyone with a GitHub account can add a language or
improve one through a pull request, from GitHub's web editor, without setting
anything up on their computer.

Most of the translations are machine translation that no speaker has reviewed
yet: see the table of [languages](#languages). Reviewing one, even a few texts
of it, is as welcome as adding a language.

## Where the texts are

| File                             | What it is                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/locales/en.json`            | English, the source. Every other file is a translation of it.                                        |
| `src/locales/<code>.json`        | One file per language, named by its language tag (`ja`, `de`, `pt-BR`), with the keys of `en.json`. |
| `src/i18n/languages.ts`          | The languages the app offers, in the order the Language page lists them.                             |

Each text has a key on the left and the text on the right:

```json
"home": {
  "selectPhoto": "Select Photo"
}
```

Translate the texts on the right. Never change the keys on the left: the code
finds the texts by them.

## Add a language

1. Fork the repository and open your fork in GitHub's web editor (press `.` on
   its page), or edit the files one at a time with the pencil button.
2. Create `src/locales/<code>.json`, where `<code>` is the language's tag:
   the language alone (`de`, `fr`, `ko`) unless a region or a script matters
   for the text (`pt-BR`, `zh-Hant`). Paste the content of `src/locales/en.json`
   into it and translate every text.
3. Add the language to the list in `src/i18n/languages.ts`, where its name
   comes: the names written in Latin letters are in the order of the alphabet,
   and the other scripts follow them. The check tells you when the place is not
   the right one. For German, say:

   ```ts
   {
     code: 'de',
     englishName: 'German',
     name: 'Deutsch',
     flag: 'de',
     direction: 'ltr',
     load: () => load(import('../locales/de.json'), import('dayjs/locale/de')),
   },
   ```

   - `name` is the language's name written in the language itself, with a
     capital letter where its script has them, as macOS lists languages
     (`Français`, `Norsk bokmål`), and `englishName` its name in English. The
     Language page lists the first. Its search finds the language by either,
     by its code, and by its name in the language the page is shown in, which
     the browser knows.
   - `flag` is the flag shown beside the name in the list, by its name in
     [flag-icons](https://flagicons.lipis.dev): the code of the language's
     country in lower case, which
     `new Intl.Locale('<code>').maximize().region` gives in a browser's
     console. A language of a region that has a flag of its own has that flag,
     as Catalan has Catalonia's (`es-ct`). Add the name to
     `$flag-icons-included-countries` in
     `src/components/language/LanguageList.module.scss` too, so that the app
     has the flag; a test checks it.
   - `direction` is `rtl` for a language written from right to left, as Arabic
     and Hebrew are, and `ltr` for any other.
   - `load` names your file and the language's dayjs locale, which has the days
     of the week and AM/PM for dates. The dayjs locales are listed at
     <https://github.com/iamkun/dayjs/tree/dev/src/locale>; most have the
     language's code, in lower case (`pt-br`, `zh-tw`).
4. Add the language to the table of [languages](#languages) below.
5. Open a pull request titled `Add <language> translation`. If you can, add a
   screenshot of the Home page and the Language page in your language; see
   [Checking how it looks](#checking-how-it-looks).

## Improve a translation

Edit the text in `src/locales/<code>.json` and open a pull request titled
`Improve <language> translation`, saying what was wrong. If you speak the
language and read the whole file, say so, and change its status in the table
of [languages](#languages) to reviewed.

## What the check verifies

A test in this repository, `src/locales/locales.spec.ts`, runs on every pull
request and on three operating systems. It tells you what is wrong before anyone
reviews the pull request:

- Every key in your file exists in `en.json`. A misspelled key, or a key for a
  text that no longer exists, fails.
- No text is empty. A text you cannot translate yet: delete its line, and the
  app shows the English text in its place. When the line was the last one in
  its group, also delete the comma at the end of the line before it; otherwise
  the file is no longer valid JSON, and the check fails at once. The test's
  output names the texts a language is still missing, without failing.
- The `{{placeholders}}` of a text are those of the English text. The app fills
  them in: `{{appName}}` is "Photo Data Viewer", `{{width}}` and `{{height}}`
  are the photo's size, `{{language}}` is the name of a language.
- The `<tags>` of a text are those of the English text. A tag pair such as
  `<settingsLink>Settings</settingsLink>` becomes a link around the text inside
  it, so keep the pair and translate the text inside. `<br/>` is a line break
  the English text has for wide screens; your translation may drop it or put it
  where your language breaks well.
- The names of a text are those of the English text, written the same: EXIF,
  exifr, GitHub, Google, iOS, Photo Location Map, Tomoyuki Aota, Twitter. An
  ending may follow a name (`GitHubissa`).
- `dateTime.weekdayPattern`, when the file has it, contains `ddd`.
- A character that is not drawn is written as an escape, so that whoever reads
  the file sees that it is there: `\u00a0` for a no-break space, `\u00ad` for a
  soft hyphen.
- Every file is listed in `src/i18n/languages.ts` with a name in the language
  and in English, and what a language loads there is its own file and a dayjs
  locale that exists. The list is in the order of the names.
- A language's flag is that of its country, and the list's styles include it.
  This is checked by a test of its own, `src/i18n/language-flags.spec.ts`,
  which `npm test -- language-flags` runs.

To run it on your computer, set the repository up as
[CONTRIBUTING.md](./CONTRIBUTING.md) says, then:

```bash
npm test -- locales
```

This check is the only one that covers every language. The tests that open the
app in a browser stay with English, Japanese and Arabic, so that they do not
take longer with every language.

## Writing the texts

- Names stay as they are: Photo Data Viewer, Photo Location Map, EXIF, GitHub,
  exifr.
- Google's products are written as Google names them in your language, with
  "Google" as it is: `Google マップ`, `Mapy Google`, and `Google Maps` where
  Google keeps the English name.
- The words that this app shares with
  [Photo Location Map](https://github.com/TomoyukiAota/photo-location-map) are
  the same in both: Language, Search, "No languages found", Settings, Close,
  Reload, the settings of the date and time, "location data", the profile
  links, and the words for a photo, a file and EXIF data. Its translations are
  in `src-shared/i18n/locales/<code>.json` of its repository. When you change
  such a word here, look there, and say in the pull request when the two now
  differ.
- `menu.language`, the menu's entry for the Language page, keeps the English
  word in parentheses, as in `言語 (Language)`, so that someone who cannot
  read the current language still finds where to change it. The page's title,
  `language.title`, is the word alone.
- `language.useBrowserSetting` is the first entry of the list on the Language
  page: the choice to follow the language that the browser is set to.
  `{{language}}` is the name of that language, such as `English`. It parallels
  "Use system setting" in Photo Location Map.
- A `{{placeholder}}` is written plainly in a language written from right to
  left as well. The app keeps what it puts there together by itself (between
  two characters that are not drawn, U+2068 and U+2069), so that a number or an
  English name is read in its own order.
- For the words that every application has (Settings, Search, Close, Reload),
  use the words that Windows and macOS use in your language.
- Texts in the table of the Home page are shown in a column 130 pixels wide
  on phones ("File Name", "Width x Height", "Date Taken", ...). A name that is
  wider continues on a second line, between two words. A single long word is
  broken wherever the column ends, unless you mark where it may be broken with
  a soft hyphen, written `\u00ad`: `Aufnahme\u00addatum`.
- `photoData.general.latitude` and `photoData.general.longitude` are one row of
  the table, on two lines beside the two numbers. Keep each to one line of that
  column, with an abbreviation if your language needs one
  (`Szer. geogr.`), so that each name stays beside its number.
- `settings.dateTime.clockSystem` is the label of a narrow field, and is cut
  after about 14 letters: `12/24 Stunden` rather than `12 oder 24 Stunden`.
- The tabs scroll when their labels are wider than the window, so a label need
  not be shortened for them.
- The days of the week and AM/PM in dates come from dayjs' locale, not from
  the file. The digits of a date are 0 to 9 in every language, as its other
  numbers are. One value in the file is not a text but a dayjs pattern:
  `dateTime.weekdayPattern`, how a date writes the day of the week. `ddd` is
  its short name (Mon, 月); Japanese writes `(ddd)`, shown as `(月)`. Keep
  `ddd` and change only what is around it, or leave the key out when your
  language writes the day of the week plainly. Letters would be read as a
  pattern too, so a word goes in square brackets: `[le] ddd`.
- English is written in the second person, plainly, without exclamation marks.
  Follow the register that an application's settings page has in your language.
- The About page says what the application collects (`about.usageData`).
  Translate it faithfully: it is what a user is told about their data.
- Machine translation can give a first draft, but a wrong text is worse than an
  English one for the people it is for. Say in the pull request whether the
  translation was reviewed by a speaker of the language; until it is, it is
  marked so in the table below.

## Checking how it looks

With the repository set up ([CONTRIBUTING.md](./CONTRIBUTING.md)), `npm run dev`
starts the app at <http://localhost:3000>; choose your language on the Language
page, which the menu opens. Check the Home page with a photo loaded at a narrow
width (320 and 375 pixels, in the browser's device toolbar) and at a wide one,
the Settings page and the About page.

In a language written from right to left, the page is laid out from the right:
the menu is at the top left, and the names of the table are to the right of
their values. A photo's data, such as its file name and its numbers, keeps its
own direction. The photo and the map stay on the left, and the data on the
right.

## How the language is chosen

- In a browser: the list on the Language page, whose choice is saved in the
  browser. Its first entry, "Use browser setting", is the default: it follows
  the browser's preferred languages (`navigator.languages`), the most preferred
  first, and the first that has a translation wins. English is shown when none
  has.
- A language tag is matched as it is (`pt-BR`), then without its last part
  (`en-GB` is `en`, `zh-Hant-TW` is `zh-Hant`), then as a language that the list
  has under another code: `zh-TW`, `zh-HK` and `zh-MO` are `zh-Hant`, and any
  other Chinese is `zh-Hans`; `pt` alone is `pt-BR`, and another region is
  `pt-PT`; `no` and `nn` are `nb`; `sr` is `sr-Latn`
  (`src/i18n/resolve-language.ts`).
- Inside Photo Location Map: the language Photo Location Map passes in the
  address, matched the same way, or English.

The texts of a language are fetched when the language is first shown, so a
visitor downloads the language they read and not all of them. English is part
of the application itself, as the source and as what is shown for a text that a
language does not have.

## Languages

The languages are those that Windows and macOS are localized in, in the order
of the list on the Language page. "Machine translation" means that the texts
were written by a machine and that no speaker of the language has reviewed
them yet.

| Name in the language   | Code      | Language              | Status                                |
| ---------------------- | --------- | --------------------- | ------------------------------------- |
| Bahasa Indonesia       | `id`      | Indonesian            | Machine translation, not reviewed yet |
| Bahasa Melayu          | `ms`      | Malay                 | Machine translation, not reviewed yet |
| Català                 | `ca`      | Catalan               | Machine translation, not reviewed yet |
| Čeština                | `cs`      | Czech                 | Machine translation, not reviewed yet |
| Dansk                  | `da`      | Danish                | Machine translation, not reviewed yet |
| Deutsch                | `de`      | German                | Machine translation, not reviewed yet |
| Eesti                  | `et`      | Estonian              | Machine translation, not reviewed yet |
| English                | `en`      | English               | The source                            |
| Español                | `es`      | Spanish               | Machine translation, not reviewed yet |
| Euskara                | `eu`      | Basque                | Machine translation, not reviewed yet |
| Français               | `fr`      | French                | Machine translation, not reviewed yet |
| Galego                 | `gl`      | Galician              | Machine translation, not reviewed yet |
| Hrvatski               | `hr`      | Croatian              | Machine translation, not reviewed yet |
| Italiano               | `it`      | Italian               | Machine translation, not reviewed yet |
| Latviešu               | `lv`      | Latvian               | Machine translation, not reviewed yet |
| Lietuvių               | `lt`      | Lithuanian            | Machine translation, not reviewed yet |
| Magyar                 | `hu`      | Hungarian             | Machine translation, not reviewed yet |
| Nederlands             | `nl`      | Dutch                 | Machine translation, not reviewed yet |
| Norsk bokmål           | `nb`      | Norwegian Bokmål      | Machine translation, not reviewed yet |
| Polski                 | `pl`      | Polish                | Machine translation, not reviewed yet |
| Português (Brasil)     | `pt-BR`   | Portuguese (Brazil)   | Machine translation, not reviewed yet |
| Português (Portugal)   | `pt-PT`   | Portuguese (Portugal) | Machine translation, not reviewed yet |
| Română                 | `ro`      | Romanian              | Machine translation, not reviewed yet |
| Slovenčina             | `sk`      | Slovak                | Machine translation, not reviewed yet |
| Slovenščina            | `sl`      | Slovenian             | Machine translation, not reviewed yet |
| Srpski (latinica)      | `sr-Latn` | Serbian (Latin)       | Machine translation, not reviewed yet |
| Suomi                  | `fi`      | Finnish               | Machine translation, not reviewed yet |
| Svenska                | `sv`      | Swedish               | Machine translation, not reviewed yet |
| Tiếng Việt             | `vi`      | Vietnamese            | Machine translation, not reviewed yet |
| Türkçe                 | `tr`      | Turkish               | Machine translation, not reviewed yet |
| Ελληνικά               | `el`      | Greek                 | Machine translation, not reviewed yet |
| Български              | `bg`      | Bulgarian             | Machine translation, not reviewed yet |
| Русский                | `ru`      | Russian               | Machine translation, not reviewed yet |
| Українська             | `uk`      | Ukrainian             | Machine translation, not reviewed yet |
| עברית                  | `he`      | Hebrew                | Machine translation, not reviewed yet |
| العربية                | `ar`      | Arabic                | Machine translation, not reviewed yet |
| हिन्दी                 | `hi`      | Hindi                 | Machine translation, not reviewed yet |
| ไทย                    | `th`      | Thai                  | Machine translation, not reviewed yet |
| 한국어                    | `ko`      | Korean                | Machine translation, not reviewed yet |
| 日本語                    | `ja`      | Japanese              | Reviewed by the maintainer, except the texts of the Language page |
| 简体中文                   | `zh-Hans` | Chinese (Simplified)  | Machine translation, not reviewed yet |
| 繁體中文                   | `zh-Hant` | Chinese (Traditional) | Machine translation, not reviewed yet |

When a language is added, add it here with who reviewed it, or "Machine
translation, not reviewed yet" until a speaker has.
