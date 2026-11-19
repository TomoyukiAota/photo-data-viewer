# Google Earth button: status

Started on 2026-11-18. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

After the merge, the maintainer moved the button between those of Google Maps
and Google Street View: [Changed after the merge](#changed-after-the-merge).
The browser test's check of the usage data was then made to look for the
coordinates alone: [The test of the usage data](#the-test-of-the-usage-data).

## Current state

Merged on 2026-11-18, together with the change in Photo Location Map that it
needs to show the button there: pull requests
[#80](https://github.com/TomoyukiAota/photo-data-viewer/pull/80) here, as
`3fcd017`, and [#740](https://github.com/TomoyukiAota/photo-location-map/pull/740)
there. The change after it is on the branch `claude/map-button-order-b1e1fd`.

- The coordinates row of the General tab has a button between the Google Maps
  and Google Street View buttons, which opens
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
  three, as on a phone: Google Maps and Google Earth on the first line and
  Google Street View on the second at 320 and 340 pixels. The space before
  them is 16 pixels instead of 22.
- `photoData.general.showInGoogleEarth` is in every language.
- The credit that the Flaticon License asks for, which the app had for none of
  its Flaticon icons, is on the Credits page, the globe's among them
  ([its task](../20261118_credits/STATUS.md)).
- Six reference screenshots were updated: those that show the row with a photo.

## For the maintainer to decide

- **The icon.** A globe rather than Google Earth's logo, as above. The logo that
  looks most like Google Earth's own, a blue sphere with waves, is
  [google-earth_720252](https://www.flaticon.com/free-icon/google-earth_720252)
  by the author of the Google Maps icon, under the Editorial License. Using it
  is a change of one data URL and of the screenshots that show the row.
- **The Japanese text** `Google Earth で表示` has not been reviewed by the
  maintainer, as the rest of the Japanese file has.

## Changed after the merge

On 2026-11-18, after the merge, the maintainer asked for the Google Earth
button between the two others:

- **The buttons are Google Maps, Google Earth and Google Street View**, in
  this order in the page and on the screen, from where a line starts (the
  right, in a language written from right to left), and Tab goes from one to
  the next in it. They were Google Maps, Google Street View and Google Earth.
- **Each button is as it was**: the address it opens, its texts, and what the
  usage data records for it.
- **In Photo Location Map** the Google Earth button is still shown only where
  the address has `googleEarth=1`, between the two others; without it the row
  has Google Maps and Google Street View.
- **Where the buttons do not fit on one line**, as at 320 and 340 pixels,
  Google Maps and Google Earth are on the first line and Google Street View on
  the second. In the split panes at 320 pixels they stand one under another.
  The row is as high as it was in every width and language measured
  ([results](./evidence/RESULTS.md#the-order-after-the-merge)).
- **The Credits page is as it was**: it lists the icons by their authors, and
  has the Google Maps and Google Earth icons, by the same author, on a line
  before the Google Street View icon's, which is the row's order already.
- **Screenshots**: `loaded-general`, `heif-general`, `loaded-general-ar`,
  `narrow-loaded`, `narrow-loaded-ja` and `narrow-loaded-ar` were made anew;
  only the two buttons that changed places differ in them.
  `narrow-split-panes` shows the row without its buttons, which are beyond
  the edge of the pane until the table is scrolled, and is as it was.

## The test of the usage data

On 2026-11-19 the browser test's check that no event sent has the photo's
place was made to look for the latitude or the longitude with four decimals
or more. It had looked for `37.33` or `122.00`, and failed once in CI on the
time of an event, whose seconds were `37.335`. It still fails when the place
is sent, which was tried on purpose
([results](./evidence/RESULTS.md#the-check-of-the-usage-data-after-the-merge)).

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
