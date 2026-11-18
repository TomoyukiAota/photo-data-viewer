# Layout of the Home page's panes: status

Started on 2026-11-18, on the branch `claude/pane-layout-mode-4500b2`, from
`main` at `76bd3b1`. See the [plan](./PLAN.md), the
[results](./evidence/RESULTS.md) and [the words chosen](./evidence/TERMS.md).

## Current state

Merged on 2026-11-18 as the button LAYOUT before the menu's button (#78).
On the same day the maintainer asked for the choice to be moved into the
menu, and for a language's button in its place: see
[In the menu](#in-the-menu-with-the-languages-button-in-its-place). On
2026-11-19 the maintainer had that button taken out of the header again:
see [Out of the header](#the-languages-button-out-of-the-header).

- **The menu's entry Layout** (`src/components/app-menu/LayoutSubmenu.tsx`),
  after the entry Language, with the icon of the split panes, opens a
  submenu of three modes: **Automatic** ("Split panes in a wide window, a
  single pane in a narrow one"), which is the default and today's
  behaviour, **Split panes** and **Single pane**. In Japanese, the
  maintainer's words: `自動`, `表示領域を分割する` and `表示領域を分割しない`.
- **The choice is a setting**, `LayoutMode` (`auto`, `splitPanes`,
  `singlePane`), kept in the browser as the other settings are
  (`src/utils/user-settings.ts`), and read by `useLayoutMode`
  (`src/hooks/useLayoutMode.ts`). `isWideLayout`, which the Home page, the
  map and the analytics use, is now whether the panes are split, as chosen
  or by the window's width.
- **The header stays when the layout changes** (`Home.tsx`): it was rendered
  inside each of the two layouts, and the focus in it was lost.
- **Split panes are kept at every width**: at 320 pixels each column is
  about 150 pixels, and the table scrolls sideways in its pane
  (`narrow-split-panes.png`).
- **In Photo Location Map** there is no menu, so no choice, and the layout is
  always the automatic one.
- **The usage data** records the setting as the others are, when the page is
  loaded and when it changes, and "App Layout" when a change of the mode
  changes the layout shown.
- **The texts are in all 42 languages**: the entry's name, `menu.layout`,
  and the modes', inside `"home"` (`home.layout`), as machine translation
  except Japanese's names of the modes; `docs/TRANSLATING.md` says what
  they are for.
- **The header has the menu's button alone**, as before #78. A language's
  button was in the button LAYOUT's place for a day, and was taken out.

## In the menu, with the language's button in its place

Asked by the maintainer on 2026-11-18, after #78: the choice of the layout
is an entry of the menu, beside About and the others, whose three modes are
a submenu without icons, and the entry has the icon of the split panes,
always. In the header, where the button LAYOUT was, is the language picker
of Photo Location Map's website.

- **The entry Layout** comes after Language: Settings, Language and Layout
  are the entries that set how the app is shown. It has an arrow towards
  its submenu, as a desktop's menu has. A click, Enter, Space or that arrow
  key opens the submenu with the focus on the chosen mode; the arrow back
  or Escape closes it alone, and gives the focus back to the entry.
- **The submenu** is beside the menu, towards the page, and under the entry
  in a phone's width, where the menu takes most of the window and the
  submenu would lie over its entry. Its modes have no icons; the chosen one
  has the check mark that the menu has at the page shown, as a radio item.
  Choosing a mode closes the menu once the submenu is closed, so that the
  focus goes back to the menu's button: closed together, the focus was lost.
- **The language's button** is the website's: a globe, the name of the
  language shown and an arrow, which opens a box under the button with a
  search field above the list of languages. Its sizes and colors are the
  website's, and its list is the Language page's (`LanguageList`, with a
  look of the box), so that it searches, moves and chooses as that one does.
  A choice is the Language page's, which `useLanguageChoice` now holds for
  both: on an address that names a language, the address of the language
  chosen opens. The box closes once the language is shown, and stays open to
  say that a language could not be fetched.
- **In a phone's width** the button shows the globe and the arrow alone: a
  name such as "Português (Brasil)" would leave the header's sentence a few
  dozen pixels at 320 pixels. The name is read aloud with the globe. The
  space before the button is 16 pixels, where it was 26 before the room for
  the menu's button, so that "Wybierz zdjęcie", the button under the Polish
  sentence, stays on one line at 320 pixels.
- **From the search field**, the down arrow goes into the list, and Enter
  chooses the first language found, as on the website and in Photo Location
  Map's dialog; on the Language page too.
- **The button is on the Home page alone**, in the header, where the button
  LAYOUT was. The other pages have the Language page in the menu.

## The language's button out of the header

Asked by the maintainer on 2026-11-19, while its height was being matched to
the menu's button beside it: the app follows the browser's language, so few
users choose another, and they choose it once. A setting chosen so seldom
belongs in the menu, not beside the header's sentence and its button, which
are what the Home page is for. The header has the menu's button alone again,
as it had before #78, and the language is chosen on the Language page, from
the menu's entry Language, whose globe a user who cannot read the language
shown still knows.

- **Taken out with the button**: `LanguagePicker` and its unit test, the
  look of its box in `LanguageList` (`look`, `.popup`), its browser test and
  `language-picker.png`.
- **Kept, as the Language page uses it**: `useLanguageChoice`, and the down
  arrow and Enter from the search field.
- **The header is as it was before #78** (`Header.tsx`, `Header.module.scss`
  and `Header.spec.tsx`): the room for the menu's button, 26 pixels after
  the texts. At 320 pixels the sentence takes fewer lines than with the
  button (two in English, where it took three), the button about drag and
  drop (#90) is beside Select Photo instead of under it, and everything
  under the header is higher by them.

## What was decided, and by whom

- The maintainer: the names of the modes, `Split panes`, `Single pane` and
  `Automatic`, and in Japanese `表示領域を分割する`, `表示領域を分割しない`
  and `自動`.
- The proposal, which the maintainer left as it was: the word Layout
  (`レイアウト`), the button with a menu before the menu's button, the
  automatic mode first in the menu with the description under it, split
  panes kept at every width, the automatic layout in Photo Location Map, and
  what the usage data records ([plan](./PLAN.md#decisions)).

## Resuming

Nothing is pending. A branch merged after this one that changes a
screenshot of the Home page makes that screenshot again, with the header
that has the menu's button alone. To change a name, change `home.layout` in
every file of `src/locales/`.
