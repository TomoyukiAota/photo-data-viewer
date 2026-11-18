# Credits page: status

Started on 2026-11-18. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Implemented and checked locally.

- `/credits`, the last entry of the menu, credits Magnific, srip and Dave Gandy
  for the five icons from Flaticon that the app shows, a line for each, with the
  license of Dave Gandy's (CC BY 3.0).
- The page's title, its description for search engines and the sentence before
  the lines are in every language; the lines stay in English.
- The five icons that nothing used are removed from `icon-data-url.ts`.
- Two reference screenshots are new: `credits.png` and `credits-ar.png`.

## Not checked

- `npm run test:electron`, which opens windows on the machine. Photo Location
  Map shows no menu, so the page is not reached there.
- A reading of the translations by speakers: they are machine translation, as
  the rest of the files that no speaker has reviewed.

## Resuming

An icon from Flaticon that is added to `src/icons/icon-data-url.ts`, with its
`// From https://www.flaticon.com/...` comment, is added to
`src/components/credits/icon-credits.ts` with its author, and the screenshots
of the page are made again (`PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e --
--grep Credits --update-snapshots=changed`). An icon from elsewhere is credited
as its license asks.
