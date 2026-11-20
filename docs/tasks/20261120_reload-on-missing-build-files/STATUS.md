# Reload on missing build files: status

Started on 2026-11-20. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Done, and checked locally. Merged on 2026-11-20 as `1b42c3c` (#104), at
13:45:52 UTC. Vercel's production deployments of it ended at 13:50:07 UTC
(photo-data-viewer) and 13:52:22 UTC (pdv-in-plm), and both serve the script:
the heads of https://photo-data-viewer.vercel.app/ and
https://pdv-in-plm.vercel.app/ have `ReloadsForMissingBuildFiles`.

- A page whose server does not have a script or a stylesheet of its own
  build, as while Vercel changes the deployment, loads itself again 500 ms
  after its load, at most 3 times a minute, and only while the app has not
  started (`src/page-load/reload-for-missing-build-files.ts`). It is the same
  in both deployments.
- In Photo Location Map's window, `loadURL()` resolves first, and the page
  then shows the photo (the Electron suite, with Electron 32.0.2 and 45.2.1).
- No deployment has a Content Security Policy, and Photo Location Map gives
  the viewer's window none, so the inline script runs in both, as the one of
  Google Analytics does.

## Resuming

Nothing is pending in this repository.

- The change of deployment that #104 itself caused could still give a page
  the HTML of the deployment before, which has no script. From the next change
  on, the HTML of both deployments has it.
- To see that a deployment has it, `curl` its page and look for
  `ReloadsForMissingBuildFiles` in the head.
- Photo Location Map's `expectShownInViewer` should load only a page that is
  still the same document after its 2 seconds, so that its reload and the
  page's own do not stop each other
  ([the plan](./PLAN.md#photo-location-maps-e2e-suite)). That is a change in
  its repository.

## Follow-ups

- When the map's chunk does not load, the map says "A map is loading" for good:
  `next/dynamic` renders the loading component of `LeafletLoader` with the
  error, which it ignores, and does not try again for the next photo. This was
  so before this change, and is apart from it.
