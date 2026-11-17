# Google Earth button: status

Started on 2026-11-18. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Implemented and checked locally, together with the change in Photo Location
Map that it needs to show the button there.

- The coordinates row of the General tab has a third button, after the Google
  Maps and Google Street View buttons, which opens
  `https://earth.google.com/web/search/<latitude>,<longitude>` in a new tab:
  Google Earth goes to the place and marks it with a pin. The usage data
  records the button and the site, not the coordinates.
- Its icon is a globe from Flaticon, under the license of the other two icons:
  every Google Earth logo there is for editorial use only.
- In Photo Location Map it is shown only where this app's address has
  `googleEarth=1`. Photo Location Map passes it from the version that records
  the button's address without the coordinates; a version installed before
  that records the whole address, and shows no Google Earth button.
- The buttons continue on the next line where the row is too narrow for the
  three, as on a phone: two on the first line and one on the second at 320 and
  340 pixels. The space before them is 16 pixels instead of 22.
- `photoData.general.showInGoogleEarth` is in every language.
- Six reference screenshots were updated: those that show the row with a photo.

## For the maintainer to decide

- **The icon.** A globe rather than Google Earth's logo, as above. The logo that
  looks most like Google Earth's own, a blue sphere with waves, is
  [google-earth_720252](https://www.flaticon.com/free-icon/google-earth_720252)
  by the author of the Google Maps icon, under the Editorial License. Using it
  is a change of one data URL and the six screenshots.
- **Attribution.** The Flaticon License asks for a credit line for each author
  ("Icon made by Magnific from www.flaticon.com", and srip for the Street View
  icon) on the page where the icon is shown or in the footer, unless the icon
  was downloaded during a Premium subscription. The app has none for any of its
  Flaticon icons. The globe was downloaded without a subscription.
- **The Japanese text** `Google Earth で表示` has not been reviewed by the
  maintainer, as the rest of the Japanese file has.

## Not checked

- `npm run test:electron`, which opens windows on the machine. The Photo Location
  Map build was checked in headless Chromium with a bridge instead, with and
  without `googleEarth=1` ([results](./evidence/RESULTS.md#photo-location-map)).
- The button in a released Photo Location Map: no release has the change yet.
- Google Earth on a phone, where the address may open the Google Earth app.

## Resuming

The button, its address and when it is shown are in
[`LatLngRow.tsx`](../../../src/components/photo-data/row/LatLngRow.tsx), the icon
in [`icon-data-url.ts`](../../../src/icons/icon-data-url.ts), and the layout in
[`LatLngRow.module.scss`](../../../src/components/photo-data/row/LatLngRow.module.scss).
In Photo Location Map's repository, `googleEarth` is set in
`src-main/photo-data-viewer/photo-data-viewer-url.ts`, and the coordinates are
hidden in `modifyUrlForAnalyticsIfNeeded` of
`src-main/photo-data-viewer/launch-photo-data-viewer.ts`. A new link of this app
whose address has the photo's place needs the same: Photo Location Map hiding
the place, and a parameter that says so.
