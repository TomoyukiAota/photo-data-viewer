# Google Earth button: plan

## Goal

A button beside the latitude and the longitude of the General tab, which shows
the photo's place in Google Earth, as the two beside it show the place in
Google Maps and in Google Street View
(`src/components/photo-data/row/LatLngRow.tsx`). It is between the two: Google
Maps, Google Earth, Google Street View. At first it was the third, after Google
Street View's ([the status](./STATUS.md#changed-after-the-merge)).

## The address

`https://earth.google.com/web/search/<latitude>,<longitude>`. Google Earth
searches for the coordinates: it goes to the place and marks it with a pin
labelled with the coordinates, and shows a card with them. The address of a
view alone, `https://earth.google.com/web/@<latitude>,<longitude>,...`, goes to
the place without a pin. Google documents neither; both were tried in the web
version of Google Earth ([results](./evidence/RESULTS.md#the-address)).

As for the other two buttons, the tab is opened without an opener, and the usage
data records which button was used and the site, not the coordinates.

## The icon

The two icons beside it are PNGs from Flaticon, kept as data URLs in
`src/icons/icon-data-url.ts`, under the Flaticon License: free for personal and
commercial use, with attribution. Every Google Earth logo on Flaticon is under
its Editorial License instead, "exclusively for editorial use", and Google asks
for a request of permission to use its own product icons
([results](./evidence/RESULTS.md#the-icon)). So the button has a globe from
Flaticon, under the same license as the other two and by the author of the Google
Maps icon: [earth-globe_616616](https://www.flaticon.com/free-icon/earth-globe_616616).
Its PNG of 128 pixels is kept rather than the one of 512 that the other two have:
the icon is 25 pixels high, and the icons are part of every page (14 KB more
instead of 61 KB).

## Photo Location Map

Photo Location Map opens a button's address in the browser and records the
address in its usage data. Up to 1.13.0 it hides the coordinates only of an
address of Google Maps (`modifyUrlForAnalyticsIfNeeded` in
`src-main/photo-data-viewer/launch-photo-data-viewer.ts` of
[its repository](https://github.com/TomoyukiAota/photo-location-map)), so an
address of Google Earth would be recorded with the photo's coordinates. This app
is served to every version of Photo Location Map, and cannot tell which one it
is in.

So the two change together:

- Photo Location Map hides the coordinates of an address of Google Earth as
  well, and says so with `googleEarth=1` in this app's address
  (`createPhotoDataViewerUrl` in
  `src-main/photo-data-viewer/photo-data-viewer-url.ts` there).
- This app shows the button in Photo Location Map only where its address has
  `googleEarth=1`: in the versions that have that change, and not in those
  installed before it.

A parameter of the address, as `plmBridge=1` already is, rather than a member of
the bridge: the earlier window, which has Node.js instead, has no bridge, and the
address is there as soon as the page is.

## The layout

The row is a grid of its own, which keeps each name beside its number in any
language. The three buttons are on one line beside the numbers where the row is
wide enough, and continue on the next line where it is not: on a phone narrower
than about 370 pixels, two on the first line, Google Maps and Google Earth, and
Google Street View on the second. Nothing goes out of the window, and in a
language whose names take two lines, such as Polish, the row is no higher than
its names. The space before the buttons is 16 pixels instead of 22, so that two
buttons fit on a line at 320 pixels; the 22 left exactly their width there, and
they stood one under another.

## The text

`photoData.general.showInGoogleEarth`, right after `showInGoogleStreetView`, in
every language: the text of the Street View button with Google Earth's name in
the language, as Google writes it ("Google Планета Земля" in Russian and
Ukrainian, "Google 어스" in Korean, "Google 地球" in Chinese, "Google Earth" in
the others), in the case that the language's "Show in" asks for
([results](./evidence/RESULTS.md#the-text)).

## Verification

- Unit tests (`LatLngRow.spec.tsx`): the three buttons in their order, named
  in the language, the address and the tab without an opener, what the usage
  data records for each button, and in Photo Location Map the Google Earth
  button with `googleEarth=1` and none without it.
- In Photo Location Map's repository: a unit test of
  `modifyUrlForAnalyticsIfNeeded`, and an e2e case in which the viewer's window
  opens the links of Google Maps and Google Earth, which are recorded without
  the place, with `googleEarth=1` in the viewer's address.
- Browser tests (`tests/e2e/browser/regression.spec.mjs`): the buttons in the
  window beside the numbers, over none of each other and in the order of the
  page, which Tab follows, in English at 1280 and 320 pixels, in Polish at 320
  and in Arabic, wide and narrow; the tab that the Google Earth button opens,
  and the event recorded.
- The reference screenshots that show the row with a photo, updated.
- `npm run test:all`, `npm run build`, `npm run build:plm`, the browser suite with
  the visual comparison, in Chromium and in Firefox, and `PDV_DEV=1`.
