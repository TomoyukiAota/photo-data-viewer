# Dropping a photo: status

Started on 2026-11-18, on the branch `claude/drop-photo-to-select-01fafd`,
from `main` at `76bd3b1`. See the [plan](./PLAN.md), which has the
decisions, and the [results](./evidence/RESULTS.md).

## Current state

Implemented and checked locally. Not pushed: the maintainer decides first.

- **A file dropped on any page** of the standalone app is taken
  (`src/components/drop-photo/DropPhoto.tsx`): the browser no longer opens it
  and leaves the app. The app listens on the window, so that the whole
  window takes the file, and nothing in Photo Location Map.
- **While a file is dragged over the page**, a veil covers the window, with a
  dashed line inside its edges and, in the middle, an icon and "Drop the
  photo here to select it." on a white card. It takes no click.
- **Once it is dropped, a dialog asks** "Are you sure you want to select
  this photo?", with the file's name under the question, and the buttons
  Cancel and Select (`src/components/dialog/DropPhotoDialog.tsx`). Select
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
6. **The English texts**: "Drop the photo here to select it." and "Are you
   sure you want to select this photo?" (the words asked for), with Cancel
   and Select.
7. **Select has the focus**, so that Enter selects; Escape and a click
   outside the dialog cancel.
8. **The usage data has two additions**: `isDropped` in `Loaded Photo` and
   `Displayed Photo` (also sent to Photo Location Map's backend, where it is
   always false), and the event `Opened Drop Photo Dialog` with
   `fileCount`. In GA4, `is_dropped` and `file_count` are shown in reports
   once they are registered as custom dimensions.
9. **The Japanese text of the veil**, which the maintainer reviews:
   「ここにドロップすると、この写真を選択します。」, after the header's
   「写真ファイルを選択すると、EXIF データを表示します。」, and the question
   「この写真を選択してもよろしいですか？」.

Not done, and left to the maintainer: the header's sentence ("Select your
photo to display EXIF data.") does not say that a photo can be dropped. The
layout of the panes is being changed elsewhere, and the header with it.

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

## Resuming

Nothing is pending but the maintainer's review. A change of the decisions
above is in `DropPhoto.tsx` (where a drop is taken, the veil, several files),
`DropPhotoDialog.tsx` (the dialog) and `track-event.ts` (what is recorded).
