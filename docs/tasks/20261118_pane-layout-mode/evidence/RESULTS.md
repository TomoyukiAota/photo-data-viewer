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

## Opened on hover

Checked on 2026-11-19 on the branch `claude/layout-submenu-hover-78382b`,
from `main` at `9bfe790`, after #88.

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 55 suites, 774 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS | 50 passed, with the visual comparison. |
| `npm run test:electron`, and the browser suite in Firefox | Not run. |

No screenshot changed: the submenu looks as it did, and `layout-menu`,
which has it opened by the keyboard, matched as it was.

The mouse was moved across the menu in steps, in a headless Chromium, at
1280 pixels in English and in Arabic and at 320 pixels in English:

- Resting on the entry opened the submenu, with the focus on Automatic.
  Going from Language to About over the entry did not open it.
- Straight down to About closed it, with the focus back on the entry. Down
  and towards the submenu, across About and Credits, to Single pane, it
  stayed open, and resting on About on that way closed it within 0.4
  seconds. In Arabic the submenu opened on the right of the menu, and the
  same ways did the same.
- At 320 pixels, where the submenu is under its entry, going down went into
  it, and going up to Language closed it.
- A click on the entry left the submenu open, with the focus on Automatic
  and the arrow keys moving in it. A click beside the menus closed the
  submenu alone, and a second one the menu, with the focus on its button. A
  press on About, on the way to the submenu, opened the About page, with the
  focus on the menu's button.
- Touched as a phone (Chrome's emulation of a Pixel 7), a tap opened the
  submenu, and a tap on Home closed it alone, as before.
- With the keyboard, the right arrow opened the submenu and the left arrow
  closed it, with the focus back on the entry.

## The language's button out of the header

Checked on 2026-11-19 on the branch `claude/remove-header-language-button`,
with `main` merged in at `6b6deb6` (#90, the button about drag and drop),
again at `42a576e` (#89, the order of the map buttons), and at `2a54a89`
(#92, the submenu opened on hover).

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 55 suites, 776 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS | 52 passed, with the visual comparison. |
| `npm run test:electron`, and the browser suite in Firefox | Not run. |

After #92, which changes no screenshot, every screenshot was made again and
matched the ones made after #89, but for differences of drawing: the photo
in `heif-general` and `loaded-general-ar` by 1 to 4 of 255 in a channel,
the text of Select Photo in `home-1200`, and one pixel of `loaded-raw`.
They were left as they were, and passed the comparison. A dropped photo's
test failed the comparison once, by 6 pixels of the ripple on the dialog's
focused button, and passed twice when run again.

The browser suite has the button's own test no more; the Polish header test
checks that the sentence ends before the menu's button, as before #78, and
the Arabic narrow test that it ends at the menu's button's right, before
the submenu of the layouts is opened.

### Reference screenshots

Every screenshot that showed the button was made again, 23, and
`language-picker` was removed. Each was looked at against the one on
`main`, from which it differs, pixel by pixel, only where the button was,
but at 320 pixels: there the sentence takes fewer lines, two in English
where it took three, the button about drag and drop is beside Select Photo
instead of under it, and what is under the header is higher by them.

- `home-1280`, `home-1201`, `home-1200`, `home-1199`, `home-600`,
  `home-320`.
- `loaded-general`, `loaded-details`, `loaded-raw`, `empty-details`,
  `heif-general`, `loaded-general-ar`.
- `narrow-loaded`, `narrow-photo`, `narrow-loaded-ja`, `narrow-loaded-ar`,
  `narrow-split-panes`.
- `unsupported-dialog`, `layout-menu`, `drop-dialog`, `drop-dialog-ar`,
  `drop-veil`, `drop-hint`.

Made before #90 was merged, 12 of them were again the screenshots of
before #78 (`3fcd017`), pixel for pixel, and the others differed from those
only by what was merged since, or by 1 or 2 of 255 in a channel.

After #89, the six screenshots of the coordinates' row (`heif-general`,
`loaded-general`, `loaded-general-ar`, `narrow-loaded`, `narrow-loaded-ja`
and `narrow-loaded-ar`) were made again on the merge. Each differs from the
one made before the merge only in the order of the map buttons. The photo
in #89's `loaded-general-ar` differs from the one before #89 by 1 to 4 of
255 in a channel, a difference of drawing; here it is as it was before #89.

`drop-veil` on `main` still had the button LAYOUT, and not the button about
drag and drop, under the veil: a change that light under the veil is under
the comparison's threshold of a pixel's colour, so it passed. All of them
were therefore made with `--update-snapshots=all`, which leaves the files
that did not change as they were, byte for byte.

## The test of the mouse, made steady

Checked on 2026-11-19 on the branch `claude/steady-submenu-hover-test`,
from `main` at `ec638cb` (#91).

The browser test of the mouse in English failed once in CI, on macOS, in
the run of #91's pull request (run 44350188843, first attempt), while the
run of the push of the same commit passed: the submenu did not open on its
entry. The failure's trace showed why. Playwright took the entry for stable
0.07 seconds after the click on the menu's button, while the menu still had
the size that it grows open from: the entry was 144.6 by 20.3 pixels, three
quarters of its width and nine sixteenths of its height. It put the
pointer on the entry there, and once the menu had grown, the pointer was on
Settings. Until Chrome has started a menu's growing, which can take a few
frames on a slow machine, the menu keeps that size, and Playwright takes it
for stable.

The two tests of the mouse, in English and in Arabic, now wait until no
animation moves the entry before the pointer is put on it, and until none
moves the submenu's modes before they are measured (`untilStill` in the
browser suite). What they check is as it was, and the app is unchanged.

| Check | Result |
| --- | --- |
| The two tests as they were, with the menus' growing started 80 ms late | 2 of 12 runs failed as in CI: the submenu did not open. |
| The same, started 150 ms late | 7 of 12 failed: the menus were measured while they grew. |
| The two tests now, started 80, 150 and 400 ms late | 36 of 36 passed. |
| The two tests now, `--repeat-each=50`, four at a time, in Playwright's Chromium, as in CI | 100 of 100 passed. |
| The same, `--repeat-each=25`, in Chrome (`PDV_CHROME=1`) | 50 of 50 passed. |
| `npm run test:all` | Lint and type check clean; 55 suites, 776 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS | 52 passed, with the visual comparison. |
| `npm run test:electron`, and the browser suite in Firefox | Not run. |

A copy of the suite, not kept, started the menus' growing late with a
`transition-delay` on their paper. Slowing Chrome's CPU 4 and 8 times
instead, in 20 tries each of the click and the hover that the test starts
with, left the pointer on the entry every time: there, the growing started
in time, and Playwright saw it.

With `main` merged in at `13d60ea` (#93, which changes the Google Earth
test in the same file), the checks were run again: `npm run test:all` (55
suites, 776 tests), both builds and the browser suite with the visual
comparison (52 tests) passed, no screenshot changed, and the two tests
passed 50 times of 50 with `--repeat-each=25`, four at a time, in
Playwright's Chromium.

## Layout before Language and Settings

Checked on 2026-11-19 on macOS 27 with Node 26.13.0 / npm 11.20.0, on the
branch `claude/menu-order-594291` from `main` at `931cfb4`
([the status](../STATUS.md#layout-before-language-and-settings)).

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 56 suites, 785 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS, against `next start` of the build | 55 passed, with the visual comparison. |
| `npm run test:electron`, and the browser suite in Firefox | Not run. |

The menu was measured in the production build with headless Chrome, on
`main` and with the change, with the submenu opened by the pointer resting
on its entry. The menu is where it was and as large, each entry as high as
it was; only the order of the entries changed, and the submenu moved with
its entry. In pixels from the window's top:

| Window | Language | The entry Layout | The submenu of the layouts |
| --- | --- | --- | --- |
| 1280 × 800 | English | 174–210 (was 246–282) | x 629–1071, y 174–318 (was 246–390), left of the menu |
| 1280 × 800 | Japanese | 176–212 (was 248–284) | x 522–1015, y 176–320 (was 248–392), left of the menu |
| 1280 × 800 | Arabic | 174–210 (was 246–282) | x 229–615, y 174–318 (was 246–390), right of the menu |
| 320 × 800 | English | 198–246 (was 294–342) | x 16–304, y 246–434 (was 342–530), under the entry |
| 320 × 667 | Polish | 198–246 (was 294–342) | x 16–304, y 246–434 (was 342–530), under the entry |
| 320 × 800 | Japanese | 200–248 (was 296–344) | x 16–304, y 248–456 (was 344–552), under the entry |

The boxes measured on `main` were those that `AppMenu.spec.tsx` and
`useSubmenuHover.spec.ts` had, so the two were given the boxes measured with
the change: the same, 72 pixels higher at 1280 pixels and 96 pixels higher
at 320.

With the keyboard, in English, Japanese and Arabic at 1280 pixels, the down
arrow went from Home along Demo, Layout, Language, Settings, About and
Credits, and back to Home. The arrow towards the submenu (the left arrow in
Arabic) opened it on Layout, with the focus on Automatic and the submenu's
top at its entry's, and the arrow back closed it, with the focus back on
Layout.

In the browser test of the mouse in English, the pointer that goes from
Layout towards the last mode now crosses Language alone before it is over
the submenu, and the one that goes straight down reaches Language.

### Reference screenshot

`layout-menu` was made anew, with `--update-snapshots=changed`, which
rewrites only what no longer matches. It differs from the one on `main`
only at x 622–1239, y 161–408: the entries that changed places, and the
submenu where it was and where it is, with their shadows. No other
screenshot changed.

## In Photo Location Map

Checked on 2026-11-20 on macOS 27 with Node 26.13.0 / npm 11.20.0, on the
branch `claude/layout-in-plm` from `main` at `92da7e6`
([the status](../STATUS.md#in-photo-location-map)).

| Command | Result |
| --- | --- |
| `npm run test:all` | Lint and type check clean; 57 suites, 794 tests passed. |
| `npm run build` and `npm run build:plm` | Passed. |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, Chrome on macOS, against `next start` of the build | 58 tests: the 56 that were there passed, with the visual comparison; the 3 new ones passed, 3 times each, once their 2 screenshots were made. |
| `npm run test:electron` with Electron 32.0.2 | 11 passed. |
| `npm run test:electron -- --grep "isolated window"` with Electron 45.3.2, Photo Location Map's | 7 passed. |
| The browser suite in Firefox | Not run. |

The button and its menu were measured in the deployment for Photo Location
Map (`npm run build:plm`, then `next start`), opened in headless Chromium as
its isolated window opens it, with a stand-in for its bridge, in each of the
42 languages and in five windows: 1240 × 772 in the automatic mode, which
splits the panes there; split panes at 640 × 600 and at 400 × 600; and a
single pane at 900 × 640 and at 320 × 640. Of the 210, none had a problem:

- The button was in its tabs' row and its pane, its end 18 pixels from the
  side of the pane, its word on one line and not cut, and the page no wider
  than the window. The row was 49 pixels high in every language, its line
  included.
- The menu was in the window, its top at the button's bottom (0 or 1
  pixel), with the focus on the mode chosen, and no text in it was cut.
- At 400 pixels, the data's column is 196 pixels wide, and its tabs
  scrolled beside the button in every language.

The button, from the narrowest to the widest, at 1240 pixels:

| Language | Button (width × height) |
| --- | --- |
| Chinese (Simplified) | 44 × 47 |
| Vietnamese | 49 × 44 |
| Hebrew | 50 × 44 |
| Arabic, Polish | 51 × 44 |
| Danish, English, German, Italian, Portuguese (Brazil), Swedish | 56 × 44 |
| Japanese | 80 × 48 |
| Lithuanian, Latvian | 81 × 44 |
| Bulgarian | 94 × 44 |

In English, Japanese, Arabic and German, the button and the menu, in
pixels from the window's left and top:

| Window | Language | Button | Menu |
| --- | --- | --- | --- |
| 1240, automatic | English | x 1166–1222 | x 780–1222, from y 46 |
| 1240, automatic | Japanese | x 1142–1222 | x 729–1222, from y 48 |
| 1240, automatic | Arabic | x 642–693, after the data's tabs, on their left | x 642–1028, from y 46 |
| 1240, automatic | German | x 1166–1222 | x 629–1222, from y 46 |
| 640, split panes | Arabic | x 342–393 | x 238–624: moved left to stay in the window |
| 320, single pane | English | x 246–302 | x 16–304, in the window's margins |
| 320, single pane | Arabic | x 18–69, at the window's left | x 16–304 |

With `main` merged in at `7cec082` (#100, which adds a sentence to the
status's first paragraph, where this adds one too), the checks were run
again: `npm run test:all` (57 suites, 794 tests), both builds and the
browser suite with the visual comparison (58 tests) passed, and no
screenshot changed. The Electron tests were not run again: #100 changes
the documents and the Language page alone.

### Reference screenshots

`plm-layout-menu` and `plm-layout-menu-ar` are new: the button's menu open
in Photo Location Map's window at 1280 pixels, in English and in Arabic. No
other screenshot changed.
