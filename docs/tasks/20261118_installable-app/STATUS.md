# Installable app: status

Started on 2026-11-18. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Implemented, and checked locally in Chromium and Chrome without a window. Not
deployed yet.

- The standalone site links a web app manifest. Chrome 157 finds nothing
  missing to install it, and fires `beforeinstallprompt`, as it does when it
  offers to install a page from the address bar and its menu. Edge, built on
  Chromium, makes the same check. No service worker is needed for either.
- Installed, the app opens in a window of its own, without the browser's tabs
  and address bar, with a white title bar like the app's header, and has its
  own icon among the system's apps.
- Safari reads the same manifest for Add to Dock on macOS and Add to Home
  Screen on iPhone and iPad; iPhone and iPad take their icon from
  `apple-touch-icon`. Neither was tried here.
- The deployment in Photo Location Map has no manifest: Chrome reports
  `no-manifest` for its build.
- The favicon is the new icon instead of Create Next App's triangle.
- The app does not work offline: not needed to install it, and not without
  risk ([plan](./PLAN.md#working-offline)).

## For the owner to decide

- **The icon is a proposal.** See it in each size and shape in
  [icon-proposal.png](./evidence/icon-proposal.png); the app's icon itself is
  `public/icons/icon-512.png`. To change it, change the drawing in
  `scripts/generate-icons.mjs` and run `node scripts/generate-icons.mjs`
  ([DEVELOPMENT.md](../../DEVELOPMENT.md#the-apps-icon)).
- The title bar of the installed app is white, the color of the app's header
  (`theme_color`). The blue of the icon is the other choice.
- The manifest has no `short_name`. A phone's home screen shows "Photo Data
  Viewer", shortened where it is too long.

## Resuming

Once deployed, try it where the checks here could not, with a window:

1. In Chrome and in Edge on a computer, open
   https://photo-data-viewer.vercel.app and install it from the icon at the
   end of the address bar. The app opens in its own window; its icon is in the
   Dock or the taskbar, and in Launchpad or the Start menu. The menu goes to
   every page, and a link to GitHub or to Google Maps opens in the browser.
2. In Safari on a Mac, File > Add to Dock: see which icon it takes.
3. On an iPhone or iPad, Share > Add to Home Screen: the icon is
   `apple-touch-icon`, and the app opens without Safari's toolbar.
4. On Android, Chrome's menu offers Install app; the icon is the maskable one,
   cut to the launcher's shape.

The browser test (`Chrome offers to install the app, with its name and icons`)
fails when a change to the manifest or the icons makes the app no longer
installable, and says what Chrome finds missing.

## Follow-ups

- Open a photo with the installed app from Finder or Explorer: `file_handlers`
  in the manifest, and `launchQueue` in the app to receive the file. Chrome and
  Edge support it on the desktop.
- Share a photo to the app from another app on Android: `share_target`.
- Record whether the app was opened as an installed app (the
  `display-mode: standalone` media query), to see whether the installed app is
  used.
- Working offline, if it is wanted: see the [plan](./PLAN.md#working-offline).
