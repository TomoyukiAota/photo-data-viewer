# Layout of the Home page's panes: status

Started on 2026-11-18, on the branch `claude/pane-layout-mode-4500b2`, from
`main` at `76bd3b1`. See the [plan](./PLAN.md), the
[results](./evidence/RESULTS.md) and [the words chosen](./evidence/TERMS.md).

## Current state

Implemented and checked locally; not pushed. The names, the control's form
and the decisions below are proposals for the maintainer to confirm.

- **A button LAYOUT before the MENU button** in the Home page's header
  (`src/components/home/LayoutMenu.tsx`), made as the menu's button is, with
  the chosen mode's icon. It opens a menu of three modes: **Automatic**
  ("Side by side in a wide window, tabs in a narrow one"), which is the
  default and today's behaviour, **Side by side** and **Tabs**.
- **The choice is a setting**, `LayoutMode` (`auto`, `sideBySide`, `tabs`),
  kept in the browser as the other settings are
  (`src/utils/user-settings.ts`), and read by `useLayoutMode`
  (`src/hooks/useLayoutMode.ts`). `isWideLayout`, which the Home page, the
  map and the analytics use, is now whether the panes are side by side, as
  chosen or by the window's width.
- **The header stays when the layout changes** (`Home.tsx`): it was rendered
  inside each of the two layouts, and the focus on the button was lost.
- **In Photo Location Map** there is no header, so no button, and the layout
  is always the automatic one.
- **The usage data** records the setting as the others are, when the page is
  loaded and when it changes, and "App Layout" when a change of the mode
  changes the layout shown.
- **The six texts are in all 42 languages**, inside `"home"`
  (`home.layout`), as machine translation; `docs/TRANSLATING.md` says what
  they are for.
- **The menu's button's face** is shared by the two buttons
  (`HeaderButtonFace` in `src/components/app-menu/AppMenu.tsx`).

## For the maintainer to decide

- **The names**: Automatic, Side by side and Tabs, under the word Layout.
  The alternatives are in the [plan](./PLAN.md#the-names): "Split" or
  "Split view", "Single pane", "One at a time" or "Tabbed", "Fit to window"
  or "Responsive".
- **The form**: an icon button with a menu, before the menu's button, whose
  icon shows the mode chosen. The header of a phone has the room for the
  sentence less by the button's width: the sentence takes a line more at
  320 pixels.
- **Side by side in a narrow window** is kept as chosen: about 150 pixels a
  column at 320 pixels, with the table scrolling sideways in its pane
  (`narrow-side-by-side.png`). The alternative is to show the tabs below a
  width, whatever the choice.
- **The Japanese texts** (`レイアウト`, `自動`, `並べて表示`, `タブで表示`,
  and `ウィンドウが広いときは並べて表示、狭いときはタブで表示`), which are
  the maintainer's to review, as the rest of Japanese is.

## Resuming

Nothing is pending on this branch. A branch merged after it that changes a
screenshot of the Home page makes that screenshot again, with the header's
new button. To change the names, change `home.layout` in every file of
`src/locales/`.
