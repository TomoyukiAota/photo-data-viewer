# Vercel Web Analytics and Speed Insights: status

Started on 2026-11-18. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Implemented and verified locally; it sends nothing until it is deployed, and
Web Analytics collects once it is enabled in the Vercel project.

- The standalone app loads Vercel's Web Analytics and Speed Insights while
  "Send usage data" is on (`src/analytics/VercelAnalytics.tsx`). Turned off,
  the scripts loaded already send nothing (`beforeSendToVercel`), and a page
  opened while it is off loads neither.
- In Photo Location Map's window, neither is loaded.
- The About page says that the time the pages take to load and respond is
  collected, in English and the 41 translations.

## The maintainer's step in Vercel

In the dashboard of the `photo-data-viewer` project, before the merge or with
a redeployment after it:

1. **Web Analytics**: open **Analytics** and select **Enable**. Vercel adds
   the routes the script uses with the next deployment, so a deployment of
   this code made before it asks for a script that is not there; deploying
   again after enabling fixes that.
2. **Speed Insights**: open **Speed Insights**. Vercel's documentation of the
   free tier has no switch to turn on: the deployments include its routes. If
   the page offers to enable it, enable it; do not choose Speed Insights Plus,
   which is for Pro.
3. Nothing in the `pdv-in-plm` project: the app loads neither there.

Then, on <https://photo-data-viewer.vercel.app>, the browser's developer tools
show two scripts of the app's own address loaded after the page (each at a
path that changes with the deployment), a request ending in `/view` for each
page opened, and requests ending in `/vitals` soon after the page is shown and
when the tab is hidden or another page is opened. With "Send usage data" off,
none of them. The dashboard shows data after the first visits; Speed Insights
after a few days.

## Decisions for the maintainer

- **Web Analytics is a second view of what GA4 shows**, counted more fully.
  If one place for page views is enough, removing `<Analytics>` from
  `VercelAnalytics.tsx` and the package leaves Speed Insights alone; the About
  page needs no change for that.
- **Speed Insights' allowance**: 10,000 events over 30 days, about 2,000 to
  3,000 page loads. Once the dashboard has a week of data, **Usage**, under
  **Observability**, shows how fast the allowance is used. If it would run
  out, `sampleRate` on `<SpeedInsights>` measures that share of the page
  loads: for example `0.5` for twice as many page loads as the allowance
  covers. Running out costs nothing; collection pauses for at least 14 days.
- **The Japanese text** of `about.usageData` has a new part: 開いたページとその
  表示や応答にかかった時間. The rest of the sentence is as reviewed.

## Not verified

- **The scripts on Vercel**, and what reaches the dashboards: they exist once
  the code is deployed and Web Analytics is enabled. The script's paths and
  requests above are from Vercel's documentation and the scripts' code.
- **The Electron suite** was not run, as it opens windows. The app does not
  render the components in Photo Location Map's window, which the unit test
  checks.
- **The 41 translations of the new part**: machine translation, as the rest.

## Resuming

After the merge and the maintainer's step, check the requests above on the
production site, with the setting on and off, and record them in the
[results](./evidence/RESULTS.md).
