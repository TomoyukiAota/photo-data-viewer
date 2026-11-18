# Dropping a photo: plan

## What was asked

To select a photo, a user would like to drag it from the file manager, such
as Windows Explorer, and drop it on the app in the browser. Before the
dropped photo is loaded, a dialog asks, so that a photo dropped by accident
does not replace the one shown: "Are you sure you want to select this
photo?". This is for the standalone app only. In Photo Location Map, nothing
changes.

Without a handler, a browser opens a dropped file itself, and the app is left.

## Decisions

### Where a drop is taken: on every page

A photo can be dropped on any page of the app. When it is selected on
another page than Home, the app opens Home with it, as the Demo page's "Run
Demo" button does. The photo belongs to the whole app, not to the Home page
(`PhotoProvider` is above the pages), and a drop that did nothing on the
Settings page would leave the user wondering why. The dialog asks first, so
a drop does not change the page by itself.

### While a file is dragged over the page

The page is covered by a veil with a dashed border and the text "Drop the
photo to select it.", so that the user sees before letting go that the app
takes the file, and what it does with it. At first the text was "Drop the
photo here to select it." ([the status](./STATUS.md#changed-after-the-merge)).
The pointer shows a copy as well (`dropEffect`). The veil takes no click and
covers the whole window, under the dialogs and the menu.

### Several files at once

The first file is taken, as the file input takes one. The dialog names the
file, so the user sees which one it is and can cancel. Folders are not
files of a photo and are passed over; when only folders are dropped,
nothing happens.

### A drag that carries no file

Text and links that are dragged are left to the browser, as they are now: no
veil, and the browser does with them what it always did. The search field of
the Language page still takes dragged text. A drag that starts in the page
itself, such as the shown photo dragged by the mouse, is left alone too.

### A drop while a dialog or the menu is open

The drop is refused: the pointer shows that it cannot be dropped, nothing is
loaded, and the browser does not open the file. A dialog and the menu lie
over the page and take its place until they are closed, as a modal dialog of
any application does. This holds for the dialog of a dropped photo, the
dialog of an unsupported file, the menu, and the lists of the Settings page.

### Asking also when no photo is shown

The dialog asks on every drop, as was asked. With no photo shown, nothing is
replaced, but a drop still opens the Home page from another page, and the
dialog names the file that was dropped. One way of selecting by dropping is
also easier to learn than two.

### The dialog

- **The question is the title**, "Are you sure you want to select the photo
  below?" (at first "this photo"), and the file's name is the message under
  it, in its own direction in a language written from right to left. The
  buttons are
  **Cancel** and **Select**, in the order of MUI's dialogs: the one that
  dismisses first.
- **It looks as the dialog of an unsupported file does**: the same size,
  spaces and alignment, in styles that the two now share
  (`src/components/dialog/_dialog.scss`). It is as wide and as high as its
  texts need, and the two buttons go one under the other where they do not
  fit side by side. Cancel is grey, as that dialog's Close is, and Select is
  in the blue of the app's buttons; at first both were grey (see
  [the status](./STATUS.md#changed-after-the-merge)).
- **The keyboard**: Cancel has the focus when the dialog opens, so Enter
  replaces nothing; Tab moves between the two buttons; Escape cancels, as
  does a click outside the dialog. Cancelling loses nothing, so nothing has
  to keep it open. At first Select had the focus, so that Enter selected.
- **"Cancel" is Photo Location Map's word** in each language
  (`common.cancel` there), as the words that the two applications share are
  the same in both (docs/TRANSLATING.md). "Select" is the verb of the
  language's "Select Photo".

### What is recorded

A dropped photo is loaded as one chosen with the button is, through
`loadPhoto` of `PhotoContext`: an unsupported file gets the same dialog, and
the usage data records the same events. Two things are added:

- **`isDropped`** in the label of `Loaded Photo` and `Displayed Photo`,
  beside `isDemo` and `isReload`, so that a dropped photo can be told from
  one chosen with the button. It is kept when the photo is loaded again
  after a setting changes, as `isDemo` is.
- **`Opened Drop Photo Dialog`** when the dialog opens, as the dialog of an
  unsupported file is recorded, with the number of files dropped. A dialog
  that was cancelled is one opened without a `Loaded Photo` that has
  `isDropped`.

The file's name is not recorded.

### Photo Location Map

Nothing is listened for there: its window does with a dropped file what it
did before.

## Verification

- Unit tests: the helpers that tell a file from text and a folder, and the
  drop handler with the dialog: the veil, the dialog, Select, Cancel and
  Escape, another page, several files, text, a drag from the page, a drop
  on an open dialog, and Photo Location Map. The events and their fields.
- The browser suite: the drop is dispatched with a `DataTransfer` that holds
  the file, as Playwright cannot drag a file from outside the browser. In
  English, Polish at 320 pixels, and Arabic, with screenshots of the veil
  and the dialog.
- `npm run test:all`, `npm run build`, `npm run build:plm`, and the browser
  suite with the visual comparison.
- Not run here: the Electron suite, which opens windows. A real drag from
  the file manager, which no test can make.
