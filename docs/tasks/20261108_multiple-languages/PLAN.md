# Multiple languages: plan

This plan is written so that the work can be stopped and picked up at any point.
[`STATUS.md`](./STATUS.md) says how far it has got; the checklists under
[the stages](#the-work-in-three-stages) say which steps are done.

## Goal

Let users read the app in their own language. The language follows the browser
by default, can be changed in Settings, and is remembered. Anyone with a GitHub
account can add or improve a translation through a pull request, and a check in
CI tells them what is wrong before anyone reviews it.

## What was asked

- Users switch to their preferred language.
- The default comes from the browser's language setting and from the user's
  location.
- GitHub users can contribute translations.

The location part is weighed below ([where the language comes from](#2-where-the-language-comes-from)).

## What the app is like today

This was found by reading the code on 2026-11-08, at `main` `1ff7a50`.

- **Every text is English, written in the components.** About 75 strings in
  about 22 files, most of them short. The About page holds the bulk of the prose.
  No library formats text or dates for a language.

  | Where                          | Strings                                                                                     |
  | ------------------------------ | ------------------------------------------------------------------------------------------- |
  | Menu, tabs, page titles        | Home, Demo, Settings, About, MENU; Data, Map, Photo; General, Details, Raw Data; "… - Photo Data Viewer" |
  | Home                           | "Select your photo to display EXIF data.", Select Photo, the photo pane's and the map's messages |
  | Data table                     | Name, Value, No data, Not Available, Loading…, File Name, File Size, Width x Height, Date Taken, Latitude, Longitude, the iOS note, the Raw Data note |
  | Dialogs and errors             | Unsupported File Format, "EXIF data is not available.", Close, "Something went wrong…", Reload, "The map cannot be shown." |
  | Settings                       | The headings, the two select labels, Example, the usage-data switch and its note; the values 12-hour and 24-hour |
  | Demo, About                    | Two paragraphs on Demo; six paragraphs and four icon labels on About |
  | Hidden text                    | `alt` and `title` of the icons (Rotate photo, Show in Google Maps, …), `aria-label` of the menu |

- **Nothing is rendered until the page is mounted in the browser.** `_app.tsx`
  returns an empty tree on the server and on the first hydration render, so the
  language can be decided in the browser without any hydration mismatch, and
  nothing needs translating on the server. Next.js' own i18n routing
  (`i18n` in `next.config.js`) is therefore not needed. It would also put the
  language in the address (`/ja/settings`), which GA4 records as the page path
  (`_document.tsx`, `ga4-page.ts`), and which Photo Location Map does not expect.
- **Two deployments.** Standalone in browsers, and embedded in Photo Location
  Map's Electron window. Embedded, the menu and the header are hidden, so the
  user cannot reach Settings; Photo Location Map passes its settings in the
  address instead (`dateFormat`, `clockSystemFormat`; read by
  `src/app-integration/plm-settings.ts`). Photo Location Map itself has the
  Angular translation library wired up with a single English key and no language
  setting, so there is no language to pass yet.
- **The analytics already record the browser's language** (`language` and
  `languages` in the Page Loaded event, `src/analytics/track-event.ts`). They
  show which languages visitors have, and so which translations matter first.
- **Some English words are identifiers as well as labels.** They must keep their
  value and get a translated label beside it:
  - the tab names (`TabName` in `PhotoData.tsx` and `HomeNarrowLayout.tsx`) are
    the tabs' `value` as well as their label;
  - `12-hour` and `24-hour` are stored in localStorage, passed by Photo Location
    Map, and shown in the select;
  - the page titles in `page-title-default-value.ts` are what GA4 records as the
    page title (`GA4_PAGE_TITLES` in `ga4-page.ts`), and `_document.tsx` writes
    them into the page at build time; GA4 never reads `document.title`, so the
    title the browser shows can be translated;
  - the descriptions passed to `trackOpenUrl` ("Show in Google Maps",
    "About Page") are analytics fields, not text on the page;
  - the EXIF field names in the Details and Raw Data tabs are exifr's, and stay as
    they are.
- **Date and size text is made when the photo loads**, not when it is shown:
  `DateTimeOriginal`, `LastModified` and `FileSize` keep a `displayString`, and
  `formatDate` reads the format settings from localStorage. Changing the date
  format calls `photoCtx.reloadPhoto()` to remake them; changing the language
  does the same. The day of the week (`ddd`) comes from dayjs, whose locale
  must be set to the language (`import 'dayjs/locale/ja'`, `dayjs.locale('ja')`).
- **Two places need care.** `PageNotShown` uses no React context on purpose, as
  the providers may be what failed; it reads the translation from the library's
  instance, not from a provider. `PhotoImage` wrote "Unsupported File Format"
  into the DOM as HTML (`outerHTML`); it renders the text through React instead.
- **Narrow layouts have fixed sizes.** The name column is 130 px under 600 px
  wide, the header pane is 130 px high, and the font shrinks under 340 px. Longer
  translations (German, Russian, French) can overflow or wrap; Japanese is
  shorter. The visual comparison covers English only until a Japanese
  screenshot is added.
- **Fonts and `lang`.** Roboto covers Latin, Cyrillic and Greek; Japanese and
  Chinese fall back to the system's fonts. Browsers choose the glyphs for those
  by the `lang` attribute, so `document.documentElement.lang` must follow the
  language. `_document.tsx` gives `<html>` `lang="en"`, and the browser changes
  it when the language is applied.

## Decisions

The maintainer asked for the work to go ahead on these decisions, which were
taken from the investigation; [`STATUS.md`](./STATUS.md) lists the ones worth a
second look.

### 1. Library: i18next with react-i18next

i18next 27.0.1 (15 kB gzipped, no dependencies, Node 22+, TypeScript 5 to 7)
and react-i18next 18.0.0 (10 kB gzipped, React 18+). Why:

- Its documented setup is what this app needs: initialize in the browser, bundle
  the JSON resources, `useTranslation()` in components, `Trans` for text with
  links. It assumes nothing about routing or server rendering.
- Keys are type-checked by `tsc`, which CI runs: declare the English JSON as the
  `resources` of `CustomTypeOptions`, and a missing or misspelled key fails
  `npm run typecheck`. `resolveJsonModule` and `strict` are already on. Since
  27.0, the types also require the `{{placeholders}}` of a text to be passed.
- The i18next JSON format is what every translation platform imports (Crowdin,
  Weblate, Tolgee, Fink), so starting with files in the repository closes no door.
- Since 27.0.0, an empty string in a translation falls back to the fallback
  language (`returnEmptyString: false`), and so does a missing key
  (`fallbackLng: 'en'`, which must be set, as the default became `false`).

Both packages had a major release shortly before this plan. If either
misbehaves, i18next 26.x with react-i18next 17.1.x has the same API for what
this app uses.

Considered and not chosen:

| Library                         | Why not                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| next-i18next 16.x               | Requires Next.js' i18n routing and `serverSideTranslations` in every page: the address changes, and the server renders nothing here anyway.         |
| next-intl 4.x (Pages Router)    | Its documented Pages Router setup also goes through Next.js' i18n routing and `getStaticProps`. A client-only setup is possible but undocumented.   |
| react-intl 12.x                 | Works, but larger, and ICU message syntax is more for contributors to learn than this app's plain strings need.                                      |
| Lingui 6.x                      | Extracts and compiles messages through an SWC plugin, whose version must match the SWC inside Next.js (or a Babel config, which turns Next.js' SWC compiler off): a moving part the documented-setup rule argues against. |
| Paraglide (inlang) 3.x          | Compiles messages to functions, with an editor (Fink) that opens pull requests. A small community and two major versions since 2025; keep in mind for later. |
| Hand-written context and JSON   | Possible for 75 strings, but gives no `Trans` for text with links, no typed keys without more code, and no format other platforms import.           |

Language detection stays in this repository's own code rather than
`i18next-browser-languagedetector`: it is a few lines over `navigator.languages`,
and the saved language belongs with the other settings (`UserSettingKey`,
`useUserSettings`, the Settings page), not in the detector's own `i18nextLng`
key and cookie.

### 2. Where the language comes from

Standalone, in this order, the first that gives a supported language wins:

1. the saved setting, `UserSettingKey.Language` (`Language` in localStorage),
   unless it is `auto`, the default;
2. `navigator.languages`, each entry matched exactly (`pt-BR`) and then by its
   language alone (`pt`);
3. English.

The Settings page gets a Language select whose first item is the browser's
language (the default, stored as `auto`, shown with the language it resolves
to), followed by each language under its own name ("日本語", "Deutsch"), so
that a user who cannot read the current language still finds theirs. Changing
it is recorded with `trackChangedUserSetting`, like the other settings, and the
setting is recorded with the others when the page loads.

The language is decided when the app's code loads in the browser, before
anything is rendered, so that nothing is painted in one language and then
another. When the setting changes, the Settings page applies the new language
(`i18n.changeLanguage`, `dayjs.locale`, `<html lang>`) and reloads the photo so
that the date and size texts are remade.

**Location.** The country of the visitor's IP address is available on Vercel as
the request header `x-vercel-ip-country`, which a `proxy.ts` (Next.js 16's name
for middleware, Node.js runtime by default) or an API route can read and hand to
the browser as a cookie. It is not available in `next dev` or in the tests. It
is not in the first version, because:

- the browser's language is the user's own statement of preference, while the
  country is a guess about it; a traveller, an expatriate, a VPN or a
  multilingual country (Switzerland, Belgium, Canada, India) makes the guess
  wrong, and no mapping from country to language is agreed on;
- it adds a server function on every page view to an app that has none, and
  that function runs for Photo Location Map's requests too, where the language is
  Photo Location Map's to decide;
- Next.js and the libraries above all detect by browser language only.

The analytics' `language` field can show later whether visitors arrive with a
browser language the app has no translation for; if many do, the country can be
added as a tiebreaker for that case only.

### 3. In Photo Location Map

Embedded, the app follows the `language` parameter in the address when Photo
Location Map passes one, and is English otherwise, as Photo Location Map's own
window is. The saved setting and `navigator.languages` are not consulted there:
following Electron's language would show the EXIF data in the operating
system's language inside an English window, and would make the Electron test
depend on the language of the machine it runs on.

Photo Location Map gets a language setting of its own in its repository, and
passes it like the date format. That work is separate.

### 4. Translations live in this repository

One JSON file per language under `src/locales/` (`en.json`, `ja.json`, …),
keyed by page and component (`settings.title`, `home.selectPhoto`), with
English as the source. A contributor adds a language by copying `en.json`,
translating the values, and adding the language to the list in
`src/i18n/languages.ts`, all of which GitHub's web editor can do in a fork
without any local setup.

A unit test keeps the files honest, so that a pull request shows what is wrong
before review: every key in a file exists in `en.json` (no misspelled or
obsolete keys), no value is empty, every value has the same `{{placeholders}}`
and `<tags>` as the English one, and every file is listed in
`src/i18n/languages.ts`. A key that is not translated yet may be left out: the
app shows English for it, and the test names the missing keys in its output
without failing, so that a new English text does not block every other language.
CI runs the test on three operating systems already.

Text with links or line breaks is one string with tags (`<settingsLink>…</settingsLink>`,
`<br/>`), rendered with `Trans`. The About page keeps its line breaks as
`<br/>` inside the English strings, so that the page looks as it did; other
languages may drop or move them.

A hosted translation platform (Crowdin and Weblate host open-source projects
for free; Tolgee has a free tier; inlang's Fink edits the repository's files in
the browser and opens the pull request) gives translators context, suggestions
and a glossary. It is not needed for 75 strings and one maintainer; if
contributors ask for one, the JSON files are what it would import.

Machine translation can seed a language, but a wrong translation is worse than
English for the people it is for. If a language is seeded that way, the
translating guide says so in its table, and the pull request that reviews it
removes the note.

### 5. First languages

English stays the source. Japanese comes first, as the maintainer can check it,
and it exercises what English does not: fonts, `lang`, the dayjs locale and the
narrow layout with shorter text. The analytics' `language` field decides what
comes next.

### 6. Out of scope for now

- Right-to-left languages. MUI supports them with a theme direction and a style
  plugin, but the split panes and the table need their own checks. Add them when
  a translation asks for it.
- The EXIF field names in the Details and Raw Data tabs, the OpenStreetMap
  attribution, and the `meta description` the server renders.
- The language in the address for the standalone app (`/ja/...`), and so
  language-specific search results. The pages are a tool, not content.
- Formatting numbers for the language. Coordinates keep six decimals with a
  point; file sizes keep `filesize`'s units.

## The work, in three stages

Each stage is meant to be one pull request, and each leaves the app working.
The checkboxes are updated as the steps are done; `STATUS.md` names the stage
in progress. To resume, read `STATUS.md`, then start at the first unchecked
step. Every step is checked by `npm run test:all`; the end of each stage is
checked as [Verification](#verification) says.

### Stage 1: the texts move out of the components

No visible change: the reference screenshots and the browser suite pass
unchanged, which is the check that nothing was lost.

- [x] Add `i18next` and `react-i18next` to `dependencies`, with exact versions.
- [x] `src/locales/en.json`: every text of the table above, keyed by page and
      component (`menu.*`, `pageTitle.*`, `home.*`, `photo.*`, `map.*`,
      `photoData.*`, `unsupportedFileDialog.*`, `pageNotShown.*`, `demo.*`,
      `settings.*`, `about.*`). Texts with links or line breaks use tags.
- [x] `src/i18n/languages.ts`: the list of languages (code, own name, dayjs
      locale, translation), English only for now, and the `resources` built
      from it.
- [x] `src/i18n/i18n.ts`: initializes i18next once with `initReactI18next`,
      the resources, `lng` and `fallbackLng` `'en'`, `interpolation.escapeValue:
      false` (React escapes) and `interpolation.defaultVariables.appName`, so
      that `{{appName}}` is available in every text. `_app.tsx` imports it first.
- [x] `src/i18n/i18next.d.ts`: `CustomTypeOptions` with `resources` as
      `typeof en` and `defaultVariables`, so that keys and placeholders are
      type-checked.
- [x] `useTranslation()` in every component listed in the table; `Trans` for
      texts with links or `<br/>`; the tabs keep their `value` and translate
      their `label`; the clock formats get a label map beside their stored
      values; the pages translate the `<title>` while `pageTitleDefaultValue`
      stays English for GA4 and `_document.tsx`; the analytics descriptions are
      untouched.
- [x] `PageNotShown` reads `i18n.t(...)` from the instance. `PhotoImage`
      renders "Unsupported File Format" through React, with a test.
- [x] `_document.tsx`: `<Html lang='en'>`.
- [x] Jest: `jest.setup.ts` (`setupFilesAfterEnv`, as the Next.js Jest guide
      sets it up) imports `src/i18n/i18n.ts`, so that component tests keep
      asserting English. The parity test of decision 4 in
      `src/locales/locales.spec.ts`, which covers each file under `src/locales/`.
- [x] Checks: `npm run test:all`, `npm run build`, `npm run build:plm`,
      `npm run test:e2e`, and `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e` with
      every screenshot unchanged.

### Stage 2: the language can be chosen, and Japanese

- [x] `UserSettingKey.Language` with the default `auto`, in `useUserSettings`
      (read, stored on first load, recorded with the other settings) and in
      `initializeUserSettingsIfNeeded`; its tests updated.
- [x] `src/i18n/resolve-language.ts`: `resolveLanguage()` applies the order of
      decisions 2 and 3 (embedded: the `language` parameter or English;
      standalone: the setting, then `navigator.languages`, then English), with
      unit tests for each source and for `pt-BR` → `pt` → English.
- [x] `src/i18n/i18n.ts` initializes with the resolved language, and
      `applyLanguage()` changes it: `i18n.changeLanguage`, `dayjs.locale`,
      `document.documentElement.lang`.
- [x] The Language select on the Settings page, as in decision 2, first among
      the settings; changing it applies the language and reloads the photo.
- [x] `src/locales/ja.json`, and `dayjs/locale/ja`, listed in `languages.ts`.
- [x] Browser test with a `ja-JP` context: Japanese on Home and in the photo's
      data (the day of the week), Settings in Japanese, switch to English in
      Settings, reload and keep it; the `settings` screenshot updated for the
      new section, and Japanese screenshots of the narrow layout at 320 px with a
      photo loaded, of Settings and of About added.
- [x] Electron test: English without a `language` parameter, as before, and
      Japanese with `language=ja`.
- [x] Checks: as stage 1, with the new and updated screenshots explained in
      `evidence/RESULTS.md`.

### Stage 3: contributors can find the way

- [x] `docs/TRANSLATING.md`: how to add a language or fix a translation from the
      GitHub web editor, what the test checks and how to run it, how the
      language is chosen at run time, the table of languages and who reviewed
      them, and that English is the source. `README.md` and
      `docs/CONTRIBUTING.md` link to it.
- [x] The About page gets a line inviting translations, linking to the guide;
      the `about` screenshots are updated for it.
- [x] A way to tell translation pull requests apart (a title convention in the
      guide; a label or template is the maintainer's call).
- [x] `evidence/RESULTS.md` with the checks of all three stages.

## What must not change

- Everything in English: the reference screenshots, the browser suite and the
  Electron suite pass as they are, apart from the screenshots whose change is
  explained (Settings gains a section in stage 2, About a line in stage 3). The
  browser suite runs with the `en-US` locale, which the detection honors.
- What is stored: the existing keys and their string values, and `12-hour` and
  `24-hour` as stored and as Photo Location Map passes them. The new key is
  `Language`, with `auto` or a language code.
- What the analytics record: the English page titles, the English descriptions
  of opened addresses, and the settings' keys and values. The new setting is
  recorded like the others.
- Nothing of the user's is sent anywhere new; the language is kept in
  localStorage with the other settings.
- The documented setup: no npm `overrides`, custom environments or patches.

## Verification

`npm run test:all` (lint, types, unit tests, including the parity test),
`npm run build`, `npm run build:plm`, `npm run test:e2e` with
`PDV_CHROME=1 PDV_VISUAL=1` on macOS for the screenshots,
`PDV_DEV=1 npm run test:e2e`, and `npm run test:electron` with Electron 32.0.2.
A clean `npm ci` prints only the three known deprecation warnings. The results
go in `evidence/RESULTS.md`.

## Later, if wanted

- Photo Location Map passes `language`, once it has the setting.
- The country as a tiebreaker (decision 2), through `proxy.ts` and
  `x-vercel-ip-country`, only when the browser language has no translation.
- A hosted translation platform, importing `src/locales/*.json`.
- Loading each language's file on demand with `import()`, when the bundle grows.
