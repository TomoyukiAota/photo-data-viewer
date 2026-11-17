# Layout of the Home page's panes: plan

## Goal

Let the user choose how the Home page lays out the photo, the map and the
data, instead of the window's width alone deciding it, with a control before
the menu's button.

## What was asked

- Today the panes are laid out by the window's width
  (`src/hooks/useAppLayout.ts`): wider than 1200 pixels, the photo and the
  map are stacked in one column and the data is in another, with splitters
  between them (`HomeWideLayout`); otherwise, the three are tabs, Data, Map
  and Photo (`HomeNarrowLayout`).
- The user should be able to choose the layout: an automatic mode, which is
  today's behaviour, and two modes that the user fixes, always the panes side
  by side and always the tabs.
- The control is placed left of the menu's button: before it, so to its right
  in a language written from right to left.
- The names of the modes were an open question, as was the control's form.

## Decisions

### The names

The choice is named **Layout**, and its three modes **Automatic**, **Side by
side** and **Tabs**. Automatic says what it does under its name: "Side by
side in a wide window, tabs in a narrow one".

- **Layout** is what Outlook on the web calls the group of its reading pane's
  setting, Windows' File Explorer and Thunderbird their arrangements, and
  Chrome's DevTools its setting closest to this one, "Panel layout".
- **Automatic** is that DevTools setting's default, `auto`, which arranges
  the panels by the width that DevTools has, as this one does by the
  window's: the closest precedent there is. macOS' appearance has `Auto`
  too. "Responsive to your screen", Google Calendar's name for its default
  density, says more but reads as a term of web design.
- **Side by side** and **Tabs** name what the user sees, as Outlook's "Show
  on the right" and Gmail's "Right of inbox" do, rather than the window
  they suit ("Wide" and "Narrow", "Desktop" and "Mobile"), which reads wrong
  once chosen in the other kind of window. "Side by side" is the words of
  Word's "View Side by Side", which most languages have a translation of.
  "Tabs" is the control that the user then finds, the tabs Data, Map and
  Photo.

Alternatives weighed, for the user to choose from: "Split" or "Split view"
for side by side (Gmail's "No split", Apple's Split View); "Single pane",
"One at a time" or "Tabbed" for the tabs; "Fit to window" or "Responsive"
for the automatic mode.

### The control

An icon button with a word under it, **LAYOUT**, made as the menu's button
is (its icon and the word **MENU** under it), right before it. It opens a
menu of the three modes, each with a check mark when chosen and its icon,
as the menu has its pages.

- The button's icon is the chosen mode's, as a theme switcher's shows the
  chosen theme: a dashed circle with a spark for Automatic (MUI's
  `AutoMode`), two panes stacked beside a tall one for Side by side (MUI's
  `SpaceDashboard`, mirrored to the app's arrangement: the photo and the map
  on the left, the data on the right), and a window with a tab for Tabs
  (MUI's `Tab`).
- It is as wide as its word needs in the language, and never narrower than
  the menu's button in English, as that button is. The header keeps it in
  its flow, after the texts, so the texts end before it; it lines up with
  the menu's button at the header's top.
- Forms weighed: three toggle buttons, one per mode, need about three times
  the room, which a phone's header of 320 pixels does not have, and their
  icons alone do not say what they are; a button that steps through the
  modes hides both the modes and which one is chosen; an entry of the menu,
  or a field of the Settings page, is not where the user asked for it, and
  the Settings page is a page away from what it changes.

### Keyboard and screen reader

- The button is named by its word (`home.layout.buttonLabel`, "layout", as
  `menu.buttonLabel` is "menu"), says that it opens a menu
  (`aria-haspopup`), whether the menu is open (`aria-expanded`) and which
  menu (`aria-controls`). The menu is named by the button.
- The modes are radio items of the menu (`menuitemradio`), with
  `aria-checked`: a screen reader says which one is chosen. Opening the menu
  puts the focus on the chosen mode; the arrow keys, Enter, Escape and the
  first letters work as in the menu.
- Choosing a mode changes the panes under the header and leaves the focus on
  the button: the header stays where it is when the layout changes (it was
  rendered anew inside each layout before), so the focus is not lost.

### Side by side in a narrow window

Side by side is kept at every width, as the user chose it. In a phone's 320
pixels the two columns are about 150 pixels each; react-reflex keeps each
pane at least 100 pixels, which two columns and the splitter (208 pixels)
have in any window that the app supports. The table of the data scrolls
sideways inside its pane, as it does where a pane is narrower than the
table, and the page never becomes wider than the window. Automatic stays the
default, so no one gets this layout without asking for it, and the button
that changes it back is in the header.

Weighed: showing the tabs in a narrow window whatever the choice, as
Outlook's reading pane does, would make the choice look broken where it is
made, on a phone; letting the page scroll sideways breaks what the layout
holds everywhere else.

### Photo Location Map

Photo Location Map shows no header and no menu, so it has no control, and
the layout is always the automatic one there, whatever is stored: a mode
fixed some other way could not be changed back. Its window is resized as a
browser's is, and the automatic layout follows it, as today.

### Usage data

- The choice is a setting, `LayoutMode`, stored in the browser as the other
  settings are (`auto`, `sideBySide` or `tabs`, `auto` by default), and is
  recorded as they are: with the settings loaded when the page is loaded
  ("Loaded User Setting"), and when the user changes it ("Changed User
  Setting").
- "App Layout" records the layout that is shown (`isWideLayout`, now true
  for the side-by-side panes at any width) with the window's size. It is
  recorded again when a change of mode changes the layout shown, not only
  when the window is resized.
- No new event name: GA4 receives `loaded_user_setting`,
  `changed_user_setting` and `app_layout`, as before.

### Translations

The six texts go into `"home"` (`home.layout`) in every locale file, in the
words of the language's widely used software (Windows, Office, macOS): its
word for a layout, as Windows' File Explorer and Office name the group
(`Układ`, `Disposition`, `レイアウト`), its words for side by side as in
Word's "View Side by Side" (`Obok siebie`, `Côte à côte`), and its word for
tabs. The word under the icon is written in capitals where the script has
them, as `menu.label` is.

## What must not change

- In the automatic mode, which is the default, the Home page is laid out as
  before at every width, and nothing else of the app changes.
- The panes' sizes that the user set are kept, and the splitters work as
  before.
- The header holds texts of any length in every language: the texts end
  before the buttons, and the page is never wider than the window.
- Photo Location Map's window looks and works as before.

## Verification

- Unit tests: the mode decides the layout at every width, an unknown stored
  value reads as automatic, and Photo Location Map always gets the automatic
  one; the button, its menu, the radio items and the focus; the setting is
  stored and recorded.
- Browser suite: choosing each mode by mouse and by keyboard, kept after a
  reload, recorded in the usage data; the header and the menu at 320 pixels
  in Polish and in Arabic, with nothing cut and the page no wider than the
  window; side by side at 320 pixels. Reference screenshots of the Home page
  change with the header; each is reviewed.
- `npm run test:all`, `npm run build`, `npm run build:plm`, and the browser
  suite with the visual comparison on macOS/Chrome.
- Not run here: the Electron suite (`npm run test:electron`), which opens
  windows on this machine.
