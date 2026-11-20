# Reload on missing build files: plan

## Goal

A user who opens the app while its Vercel deployment changes gets the app, not
an empty page, in both deployments: https://photo-data-viewer.vercel.app and
https://pdv-in-plm.vercel.app, which Photo Location Map opens in a window of
its own.

## Why

Each merge to `main` deploys both deployments anew. For several seconds then,
Vercel's server gives a page the HTML of one deployment and the files under
`/_next/static/` of the other. The files' addresses name no deployment (no
`?dpl=`: Vercel's Skew Protection is not used), and each deployment answers 404
for the other's `webpack`, `main` and `_app` scripts and its build manifests.
A script is named by its content, the `_app` script holds the commit that it
was built from (`NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`), and the build manifests
are in a folder named after the build.

Watched on 2026-11-20, as `46342a9` became the deployment: from 12:31:26.3 to
12:31:34.1 UTC, 10 of 44 page loads got HTML whose `_app` or `main` script was
answered 404, and the old HTML still came 6.9 seconds after the new one first
had ([the loads](./evidence/RESULTS.md#the-change-watched-on-2026-11-20)).

The HTML has an empty root, as the app renders nothing until it runs in the
browser ([search engines](../../DEVELOPMENT.md#search-engines)), so such a
page never starts and shows nothing. Loaded again a moment later, it works.

Photo Location Map's e2e cases of the viewer timed out now and then on Ubuntu
in CI for this reason. Its suite now loads the viewer's page again while files
of its build are missing
([photo-location-map#762](https://github.com/TomoyukiAota/photo-location-map/pull/762),
which also has the measurements and the runs). A user who opens the viewer in
those seconds still gets an empty page: this change is for them.

## The change

A script that [`_document.tsx`](../../../src/pages/_document.tsx) puts first in
each page's head,
[`reload-for-missing-build-files.ts`](../../../src/page-load/reload-for-missing-build-files.ts),
whose comment says why each part is so.

1. **In the HTML itself.** It needs none of the build's files, so a page whose
   scripts are missing runs it all the same. It comes before Next.js' own
   stylesheets and scripts (only Next.js' preloads of the stylesheets are
   before it, and a preload does not count), and listens in the capture phase
   for their `error` events, which do not bubble.
2. **What counts.** A `<script>` or a `<link rel="stylesheet">` of the page's
   own origin under `/_next/static/`. Nothing of another site (the fonts, the
   analytics), nothing of this site outside the build (Vercel's `/_vercel/`
   scripts, which other servers answer with 404), no prefetch, no preload, no
   image.
3. **When.** Only once the page's `load` event has fired, then 500 ms later.
   Photo Location Map loads the page with `loadURL()` and waits for that load;
   a navigation that starts before it ends makes `loadURL()` reject with
   `ERR_ABORTED`, which Photo Location Map reports as an unhandled error. After
   it, a reload keeps the photo: Photo Location Map gives the photo to any page
   of the viewer's origin in that window.
4. **How often.** At most 3 times within a minute, counted in the tab's
   `sessionStorage`, which a reload keeps. After that, the page is left as it
   is, and the console says so. Where the storage cannot be used, the page is
   not loaded again, as the loads could not be counted.
5. **Only while the app has not started**, that is, while Next.js' root,
   `#__next`, is still empty; checked when the page would be loaded again.
   Until then, the user has seen nothing and done nothing.

### A file that fails once the app runs

It is left as the app handles it, in both deployments:

- The chunks that webpack loads once the app runs: the map's, which the Home
  page loads at once where the window is wide enough to show the map, and the
  HEIC decoder's. The map then stays at its loading text ("A map is loading"):
  `next/dynamic` renders the loading component with the error, and
  `LeafletLoader`'s ignores it. A HEIC whose decoder does not load is given to
  the image as it is, which only Safari shows; its data is shown.
- A page's files that fail in a navigation within the app: Next.js then loads
  that page by its address (`handleHardNavigation`).

Why not load the page again then:

- In the standalone deployment, it would lose a photo that the user opened from
  their disk, and could stop the navigation that Next.js starts.
- In Photo Location Map's window, it would keep the photo. But the page may
  already be in use (its tabs, its layout), and the script is the same in both
  deployments. Such a failure needs a chunk that is asked for in the seconds of
  a change, after the page's own files loaded, and it costs the map or the
  image of a HEIC, not the page.

That the map never says that it cannot be shown when its chunk does not load,
and never tries again, is the app's own handling, which this change leaves as
it is ([status](./STATUS.md#follow-ups)).

## Not chosen

- **Vercel's Skew Protection**, which keeps a page on its own deployment, is a
  feature of Vercel's paid plans, and is not used.
- **Fixing it in Photo Location Map alone.** Its e2e suite does
  (photo-location-map#762), but the users of both deployments would still get
  empty pages.
- **Loading the page again at once**, during its load: in Photo Location Map's
  window, `loadURL()` would reject.
- **A recorded event** for a page that loaded itself again. Nothing of the app
  runs in such a page, and the next one starts afresh; the console says what
  happened.

## Photo Location Map's e2e suite

Its `expectShownInViewer` loads the viewer's page itself, 2 seconds after the
load has ended, while the page has files of its build answered 404. The page
now loads itself 500 ms after its load. Against a stand-in of that function, in
headless Chromium, with the page's `_app` answered 404 in its first 1 to 4
loads ([results](./evidence/RESULTS.md#photo-location-maps-e2e-suite)):

- With the function as it is, it always loads the page once more, even when
  the page has loaded itself and works. When the page needs its third reload
  and its server answers in up to 600 ms, the two loads stopped each other in
  5 of 12 runs: `page.reload: net::ERR_ABORTED; maybe frame was detached?`,
  which fails the case.
- If, after its 2 seconds, it loads only a page that is still the same
  document (`performance.timeOrigin`), not loading, and still missing files,
  all 48 runs passed. It then loaded the page only when the page had loaded
  itself 3 times and given up. Without this change, the page never loads
  itself, the document stays the same, and the function does what it does now.

## What must not change

- A page whose files load is never loaded again. Each page's head has one more
  inline script, of 1.9 kB.
- A file of another site that does not load never loads the page again.
- A page that shows something is never loaded again by the script.
