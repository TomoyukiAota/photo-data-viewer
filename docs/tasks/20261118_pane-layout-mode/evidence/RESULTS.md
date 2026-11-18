# Layout of the Home page's panes: results

Checked on 2026-11-18 on macOS 27 with Node 26.13.0 / npm 11.20.0, on the
branch `claude/pane-layout-mode-4500b2` from `main` at `76bd3b1`. Every check
below was run again after the maintainer chose the names of the modes, with
the texts, the tests and the screenshot of the menu changed for them.

## Commands

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 42 suites, 669 tests passed. |
| `npm run build` | Passed. |
| `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS, against `next start` of the build | 27 passed, with the visual comparison. |
| `npm run test:electron` | Not run: it opens windows on this machine. |
| Browser suite in Firefox | Not run. |

`next build` (Next.js 16.4.3) stops once with exit code 1 after every page is
prerendered, with a notice of a security advisory against its version; the
same command run again passes. Both builds above passed on that second run.
The notice is about the version of Next.js, not about this change, and was
not acted on.

## Reference screenshots

Every screenshot of the Home page shows the header, which has the layout's
button now, so these 17 were made again, each after its difference was
looked at: the button and its word at the header's end, and nothing else at
the widths where the header's sentence keeps its lines. At 320 pixels the
sentence takes one line more than on `main` (it has the width less that the
button takes), and everything under the header is lower by that line.

- `home-1280`, `home-1201`, `home-1200`, `home-1199`, `home-600`: the button
  alone (176 pixels).
- `loaded-general`, `loaded-details`, `loaded-raw`, `empty-details`,
  `heif-general`, `unsupported-dialog`, `loaded-general-ar`: the button alone.
- `home-320`, `narrow-loaded`, `narrow-photo`, `narrow-loaded-ja`,
  `narrow-loaded-ar`: the button, and the header one line higher.

Two are new: `layout-menu`, the menu open at 1280 pixels in English, and
`narrow-split-panes`, the split panes at 320 pixels with a photo.
The screenshots of the Settings, About, Demo and Language pages, in English,
Japanese and Arabic, matched as they were.

## What the browser suite checks

- **English** (`the layout is chosen with the button before the menu’s, and
  is kept and recorded`): automatic at 1280 pixels is split panes; the menu
  opens by Enter with the focus on the mode chosen, the arrow keys move
  along it, Enter chooses, Escape closes it with nothing changed, and the
  focus is back on the button after each; a single pane at 1280 pixels, kept
  after a reload; split panes at 320 pixels, each pane at least 100 pixels
  wide and the page no wider than the window; automatic again at 320 pixels
  is a single pane.
  The usage data has `LayoutMode: auto` among the settings loaded, each
  change as "Changed User Setting", and "App Layout" again when the change of
  mode changed the layout shown.
- **Polish at 320 pixels**: the header's sentence ends before the layout's
  button, which ends before the menu's button, at its height, and is not
  cut; the menu is in the window, with each name and the description whole
  (the description on two lines); with split panes, the photo and the map
  are in the left column and the data in the right one, inside the window.
- **Arabic at 320 pixels**: the layout's button is right of the menu's
  button, at its height, and the sentence starts right of it; the menu is in
  the window.

## Checked by hand, headless

- Opened again after each choice, the menu has the focus on the mode chosen
  then (Single pane, Split panes, Automatic, in turn), and Escape gives the
  focus back to the button. In jsdom, MUI's menu puts the focus on the first
  entry when it opens again, so the unit test leaves that to the browser
  suite.
- In Photo Location Map's window (`?plmBridge=1`, which the app takes for its
  isolated window): no header and no button, and the layout is the automatic
  one whatever is stored: split panes at 1280 pixels with `singlePane`
  stored, a single pane at 600 pixels with `splitPanes` stored.
- The header and the menu at 320 pixels in English, Polish, Arabic,
  Japanese, French and Latvian, the language with the longest word under the
  icon (IZKĀRTOJUMS). The space between the two buttons (8 pixels) was added
  for Latvian, where the two words nearly touched.

## In the menu, with the language's button in its place

Checked on 2026-11-18 on the branch `claude/layout-in-menu`, from `main` at
`f3034cf`, after #78 and the other pull requests of the day were merged.

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 54 suites, 758 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS | 47 passed, with the visual comparison. |
| `npm run test:electron`, and the browser suite in Firefox | Not run. |

Every screenshot of the Home page shows the header, whose language's button
is where the button LAYOUT was, so 20 were made again: the header's end, and
nothing else at the widths where the sentence keeps its lines. `layout-menu`
is now the menu with the submenu of the layouts open, and `language-picker`
is new: the language's box open at 1280 pixels. The screenshots of the other
pages matched as they were.

Found and fixed while checking, in a headless browser:

- **The focus after a choice in the submenu** was lost, on the page's body:
  the submenu and the menu closed together. The menu now closes once the
  submenu is closed, and the focus goes back to the menu's button.
- **The submenu opened by the keyboard right after the menu** was placed by
  where its entry was while the menu still grew: 65 pixels above it at 1280
  pixels, and 7 pixels in Polish at 320. It is placed again when it has
  opened and when the menu has, whichever is last.
- **The language's box opened again before it had finished closing** kept
  its list as it was, without the focus on the search field. The list starts
  anew at each opening.

## The language's button out of the header

Checked on 2026-11-19 on the branch `claude/remove-header-language-button`,
from `main` at `9bfe790` (#88).

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 53 suites, 753 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS | 47 passed, with the visual comparison. |
| `npm run test:electron`, and the browser suite in Firefox | Not run. |

The browser suite has the button's own test no more; the Polish header test
checks that the sentence ends before the menu's button, as before #78, and
the Arabic narrow test that it ends at the menu's button's right, before
the submenu of the layouts is opened.

### Reference screenshots

Every screenshot that showed the button was made again, 22, and
`language-picker` was removed. Each was looked at against the one on
`main`: the button is gone, and at 320 pixels the sentence takes fewer lines
and what is under the header is higher. Compared, pixel by pixel, with the
same screenshot before #78 (`3fcd017`):

- The same: `home-1280`, `home-1201`, `home-1199`, `home-600`, `home-320`,
  `loaded-general`, `empty-details`, `heif-general`, `loaded-general-ar`,
  `narrow-loaded-ar`, `narrow-loaded-ja`, `narrow-photo`.
- Different by what was merged after #78: `drop-dialog`, `drop-dialog-ar`
  and `drop-veil` (the dialog of #86), and `loaded-details` and `loaded-raw`
  (the photo, by up to 8 of 255 in a channel, as on `main` already).
  `layout-menu` and `narrow-split-panes` came with #78.
- Different by 1 or 2 of 255 in a channel, the text of the button under the
  sentence and the text under a dialog's veil: `home-1200`,
  `narrow-loaded` and `unsupported-dialog`.

`drop-veil` on `main` still had the button LAYOUT under the veil: a change
that light under the veil is under the comparison's threshold of a pixel's
colour, so it passed. All of them were therefore made with
`--update-snapshots=all`, which leaves the files that did not change as
they were, byte for byte.
