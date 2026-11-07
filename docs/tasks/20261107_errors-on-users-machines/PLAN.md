# Errors on users' machines: plan

## Goal

Stop a photo with malformed GPS data from blanking the page, keep any error in
the map to the map, and record the errors users hit, so that the next one can be
seen and fixed.

## Why

Photo Location Map records the errors nothing handled on users' machines. One of
them was `Error: Invalid LatLng object: (NaNNaN, NaNNaN)`, thrown by Leaflet while
it placed a photo's marker. This app reads EXIF data with the same library and
had the same problem:

- For a GPS block whose `GPSLatitude` and `GPSLongitude` have no values and whose
  references are empty bytes (type `BYTE` or `UNDEFINED`, count 0), exifr 7.1.3
  gives `latitude` and `longitude` as the text `"NaNNaN"`. Its
  `ConvertDMSToDD(...GPSLatitude, GPSLatitudeRef)` spreads no values, so the
  reference becomes the degrees, and an empty byte array plus `NaN` plus `NaN` is
  text. With `N`/`E` references, it gives `"NNaNNaN"`/`"ENaNNaN"`.
- `LeafletContent` took that for a location, as it checked the coordinates by
  truthiness. Leaflet threw while rendering, Next.js caught the error, and the
  whole page went blank. The rest of the page used `is-number`, which refused the
  text, so it said that the location was not available.
- The app recorded no errors, so nothing showed that this happened.

## Changes

1. **Coordinates.** `isValidLatLng` (`src/utils/lat-lng.ts`) takes only numbers,
   finite, within -90 to 90 and -180 to 180; 0 is a place, as before.
   `LoadedPhotoExifData` keeps coordinates only when they pass it, and the map
   asks `isLatLngAvailable` as the rest of the page does. The Raw Data tab still
   shows what exifr gave.
2. **The map's error boundary.** `ErrorBoundary`, a class component as Next.js'
   Pages Router documentation describes, shows "The map cannot be shown." in the
   map's place when rendering the map throws. The photo and its data stay, and the
   map is tried again for the next photo.
3. **Recording errors** (`src/analytics/record-error.ts`), as Photo Location Map
   does (its `src-shared/analytics/record-error.ts`):
   - the window's `error` and `unhandledrejection` events, installed first in
     `_app.tsx`, leaving out `Script error.` and the ResizeObserver loop notice;
   - errors in rendering, which Next.js catches before the window could, through
     the error boundaries: the map's, and one around the app in `_app.tsx`, which
     shows "Something went wrong" with a Reload button instead of Next.js' error
     page.

   Each error is one event through `trackEvent`, so it reaches GA4, Photo Location
   Map's analytics (as `[PDV] Unhandled Error`) and the analytics backend, and is
   not sent when usage data is turned off.

## The event

Category and action `Unhandled Error`; GA4 name `unhandled_error`. The label's
fields:

| Field | What |
| --- | --- |
| `error` | `Name: message`, at most 200 characters |
| `errorSource` | `error`, `unhandledrejection` or `render` |
| `boundary` | For `render`: `map` or `page` |
| `pathname` | The page's path, without its query |
| `stack` | The top 5 frames of the stack, each at most 200 characters |
| `componentStack` | For `render`: the top 5 frames of React's component stack |

GA4 receives the text fields; the lists are left out, as GA4 cannot hold them.

Nothing of the user's is sent. Before anything is sent, the text loses the photo's
path and name, which Photo Location Map passes in the address; the home folder,
where Photo Location Map's window can tell it; and any path on the user's
computer, quoted or not, keeping only the name of a file of code. An address keeps
its host and path, or its path alone for this app's own code, never its query or
fragment. A page load sends at most 20 errors, 3 with the same text, and the same
error object once. Recording never throws.

## What must not change

- Photos with valid coordinates show their marker and zoom as before, including
  (0, 0).
- Every other page and snapshot, except the About page, whose text now says that
  errors are collected.
- What is sent when usage data is off: nothing.

## Verification

Unit tests for each part; the browser suite, with a JPEG whose GPS values are
empty built from `demo.jpg` in memory, and an error and a rejection sent to the
analytics backend; the visual comparison on macOS/Chrome; and the Electron suite,
which now checks that Photo Location Map receives the error without the photo's
path.
