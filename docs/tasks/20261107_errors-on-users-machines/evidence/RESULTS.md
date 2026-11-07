# Errors on users' machines: results

Checked on 2026-11-07 on macOS 27 (Apple silicon), Node 26.13.0 and npm 11.20.0,
on the branch with all three changes.

## The cause, reproduced

A Node script built JPEGs whose GPS block is malformed in different ways and
parsed them with exifr 7.1.3, as `exifr.parse(file, true)` does in the app:

| GPS block | `latitude` exifr gives |
| --- | --- |
| Latitude `RATIONAL` with no values, reference `UNDEFINED` with no bytes | `"NaNNaN"` (text) |
| Latitude `BYTE` with no values, reference `BYTE` with no bytes | `"NaNNaN"` (text) |
| Latitude `RATIONAL` with no values, reference `N` | `"NNaNNaN"` (text) |
| Latitude `RATIONAL` with no values, reference empty `ASCII` | `NaN` |
| Latitude three `0/0` rationals | `NaN` |
| Latitude `ASCII` and empty, or one rational | none |
| A valid latitude and longitude | the number |

On `main`, loading the first kind in the development server blanked the page:
`#__next` had no children, and the console had
`Error: Invalid LatLng object: (NaNNaN, NaNNaN)` from Leaflet's `LatLng`. A copy
with valid GPS data showed its marker.

## Checks

| Command | Result |
| --- | --- |
| `npm run test:all` (lint, typecheck, Jest) | Passed: 22 suites, 156 tests |
| `npm run build` | Passed |
| `npm run build:plm` | Passed |
| `npm run test:e2e` (Chromium) | Passed: 14 tests, 2 of them new |
| `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e` | Passed: 14 tests, after `about.png` was updated |
| `npm run test:electron` with Electron 32.0.2 | Passed: 3 tests, 1 of them new |

- **The new browser tests.** A copy of `demo.jpg` whose GPS values are empty,
  built in memory, shows the photo, its data, "Location data (latitude and
  longitude) is not available." and the map without a marker, with no page error.
  An error thrown from a timer and a promise rejected with nothing awaiting it
  reach the analytics backend's request as two `Unhandled Error` events, with
  `errorSource` `error` and `unhandledrejection`.
- **The new test fails without the fix.** With the map's old check by truthiness
  put back for a build, the test failed: the map's place showed "The map cannot be
  shown." while the photo and its data stayed, which also shows the map's error
  boundary at work in a production build.
- **The visual comparison.** Only `about.png` differed, by the new text of the
  About page: the paragraph has the same four lines and moved right, as its
  longest line is shorter. It was updated with `--update-snapshots=changed`, and
  every other snapshot matched without being updated.
- **Photo Location Map's window.** The Electron suite opens the app with the
  photo's path in the address, throws an error whose message has that path in a
  timer, and checks what reaches the main process on Photo Location Map's analytics
  channel: `[PDV] Unhandled Error` under `Photo Data Viewer`, whose label is

  ```json
  {"error":"Error: Cannot open <path>","errorSource":"error","pathname":"/","stack":["at <anonymous>:2:15"]}
  ```

  without the photo's path or the home folder.
