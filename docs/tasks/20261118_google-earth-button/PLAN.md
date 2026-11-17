# Google Earth button: plan

## Goal

A third button beside the latitude and the longitude of the General tab, which
shows the photo's place in Google Earth, as the two beside it show the place in
Google Maps and in Google Street View
(`src/components/photo-data/row/LatLngRow.tsx`).

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

The button is not shown in Photo Location Map. Photo Location Map opens a
button's address in the browser and records the address in its usage data, with
the coordinates hidden only for an address of Google Maps
(`modifyUrlForAnalyticsIfNeeded` in
`src-main/photo-data-viewer/launch-photo-data-viewer.ts` of
[its repository](https://github.com/TomoyukiAota/photo-location-map)). An
address of Google Earth would be recorded with the photo's coordinates. This
app is served to every version of Photo Location Map and cannot tell which one
it is in, so a change there alone would not be enough for the versions already
installed.

## The layout

The row is a grid of its own, which keeps each name beside its number in any
language. The three buttons are on one line beside the numbers where the row is
wide enough, and continue on the next line where it is not: on a phone narrower
than about 370 pixels, two on the first line and one on the second. Nothing goes
out of the window, and in a language whose names take two lines, such as Polish,
the row is no higher than its names. The space before the buttons is 16 pixels
instead of 22, so that two buttons fit on a line at 320 pixels; the 22 left
exactly their width there, and they stood one under another.

## The text

`photoData.general.showInGoogleEarth`, right after `showInGoogleStreetView`, in
every language: the text of the Street View button with Google Earth's name in
the language, as Google writes it ("Google Планета Земля" in Russian and
Ukrainian, "Google 어스" in Korean, "Google 地球" in Chinese, "Google Earth" in
the others), in the case that the language's "Show in" asks for
([results](./evidence/RESULTS.md#the-text)).

## Verification

- Unit tests (`LatLngRow.spec.tsx`): the three buttons named in the language,
  the address and the tab without an opener, what the usage data records for
  each button, and no Google Earth button in Photo Location Map.
- Browser tests (`tests/e2e/browser/regression.spec.mjs`): the buttons in the
  window beside the numbers and over none of each other, in English at 1280 and
  320 pixels, in Polish at 320 and in Arabic, wide and narrow; the tab that the
  Google Earth button opens, and the event recorded.
- The reference screenshots that show the row with a photo, updated.
- `npm run test:all`, `npm run build`, `npm run build:plm`, the browser suite with
  the visual comparison, in Chromium and in Firefox, and `PDV_DEV=1`.
