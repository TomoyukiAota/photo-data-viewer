# Layout of the Home page's panes: status

Started on 2026-11-18, on the branch `claude/pane-layout-mode-4500b2`, from
`main` at `76bd3b1`. See the [plan](./PLAN.md), the
[results](./evidence/RESULTS.md) and [the words chosen](./evidence/TERMS.md).

## Current state

Implemented and checked locally. On 2026-11-18 the maintainer chose the
names of the modes, left the rest to the proposal, and asked for it to be
merged.

- **A button LAYOUT before the MENU button** in the Home page's header
  (`src/components/home/LayoutMenu.tsx`), made as the menu's button is, with
  the chosen mode's icon. It opens a menu of three modes: **Automatic**
  ("Split panes in a wide window, a single pane in a narrow one"), which is
  the default and today's behaviour, **Split panes** and **Single pane**. In
  Japanese, the maintainer's words: `自動`, `表示領域を分割する` and
  `表示領域を分割しない`.
- **The choice is a setting**, `LayoutMode` (`auto`, `splitPanes`,
  `singlePane`), kept in the browser as the other settings are
  (`src/utils/user-settings.ts`), and read by `useLayoutMode`
  (`src/hooks/useLayoutMode.ts`). `isWideLayout`, which the Home page, the
  map and the analytics use, is now whether the panes are split, as chosen
  or by the window's width.
- **The header stays when the layout changes** (`Home.tsx`): it was rendered
  inside each of the two layouts, and the focus on the button was lost.
- **Split panes are kept at every width**: at 320 pixels each column is
  about 150 pixels, and the table scrolls sideways in its pane
  (`narrow-split-panes.png`).
- **In Photo Location Map** there is no header, so no button, and the layout
  is always the automatic one.
- **The usage data** records the setting as the others are, when the page is
  loaded and when it changes, and "App Layout" when a change of the mode
  changes the layout shown.
- **The six texts are in all 42 languages**, inside `"home"`
  (`home.layout`), as machine translation except Japanese's names of the
  modes; `docs/TRANSLATING.md` says what they are for.
- **The menu's button's face** is shared by the two buttons
  (`HeaderButtonFace` in `src/components/app-menu/AppMenu.tsx`).

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
screenshot of the Home page makes that screenshot again, with the header's
new button. To change a name, change `home.layout` in every file of
`src/locales/`.
