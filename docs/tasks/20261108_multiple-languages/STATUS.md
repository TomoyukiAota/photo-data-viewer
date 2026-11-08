# Multiple languages: status

Started on 2026-11-08. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

All three stages of the plan are implemented and verified locally
(2026-11-08), and are in one pull request from the branch
`claude/multi-language-support-investigation-285e41`: the stages were meant as
three pull requests, but were implemented together, and the maintainer chose
one.

- The texts live in `src/locales/en.json` (the source) and `src/locales/ja.json`;
  the components show them through i18next and react-i18next
  (`src/i18n/`). The keys are type-checked.
- The Settings page has a Language select. Its default, "Browser's language",
  follows `navigator.languages`; the choice is saved as `Language` with the other
  settings and recorded with them. Changing it switches the texts, the days of
  the week and the page's `lang`, and loads the photo again for its dates.
- Embedded in Photo Location Map, the app follows a `language` parameter in the
  address and is English otherwise (checked in Electron on a Japanese machine).
- `docs/TRANSLATING.md` tells contributors how to add or improve a language from
  GitHub's web editor; `README.md`, `docs/CONTRIBUTING.md` and the About page
  link to it. A unit test checks every translation file.

## Decisions taken on the way

The maintainer asked for the work to go ahead; these were decided while doing
it, and are worth a second look:

- i18next with react-i18next (plan, decision 1).
- The browser's language only; the country from Vercel's request header is left
  for later (decision 2).
- English inside Photo Location Map until it passes a `language` parameter
  (decision 3).
- Translations as files in this repository, checked by a unit test; a hosted
  platform only if contributors ask (decision 4). A text not translated yet may
  be left out of a language's file and is shown in English; the test names such
  texts without failing.
- Japanese as the first translation, written during this work (decision 5):
  the wording in `src/locales/ja.json` has not been reviewed by anyone else.
- The About page keeps its line breaks as `<br/>` inside the English texts, so
  that stage 1 changed nothing visible.
- The About page gained a line inviting translations, and the Settings page a
  Language section above Date & Time Format; the `about` and `settings`
  screenshots were updated for them, and three Japanese screenshots added.
- The menu icon's text stays "MENU" in Japanese, as "メニュー" does not fit
  under the icon.

## Resuming

Nothing is left to implement in this repository. What remains is the
maintainer's:

- Review the Japanese texts and the decisions above in the pull request.
- Photo Location Map: a language setting of its own, passed as `language` in the
  address (its repository).
- Optional: a GitHub label for translation pull requests; the guide asks for the
  title `Add <language> translation` or `Improve <language> translation`.
