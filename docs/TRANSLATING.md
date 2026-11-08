# Translating this application

Photo Data Viewer can be shown in several languages. The translations are files
in this repository, so anyone with a GitHub account can add a language or
improve one through a pull request, from GitHub's web editor, without setting
anything up on their computer.

## Where the texts are

| File                             | What it is                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/locales/en.json`            | English, the source. Every other file is a translation of it.                                        |
| `src/locales/<code>.json`        | One file per language, named by its language tag (`ja`, `de`, `pt-BR`), with the keys of `en.json`. |
| `src/i18n/languages.ts`          | The languages the app offers, in the order the Settings page lists them.                             |

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
   the language alone (`de`, `fr`, `ko`) unless a region matters for the text
   (`pt-BR`, `zh-Hant`). Paste the content of `src/locales/en.json` into it and
   translate every text.
3. Add the language to `src/i18n/languages.ts`, next to the others: its code,
   its name in the language itself (`日本語`, `Deutsch`), the dayjs locale that
   has its days of the week, and the import of its file. The dayjs locales are
   listed at <https://github.com/iamkun/dayjs/tree/dev/src/locale>; most have
   the language's code, in lower case (`pt-br`, `zh-tw`).
4. Open a pull request titled `Add <language> translation`. If you can, add a
   screenshot of the Home page and the Settings page in your language; see
   [Checking how it looks](#checking-how-it-looks).

## Improve a translation

Edit the text in `src/locales/<code>.json` and open a pull request titled
`Improve <language> translation`, saying what was wrong.

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
- Every file is listed in `src/i18n/languages.ts`.

To run it on your computer, set the repository up as
[CONTRIBUTING.md](./CONTRIBUTING.md) says, then:

```bash
npm test -- locales
```

## Writing the texts

- Names stay as they are: Photo Data Viewer, Photo Location Map, EXIF, GitHub,
  exifr, Google Maps, Google Street View.
- Texts in the table of the Home page are shown in a column 130 pixels wide
  on phones ("File Name", "Width x Height", "Date Taken", ...). A long
  translation is cut off there; prefer a short one.
- The days of the week and AM/PM in dates come from dayjs' locale, not from
  the file.
- English is written in the second person, plainly, without exclamation marks.
  Follow the register that an application's settings page has in your language.
- Machine translation can give a first draft, but a wrong text is worse than an
  English one for the people it is for. Say in the pull request whether the
  translation was reviewed by a speaker of the language; until it is, it is
  marked so in the table below.

## Checking how it looks

With the repository set up ([CONTRIBUTING.md](./CONTRIBUTING.md)), `npm run dev`
starts the app at <http://localhost:3000>; choose your language on the Settings
page. Check the Home page with a photo loaded at a narrow width (320 pixels, in
the browser's device toolbar) and at a wide one, and the About page.

## How the language is chosen

- In a browser: the Language setting on the Settings page, which is saved in
  the browser. Its default, "Browser's language", follows the browser's
  preferred languages (`navigator.languages`): each is tried as it is (`pt-BR`)
  and then as its language alone (`pt`), and the first that has a translation
  wins. English is shown when none has.
- Inside Photo Location Map: the language Photo Location Map passes in the
  address, or English.

## Languages

| Code | Language | Status                                                     |
| ---- | -------- | ---------------------------------------------------------- |
| `en` | English  | The source.                                                |
| `ja` | 日本語   | Complete; written with the first version of the translations. |

When a language is added, add it here with who reviewed it, or "machine
translation, not reviewed yet" until a speaker has.
