# Credits page: plan

## Goal

A Credits page that credits the authors of the icons from Flaticon that the
app shows, as Flaticon's licenses ask, in the menu after About; and the icons
of `src/icons/icon-data-url.ts` that nothing uses, removed.

## What the owner decided

- The credits are on a page of their own, `/credits`, the last entry of the
  menu: Credits, クレジット in Japanese. The About page, which holds what a user
  is to read, stays as it is, without a link to it.
- A line for each author, in Flaticon's words: "Icon made by <author> from
  www.flaticon.com".

## The icons and their licenses

| Icon | Used for | Author | License |
| --- | --- | --- | --- |
| [google-maps_2642502](https://www.flaticon.com/free-icon/google-maps_2642502) | The Google Maps button | Magnific | Flaticon License |
| [street-view_2344085](https://www.flaticon.com/free-icon/street-view_2344085) | The Google Street View button | srip | Flaticon License |
| [earth-globe_616616](https://www.flaticon.com/free-icon/earth-globe_616616) | The Google Earth button | Magnific | Flaticon License |
| [undo-arrow_1702](https://www.flaticon.com/free-icon/undo-arrow_1702) | The button that rotates the photo | Magnific | Flaticon License |
| [github-logo_25231](https://www.flaticon.com/free-icon/github-logo_25231) | The GitHub profile on the About page | Dave Gandy | CC BY 3.0 (Flaticon's Font Awesome pack) |

The X logo is from X's brand toolkit, not from Flaticon, and is not credited
here. Flaticon's free license asks for one line for each author, not for each
icon, on the page where the icon is shown or on a page of credits. Dave Gandy's
icons are Font Awesome's, which Flaticon has under Creative Commons' license,
which asks for the license to be named.

## The page

- A title, a sentence that says where the icons are from, then a line for each
  author with the author's icons before it. The icons are pictures of what the
  lines say, with an empty `alt`. The rotate icon, which is drawn light, is on
  the dark background of the photo's button, as in the app.
- The lines stay in English in every language, Flaticon's words with links to
  the author, to Flaticon and to the license, read from left to right in Arabic
  and Hebrew as well. The title and the sentence are translated.
- `src/components/credits/icon-credits.ts` lists the authors and their icons. A
  unit test reads the icons that `icon-data-url.ts` says are from Flaticon and
  fails until each is credited.
- The page is like the others: its title in the browser, its head for search
  engines from `getStaticProps` and an address in each language (`/ja/credits`),
  and its title in GA4. It is not in the sitemap.

## The texts

`menu.credits`, `pageTitle.credits`, `pageDescription.credits`, `credits.title`
and `credits.icons`, in every language. The page is named as a speaker of the
language names a page of credits or of acknowledgements ("Crédits",
"Bildnachweise", "Emeği Geçenler", "致谢"). "Flaticon" is added to the names
that a translation keeps as they are written, which the unit test of the
translation files checks.

## Removed

`folder`, `launchExternalApp`, `play`, `noThumbnailAvailable` and
`generatingThumbnail`, which nothing uses.

## Verification

- Unit tests: the lines, links and icons of the page, its texts in Japanese, and
  that every icon from Flaticon is credited; the head of the page in every
  language (the tests of `searchPages`); the translation files.
- Browser tests: the menu ends with Credits, which opens the page, with its
  lines and links (and `credits.png`); in Polish at 320 pixels, the menu's entry
  and the page are whole; in Arabic, the page is laid out from the right and the
  lines keep their order (and `credits-ar.png`).
- `npm run test:all`, `npm run build`, `npm run build:plm`, the browser suite in
  Chrome with the visual comparison and in Chromium.
