# Vercel Web Analytics and Speed Insights: status

Started on 2026-11-18. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Merged and deployed on 2026-11-18, and checked on the production site
([results](./evidence/RESULTS.md#after-the-merge)). Web Analytics is enabled
in the Vercel project.

- The standalone app loads Vercel's Web Analytics and Speed Insights while
  "Send usage data" is on (`src/analytics/VercelAnalytics.tsx`). Turned off,
  the scripts loaded already send nothing (`beforeSendToVercel`), and a page
  opened while it is off loads neither.
- In Photo Location Map's window, neither is loaded.
- The About page says that the time the pages take to load and respond is
  collected, in English and the 41 translations.

## In Vercel

Nothing is left to do in the dashboard. On 2026-11-18 the production
deployment of the `photo-data-viewer` project, which has none of this code
yet, already answered `/_vercel/insights/script.js` and
`/_vercel/speed-insights/script.js` with Vercel's scripts: Web Analytics is
enabled in the project, which is why its **Analytics** page has no **Enable**
button, and Speed Insights' free tier needs no switch. The `pdv-in-plm`
project answers with 404, which is as it should be: the app loads neither
there. Speed Insights Plus, which the dashboard may offer, is for Pro.

On <https://photo-data-viewer.vercel.app>, the browser's developer tools
show two scripts of the app's own address loaded after the page (each at a
path of the project's own), a request ending in `/view` for each
page opened, and requests ending in `/vitals` soon after the page is shown and
when the tab is hidden or another page is opened. With "Send usage data" off,
none of them. The dashboard shows data after the first visits; Speed Insights
after a few days.

## Decisions for the maintainer

- **Web Analytics and GA4 are both kept**, the maintainer decided on
  2026-11-18. Web Analytics is a second view of what GA4 shows, counted more
  fully.
- **Speed Insights' allowance**: 10,000 events over 30 days, about 2,000 to
  3,000 page loads. Once the dashboard has a week of data, **Usage**, under
  **Observability**, shows how fast the allowance is used. If it would run
  out, `sampleRate` on `<SpeedInsights>` measures that share of the page
  loads: for example `0.5` for twice as many page loads as the allowance
  covers. Running out costs nothing; collection pauses for at least 14 days.
- **The Japanese text** of `about.usageData` has a new part: 開いたページとその
  表示や応答にかかった時間. The rest of the sentence is as reviewed.

## Not verified

- **What reaches the dashboards.** On the production site, the app loads
  both scripts, and neither with the setting off or as Photo Location Map's
  window ([results](./evidence/RESULTS.md#after-the-merge)). The scripts send
  nothing in a browser driven by a test, so the requests that send, `/view`
  and `/vitals`, and the dashboards are for the maintainer's own visit to
  show.
- **The deployment for Photo Location Map opened in an ordinary browser**
  loads both scripts, as the app counts it as the standalone app there. Its
  address is for Photo Location Map alone; leaving them out of that build as
  well is the maintainer's decision.
- **The Electron suite** was not run, as it opens windows. The app does not
  render the components in Photo Location Map's window, which the unit test
  checks.
- **The 41 translations of the new part**: machine translation, as the rest.

## Resuming

Nothing is pending in this repository. The maintainer looks at the
dashboards a day after their own visit, and at Speed Insights' allowance a
week after the merge.
