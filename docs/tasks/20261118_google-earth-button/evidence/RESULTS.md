# Google Earth button: results

Checked on 2026-11-18, on macOS with Node 26.13.0 and npm 11.20.0, against `main`
at `76bd3b1`.

## The address

Tried in the web version of Google Earth (its version 20261105_1202_RC00), in
headless Chrome through Playwright, not signed in, in a window of 1280 × 800,
with the demo photo's place:

| Address opened | What Google Earth showed |
| --- | --- |
| `https://earth.google.com/web/search/37.332558,-122.005661` | The place seen from 703 m, with a red pin labelled `37°19'57.2"N 122°00'20.4"W`, and a card with the coordinates and the place's plus code (`8XMV+2PG Cupertino, California, USA`). The address became `https://earth.google.com/web/search/37%2e332558,-122%2e005661/@37.332558,-122.005661,47.8476214a,655.56350966d,35y,0h,0t,0r/data=…`. |
| `https://earth.google.com/web/@37.332558,-122.005661,0a,1000d,35y,0h,0t,0r` | The place, from the distance asked, without a pin or a card. |

Google Earth flew from the whole globe to the place in both. Its first visit also
showed a dialog about its news and a tip, over the map. The screenshots are not
kept here, as they are Google's imagery.

## The icon

The two icons beside it came from Flaticon as PNGs of 512 pixels, which Flaticon
makes with Inkscape (the PNGs' chunks say so; the commit that added them is
`b5739ee`). Flaticon's pages, read on 2026-11-18:

| Icon | Author | License |
| --- | --- | --- |
| [google-maps_2642502](https://www.flaticon.com/free-icon/google-maps_2642502), in the app | Magnific | Flaticon License: free for personal and commercial use, with attribution |
| [street-view_2344085](https://www.flaticon.com/free-icon/street-view_2344085), in the app | srip | Flaticon License |
| google-earth_720252, google-earth_818688, google-earth_818749, google-earth_1057762 | Magnific | Flaticon Editorial License: for editorial use only |
| google-earth_888855, google-earth_888905, google-earth_732207, google-earth_732064 | Pixel perfect | Flaticon Editorial License |
| google-earth_1240974 | Pictogramer | Flaticon Editorial License |
| [earth-globe_616616](https://www.flaticon.com/free-icon/earth-globe_616616), chosen | Magnific | Flaticon License |

The nine are the icons of Google Earth's logo on the first two pages of
Flaticon's icons for "google earth"; its "Google" pack, which has the Google
Maps icon, has none.

- Flaticon's terms ([flaticon.com/legal](https://www.flaticon.com/legal),
  section 8.1): the free use credits the site and the author; content
  downloaded during a Premium subscription needs no credit. Content marked for
  editorial use, or with distinctive signs such as a brand, is for editorial
  use alone: the freedom of expression, the right to information, academic or
  educational purposes, and nothing that links it to a business or promotes a
  product or a service.
- Flaticon's help on attribution: a line "Icon made by <author> from
  www.flaticon.com" on the page where the icon is shown or in the site's
  footer, one line for each author.
- Google: its [Geo Guidelines](https://about.google/brand-resource-center/products-and-services/geo-guidelines/)
  let its marks name its products accurately, in their approved versions, and
  [its brand guidelines](https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/)
  ask for a request of permission to use a product icon.
- The app credits none of its Flaticon icons.

The globe's PNG of 128 pixels (10,689 bytes) is kept instead of the one of 512
(45,717 bytes). `src/icons/icon-data-url.ts` is part of the `_app` chunk, which
every page loads: the chunk is 523 KB (221 KB with gzip) with this change, and
was 570 KB (257 KB) with the PNG of 512.

## Photo Location Map

Read in [its repository](https://github.com/TomoyukiAota/photo-location-map) on
2026-11-18: the window of this app opens a link that is a web page in the
browser (`setWindowOpenHandler` in
`src-main/photo-data-viewer/launch-photo-data-viewer.ts`) and records it with
`openUrl` (`src-shared/url/open-url.ts`), whose event has the address as its
value. `modifyUrlForAnalyticsIfNeeded` puts a text in its place for an address
that has `https://maps.google.com/` or `https://www.google.com/maps/`, so as
not to send the latitude and the longitude. An address of Google Earth was sent
as it is: in Photo Location Map's e2e case below, without its change, the
analytics got `https://earth.google.com/web/search/34.69,135.19`.

Its change, in
[its pull request #740](https://github.com/TomoyukiAota/photo-location-map/pull/740):

- `modifyUrlForAnalyticsIfNeeded` puts `URL including https://earth.google.com/`
  in place of an address of Google Earth. A unit test (Electron-Mocha, in the
  main process) checks the three addresses of this app's buttons and another
  link, which stays as it is.
- `createPhotoDataViewerUrl` adds `googleEarth=1` to this app's address.
- An e2e case opens this app's window from Photo Location Map, opens a link of
  Google Maps and one of Google Earth from the window as a button does, and
  checks that the browser gets the two addresses whole, and Amplitude
  and Mixpanel each `URL including https://maps.google.com/` and
  `URL including https://earth.google.com/`, with `googleEarth=1` in the
  window's address. Without the change of `modifyUrlForAnalyticsIfNeeded`, it
  fails with the address above.

This app's Photo Location Map build (`npm run build:plm`), opened in headless
Chromium as its isolated window opens it, with a bridge of version 1 that gave
the demo photo, without an error on the page:

| Address | Buttons |
| --- | --- |
| `?plmBridge=1&language=en`, as up to 1.13.0 | Google Maps and Google Street View |
| `?plmBridge=1&dateFormat=YYYY-MM-DD&clockSystemFormat=24h&language=en&googleEarth=1`, as with the change | Google Maps, Google Street View and Google Earth |

## The text

Google Earth's name in each language is that of the title of its help center
(`support.google.com/earth/?hl=<code>`) and of its app's page in Google Play
(`play.google.com/store/apps/details?id=com.google.earth&hl=<code>`):
"Google Планета Земля" in Russian (both) and in Ukrainian (Google Play; the
help center has no Ukrainian), "Google 어스" in Korean, "Google 地球" in Chinese
of both scripts, and "Google Earth" in the other languages. The help centers in
Hungarian and Bulgarian have "Google Föld" and "Google Земя" among their texts,
but their titles and Google Play say "Google Earth".

Google's help pages (the help center's front page, and eight articles in
Russian, Finnish, Turkish and Croatian) show how Google writes the name after a
word for "in" or "with":

- Russian: as it is, as in `в Google Планета Земля` (`Google Планета Земля` 62
  times in all; `Google Планете Земля` twice). Ukrainian, in Google Play:
  `версії Google Планета Земля`, as it is.
- Finnish: `Google Earthissa` (3 times). Turkish: `Google Earth'te` (13 times).
  Croatian: `Google Earthu` (3 times), after `na` and after `u`.
- Polish, Czech, Greek and Japanese: as it is (`z Google Earth Pro`,
  `ke Google Earth Pro`, `το Google Earth`, `Google Earth の`), as the Street
  View text of these languages has it.

The texts, beside those of the Street View button:

| `ar` | عرض في Google Street View | عرض في Google Earth |
| `bg` | Показване в Google Street View | Показване в Google Earth |
| `ca` | Mostra a Google Street View | Mostra a Google Earth |
| `cs` | Zobrazit v Google Street View | Zobrazit v Google Earth |
| `da` | Vis i Google Street View | Vis i Google Earth |
| `de` | In Google Street View anzeigen | In Google Earth anzeigen |
| `el` | Εμφάνιση στο Google Street View | Εμφάνιση στο Google Earth |
| `en` | Show in Google Street View | Show in Google Earth |
| `es` | Mostrar en Google Street View | Mostrar en Google Earth |
| `et` | Kuva Google Street View’s | Kuva Google Earthis |
| `eu` | Erakutsi Google Street View-n | Erakutsi Google Earth-en |
| `fi` | Näytä Google Street View’ssa | Näytä Google Earthissa |
| `fr` | Afficher dans Google Street View | Afficher dans Google Earth |
| `gl` | Mostrar en Google Street View | Mostrar en Google Earth |
| `he` | הצגה ב-Google Street View | הצגה ב-Google Earth |
| `hi` | Google Street View में दिखाएँ | Google Earth में दिखाएँ |
| `hr` | Prikaži na Google Street Viewu | Prikaži u Google Earthu |
| `hu` | Megjelenítés a Google Utcaképben | Megjelenítés a Google Earthben |
| `id` | Tampilkan di Google Street View | Tampilkan di Google Earth |
| `it` | Mostra in Google Street View | Mostra in Google Earth |
| `ja` | Google ストリートビューで表示 | Google Earth で表示 |
| `ko` | Google 스트리트 뷰에서 보기 | Google 어스에서 보기 |
| `lt` | Rodyti naudojant „Google Street View“ | Rodyti naudojant „Google Earth“ |
| `lv` | Rādīt pakalpojumā Google Street View | Rādīt pakalpojumā Google Earth |
| `ms` | Tunjukkan dalam Google Street View | Tunjukkan dalam Google Earth |
| `nb` | Vis i Google Street View | Vis i Google Earth |
| `nl` | Toon in Google Street View | Toon in Google Earth |
| `pl` | Pokaż w Google Street View | Pokaż w Google Earth |
| `pt-BR` | Mostrar no Google Street View | Mostrar no Google Earth |
| `pt-PT` | Mostrar no Google Street View | Mostrar no Google Earth |
| `ro` | Afișează în Google Street View | Afișează în Google Earth |
| `ru` | Показать в Google Street View | Показать в Google Планета Земля |
| `sk` | Zobraziť v Google Street View | Zobraziť v Google Earth |
| `sl` | Prikaži v Google Street View | Prikaži v Google Earth |
| `sr-Latn` | Prikaži u Google Street View | Prikaži u Google Earth |
| `sv` | Visa i Google Street View | Visa i Google Earth |
| `th` | แสดงใน Google Street View | แสดงใน Google Earth |
| `tr` | Google Street View’da göster | Google Earth’te göster |
| `uk` | Показати в Google Street View | Показати в Google Планета Земля |
| `vi` | Hiển thị trong Google Street View | Hiển thị trong Google Earth |
| `zh-Hans` | 在 Google 街景中显示 | 在 Google 地球中显示 |
| `zh-Hant` | 在 Google 街景服務中顯示 | 在 Google 地球中顯示 |

Estonian, Basque and Hungarian attach the ending of the language to the name,
as their Google Maps or Street View text does (`Google Mapsis`,
`Google Maps-en`, `Google Térképen`). The Japanese text is new and has not been
reviewed by the maintainer, as the rest of the Japanese file has.

## The layout

Measured in the development server with headless Chromium, the demo photo
loaded. The height of the row, in whole pixels:

| Window | Language | Before | After | The buttons |
| --- | --- | --- | --- | --- |
| 1280 × 800 | English, Polish | 45 | 45 | One line |
| 1199, 600 and 375 wide | English | 45 | 45 | One line |
| 340 wide | English | 45 | 78 | Two on the first line, one on the second |
| 320 wide | English, Japanese, Arabic | 42 to 43 | 78 | Two on the first line, one on the second |
| 320 × 667 | Polish | 80 | 80 | Two on the first line, one on the second |
| 1280 × 800 | Arabic | 45 | 45 | One line, on the left of the numbers |

In every case the page is no wider than the window. Before, at 320 pixels the
two buttons ended at the window's right edge. With the space before the buttons
still 22 pixels, the three stood one under another at 320 pixels (a row of 112),
as two buttons needed 77 pixels where a little less was left. Without
`flex-wrap`, the third button is out of the window at 320 pixels, and the three
browser tests that look at that width fail.

## Reference screenshots

The six that show the row with a photo were updated, in Chrome on macOS
(`PDV_CHROME=1 PDV_VISUAL=1`):

| Screenshot | Where it changed |
| --- | --- |
| `loaded-general`, `heif-general` | The buttons: x 956–1075, y 317–350 |
| `loaded-general-ar` | The buttons: x 848–967, y 317–350 |
| `narrow-loaded`, `narrow-loaded-ja`, `narrow-loaded-ar` | The row, from y 358 down |

`narrow-loaded` also differs in the shading of one digit of `3024 x 4032`
(about 40 pixels). It is the same in three runs with this change, and `main`
built on the same machine passes against the earlier screenshot, so it comes
with this change: the row under it is higher.

## Checks

On the branch with `main` merged in (with the installable app, which added a
browser test), except where the table says so:

| Check | Result |
| --- | --- |
| `npm ci` | The three known deprecation warnings |
| `npm run test:all` | Passes; 662 tests |
| `npm run build` | Passes (before `main` was merged in) |
| `npm run build:plm` | Passes |
| Browser suite in Chrome with the visual comparison | 27 passed |
| Browser suite in Chromium | 27 passed |
| Browser suite in Firefox | 25 passed, 1 skipped, the touch device (before `main` was merged in, with 26 tests) |
| `PDV_DEV=1` browser test | 1 passed (before `main` was merged in) |
| `npm run test:electron` | Not run: it opens windows on the machine |

In Photo Location Map's repository, on macOS, with its windows kept off the
screen:

| Check | Result |
| --- | --- |
| `npm run lint:all` | Passes |
| `npm run test:unit:em:main` | 307 passing, 2 pending |
| `npm run build:prod` | Passes |
| `npm run test:e2e`, the whole suite | 55 passed, 1 skipped |
