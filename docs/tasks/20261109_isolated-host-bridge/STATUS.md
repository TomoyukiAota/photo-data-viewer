# Photo Location Map's isolated window: status

Updated 2026-11-09 (Asia/Tokyo).

## What and why

Photo Location Map is isolating the window that it opens this app in, as the last
stage of its removal of `@electron/remote`
([its task records](https://github.com/TomoyukiAota/photo-location-map/tree/main/docs/tasks/20261106_remove-electron-remote)).
In that window the page has no Node.js and runs in a sandbox with context
isolation. Its preload gives `window.plmPhotoDataViewer`, which gives the photo's
name, MIME type and a `plm-photo:` URL, or its bytes, and records analytics events.
The address has `plmBridge=1` instead of the photo's path.

This app now uses that bridge when the window gives it, and keeps reading the photo
by its path in the earlier window, which has Node.js. The build for Photo Location
Map is for a browser, like the standalone one: the `electron-renderer` target's
output needed Node.js's `global` and `require`, which the isolated window lacks.

## Compatibility

| Window                                                     | This app at 1ff7a50       | This branch                                                                                     |
| ---------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| Photo Location Map's earlier window, with Node.js (1.12.1) | Shows the photo           | Shows the photo, read with Electron's own `require` (`src/app-integration/local-photo-file.ts`) |
| Photo Location Map's isolated window                       | Shows nothing: no Node.js | Shows the photo from the bridge (`src/app-integration/plm-bridge.ts`)                           |
| A browser (standalone deployment)                          | Works                     | Works                                                                                           |

Photo Location Map must not release its isolated window before this branch is
deployed to https://pdv-in-plm.vercel.app.

## Verification

On macOS arm64, 2026-11-09:

- Lint, typecheck, unit tests (169), and both builds. The build for Photo Location
  Map has no `require(...)` of Node.js left in its scripts.
- Browser regression tests (14) and the development-mode smoke test (1).
- Electron integration tests: all 8 with Electron 32.0.2 (3 in the earlier window,
  5 in the isolated one, by URL and by bytes); the isolated window's 5 with
  Electron 45.2.1, Photo Location Map's current runtime.
- In Photo Location Map, its end-to-end cases of View Data against this build: in
  its isolated window (4, two with Unicode, spaces, `#` and `%` in the photo's
  path), and in packaged builds of two earlier stages of its task, whose windows
  have Node.js (4 each).

## Next

1. Review and merge this branch (owner).
2. Deploy it to production for Photo Location Map (owner).
3. Then Photo Location Map may release its isolated window.
