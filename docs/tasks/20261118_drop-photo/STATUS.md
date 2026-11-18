# Dropping a photo: status

Started on 2026-11-18, on the branch `claude/drop-photo-to-select-01fafd`,
from `main` at `76bd3b1`. See the [plan](./PLAN.md), which has the
decisions, and the [results](./evidence/RESULTS.md).

After the merge, the maintainer tried the dialog and changed its buttons and
the English and Japanese texts:
[Changed after the merge](#changed-after-the-merge). Then the maintainer
asked for a button beside Select Photo that says that a file can be dropped:
[The button about drag and drop](#the-button-about-drag-and-drop).

## Current state

Merged on 2026-11-18 as `358465b`, and the change after it as `7eb33ec`. The
button about drag and drop is on the branch `claude/drop-hint-button`.

- **A file dropped on any page** of the standalone app is taken
  (`src/components/drop-photo/DropPhoto.tsx`): the browser no longer opens it
  and leaves the app. The app listens on the window, so that the whole
  window takes the file, and nothing in Photo Location Map.
- **While a file is dragged over the page**, a veil covers the window, with a
  dashed line inside its edges and, in the middle, an icon and "Drop the
  photo to select it." on a white card. It takes no click.
- **Once it is dropped, a dialog asks** "Are you sure you want to select
  the photo below?", with the file's name under the question, and the
  buttons Cancel, which has the focus, and Select, in blue
  (`src/components/dialog/DropPhotoDialog.tsx`). Select
  loads the photo through `loadPhoto` of `PhotoContext`, as the button's
  file does, after opening the Home page when the drop was on another
  page. An unsupported file gets the dialog that it gets from the button.
- **The two dialogs share one look** (`src/components/dialog/_dialog.scss`).
  The dialog of an unsupported file is drawn as it was: its screenshot is
  unchanged.
- **The texts are in the 42 languages**, in a `dropPhoto` section right
  after `unsupportedFileDialog` in every locale file. The 41 translations are
  machine translation, as the others are. Cancel is Photo Location Map's
  word in each language.
- **The usage data** records the photo through the same events, with
  `isDropped` beside `isDemo` and `isReload`, and the dialog's opening as
  `Opened Drop Photo Dialog`, with the number of files dropped.

## Decisions for the maintainer

The [plan](./PLAN.md#decisions) gives the reasons. Each is open to a
second look:

1. **A drop is taken on every page**, and the photo is selected on the Home
   page, which the app opens. The other choice was the Home page alone.
2. **The veil while a file is dragged over the page**, with a text that the
   42 languages have. The other choice was the pointer alone, which shows a
   copy over the page and a refusal over a dialog in any case.
3. **The dialog asks on every drop**, also when no photo is shown, as was
   asked.
4. **Of several files, the first**, which the dialog names; folders are
   passed over. The other choice was to refuse several files with a message.
5. **A drop on an open dialog or menu is refused**, as a modal dialog
   refuses it, rather than taken.
6. **The English texts**: "Drop the photo to select it." and "Are you sure
   you want to select the photo below?", with Cancel and Select, as the
   maintainer changed them after the merge.
7. **Cancel has the focus**, so that Enter replaces nothing, and Escape and
   a click outside the dialog cancel, as the maintainer chose after the
   merge.
8. **The usage data has two additions**: `isDropped` in `Loaded Photo` and
   `Displayed Photo` (also sent to Photo Location Map's backend, where it is
   always false), and the event `Opened Drop Photo Dialog` with
   `fileCount`. In GA4, `is_dropped` and `file_count` are shown in reports
   once they are registered as custom dimensions.
9. **The Japanese texts**, which the maintainer chose after the merge:
   「ドロップして写真を選択できます。」 and
   「以下の写真を選択してもよろしいですか？」.

Not done, and left to the maintainer: the header's sentence ("Select your
photo to display EXIF data.") does not say that a photo can be dropped. The
layout of the panes is being changed elsewhere, and the header with it.

## Changed after the merge

On 2026-11-18, after the merge, the maintainer tried the dialog and changed
it:

- **Cancel has the focus** when the dialog opens, so that Enter replaces
  nothing, as Escape and a click outside the dialog do; Tab moves to Select.
  Select had it, so that Enter selected.
- **Select and Cancel have colors of their own**: Select is in the blue of
  the app's buttons (`#1976d2`), with white letters, and Cancel in the grey
  of the dialogs' buttons. Both were grey. The dialog of an unsupported
  file, whose one button is Close, is as it was.
- **The question asks about the photo below it**, whose name the dialog
  shows: "Are you sure you want to select the photo below?", in Japanese
  「以下の写真を選択してもよろしいですか？」. It said "this photo"
  (「この写真」).
- **The veil's text has no "here"**: "Drop the photo to select it.", in
  Japanese 「ドロップして写真を選択できます。」. It was "Drop the photo here
  to select it." (「ここにドロップすると、この写真を選択します。」).
- **The other 40 languages follow the English**, as the maintainer asked:
  the question asks about the photo below, and the veil's text has no
  "here" ([the texts](./evidence/RESULTS.md#the-texts)).
- **Screenshots**: `drop-dialog.png` and `drop-dialog-ar.png` changed for the
  colors, the focus and the question, and `drop-veil.png` for the English
  text.

## The button about drag and drop

On 2026-11-19 the maintainer asked for a button with an "i" beside Select
Photo, which opens a box that says that a file can also be dragged from the
file manager and dropped: from the Finder on macOS, and from File Explorer
on the other systems, Windows above all
(`src/components/drop-photo/DropHintButton.tsx`).

- **Where it is**: right beside Select Photo, in the middle of its height,
  and on the next line where the two do not fit side by side, as in a
  desktop browser 320 pixels wide in English. It is there only in the
  standalone app, where the main pointer is a mouse or a trackpad
  (`(hover: hover) and (pointer: fine)`), and not on an iPad, which says
  that it is a Mac: a file is dragged from a file manager with a mouse, and
  Photo Location Map takes no drop.
- **The box** is a dialog, as the language's box is: under the button, from
  the edge where its line starts; Escape, a click outside it or on the
  button closes it, and gives the focus back to the button. The button says
  that it opens a dialog, and whether it is open. A file dragged into the
  window closes the box at once, as the page would refuse a drop over a
  dialog.
- **The system** is told by `navigator.platform`: a Mac's starts with `Mac`.
  Every other system, Linux and ChromeOS too, gets File Explorer, as the
  maintainer asked.
- **The names**: the Finder is `Finder` in most languages, `访达` in Chinese
  (Simplified) and `فايندر` in Arabic, as Apple's Mac User Guide writes it in
  ten of the languages that were looked at. File Explorer is the name that
  Microsoft's page "File Explorer in Windows" has in the language, in 36
  languages; Windows keeps the English name in Estonian, Indonesian, Thai
  and Vietnamese. That page has no Catalan, Galician, Basque, Hindi or Malay
  version: Catalan and Galician have the names that their speakers use
  (`Explorador de fitxers`, `Explorador de ficheiros`), Hindi the name
  written in its script (`फ़ाइल एक्सप्लोरर`), and Basque and Malay the
  English name ([the names](./evidence/RESULTS.md#the-names-of-the-file-managers)).
- **Each language has two sentences**, one for each file manager, rather than
  one with the name put in: many languages give a name another form in a
  sentence (`Resurssienhallinnasta`, `из Проводника`).
- **The Japanese texts are the maintainer's words**:
  `ドラッグアンドドロップについて` for the button, and
  `Finder からファイルをドラッグアンドドロップして選択することもできます。`.
  English says "a file" as they do.
- **Screenshots**: every screenshot of the Home page shows the button, as
  the browser suite's browser has a mouse: 21 of them changed, by the button
  alone, or by the line that it takes under Select Photo in English at 320
  pixels (`home-320.png`, `narrow-loaded.png`, `narrow-photo.png`,
  `narrow-split-panes.png`). `drop-hint.png` is new: the box, open.
- **Two tests found the language's button** as the one that opens a dialog,
  which this one does too: they look for it at the end of the header now.

## Not verified

- **A real drag from the file manager**, from Windows Explorer above all,
  which no test can make: the tests dispatch the drag's events. That the
  browser opens nothing when the app refuses a file over a dialog, with a
  drop effect of none, is what the HTML standard has a browser do; it was
  not seen in one.
- **Safari**: the tests of a dropped photo ran in Chrome, Playwright's
  Chromium and Firefox, and the rest of the browser suite in Chrome.
- **Photo Location Map**: the Electron suite opens windows and was not run.
  The app listens for nothing there, which the unit test checks.
- **The 41 translations**: no speaker has read them.
- **The names of File Explorer in Catalan, Galician, Basque, Hindi and
  Malay**, which Microsoft's page does not have.
- **The button on a real Mac and on Windows with a mouse**: the browser
  suite's browser has a mouse, and its tests say that the system is the one
  or the other.

## Resuming

Nothing is pending once the button about drag and drop is merged. A change
of the decisions above is in `DropPhoto.tsx` (where a drop is taken, the
veil, several files), `DropPhotoDialog.tsx` (the dialog),
`DropHintButton.tsx` (the button about drag and drop) and `track-event.ts`
(what is recorded).
