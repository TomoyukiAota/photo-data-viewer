# Vercel Web Analytics and Speed Insights: plan

## Goal

Add Vercel's Web Analytics and Speed Insights to the standalone app if they
give something that the usage data the app collects does not, without a new
concern; leave out what does not.

## What the app has already

The app sends its usage data to GA4, to its own analytics backend and, in
Photo Location Map's window, to that application's backend
(`src/analytics/`). All of it stops when "Send usage data" is off in Settings,
and the About page says what is collected (`about.usageData`). GA4 records the
pages opened, with the referrer, the country, the browser and the device. The
backend records the app's events, `Page Loaded` among them with the referrer
and the screen, but not which page is opened.

## What each gives

- **Speed Insights**: how fast the pages load and respond for the people who
  use the app, measured in their browsers (LCP, FCP, INP, CLS, TTFB), page by
  page and after each deployment. Nothing the app collects measures it. Its
  free tier shows the Real Experience Score that Vercel computes from these
  measurements, per page and per route, for the last 24 hours or 7 days. The
  measurements one by one, the countries and the elements need Speed Insights
  Plus, which is for Pro.
- **Web Analytics**: the pages opened, by how many visitors, from where
  (referrer, country) and with what (browser, OS, device), in Vercel's
  dashboard. GA4 has the same, but a content blocker keeps GA4's tag, which is
  Google's, from loading in many browsers. Vercel's script is loaded from the
  app's own address, at a path chosen anew for each deployment, so its counts
  miss fewer visitors. It is a view of what GA4 shows, counted more fully; it
  keeps a month on Hobby, and custom events need Pro.

Both are worth adding: Speed Insights for what nothing else measures, Web
Analytics for counts that blockers do not thin out. Neither has a concern that
the setup below does not meet.

## Concerns, and how they are met

From Vercel's documentation, read on 2026-11-18 (links in the
[results](./evidence/RESULTS.md#sources)), and from the scripts themselves.

- **The plan's limits.** Neither is ever billed on Hobby; past its limit, it
  stops collecting for a while, and the app runs on.
  - Web Analytics: 50,000 events a month, shared by all projects of the
    account. An event is a page view. Past it, collection stops after 3 days,
    for 7 days or until the next month.
  - Speed Insights: 10,000 events over the last 30 days, shared by the team.
    A page load gives 3 to 5, and a page opened from the menu up to 4 more in
    Chromium browsers, so the allowance covers about 2,000 to 3,000 page loads
    a month. Past it, collection stops for at least 14 days, and until the
    last 30 days hold less than half of it. `sampleRate` measures a share of
    the page loads instead, if the app has more.
- **What is collected.** Neither sets a cookie or keeps anything in the
  browser's storage, and Vercel keeps what they send as anonymous statistics.
  - Web Analytics: the time, the address and the route of the page, the
    referrer, the query parameters Vercel keeps (filtered), the location
    derived from the IP address (country, region, city), the OS, the browser
    and the device type. A visitor is told apart by a hash of the request,
    which Vercel discards after 24 hours.
  - Speed Insights: the route and the address, the network's speed (`4g`),
    the browser, the device type, the OS, the country, each measurement, and
    the element it concerns as a CSS selector of the page.
- **The About page.** It says that the pages opened are collected, with the IP
  address and the location derived from it: that covers Web Analytics. How
  fast the pages load is new, so the text now says that the time the pages
  take to load and respond is collected, in every language.
- **"Send usage data".** With the setting off, the app loads neither script, as
  it does not load GA4's. Turned off after they are loaded, it stops what they
  send: each passes every event through the app's `beforeSend`, which gives
  them nothing then. Vercel documents `beforeSend` for an opt-out, and both
  scripts send nothing for an event it returns `null` for.
- **The address.** `beforeSend` also takes the photo's path out of the address,
  as GA4 is given it, although the scripts are not loaded where Photo Location
  Map passes it.
- **The cost to the page.** Each script is loaded after the page is shown,
  deferred: 4.5 KB for Web Analytics and 20 KB for Speed Insights (2 KB and
  7.3 KB compressed). Their components add 3 KB, compressed, to the app's
  code. Speed Insights sends its first measurements soon after the page is
  shown, and the rest when the page is hidden or another page is opened.
- **Photo Location Map** (pdv-in-plm.vercel.app, in Electron): the app loads
  neither there. That application records this app's use in its own
  analytics already, and opens it with the photo's path in the address.
- **Local development and the tests.** The scripts exist on Vercel only. A
  production server elsewhere is asked for `/_vercel/insights/script.js` and
  `/_vercel/speed-insights/script.js`, which it does not have; a development
  server loads Vercel's debug versions, which log to the console and send
  nothing. The browser suite answers both with empty scripts. The scripts
  send nothing in a browser driven by automation anyway (they check
  `navigator.webdriver`).
- **Content blockers.** A blocked script sends nothing, and the app works as
  before. Vercel's path, new for each deployment, is blocked less than GA4's.

## Changes

1. `@vercel/analytics` 2.0.1 and `@vercel/speed-insights` 2.1.0, the latest
   releases. Neither has dependencies or install scripts.
2. `src/analytics/VercelAnalytics.tsx` renders their `<Analytics>` and
   `<SpeedInsights>` components, from `@vercel/analytics/next` and
   `@vercel/speed-insights/next` as Vercel documents for the Pages Router, in
   the standalone app while usage data is sent. `_app.tsx` renders it last.
3. `src/analytics/vercel-analytics.ts`, `beforeSendToVercel`: nothing while usage
   data is off, and the address without the photo's path.
4. The About page's text on usage data, in English and the 41 translations.
5. Enabling Web Analytics in the Vercel project is the maintainer's step
   ([status](./STATUS.md#the-maintainers-step-in-vercel)).

## What must not change

- What is sent to GA4 and to the backends.
- Nothing analytics-related is fetched or sent while usage data is off.
- Photo Location Map's window: nothing of Vercel's is loaded.
- Every screenshot but the About page's, in English and in Japanese.

## Verification

Unit tests for `beforeSendToVercel` and for when the components are rendered;
a browser test of the scripts asked for, of what the app queues for them, and
of the setting turned off and of the app opened with it off; the visual
comparison on macOS/Chrome.

Not covered here: the scripts on Vercel, which exist once the code is deployed
and Web Analytics is enabled; that is checked after the merge.

## Not done

- **Measuring the Web Vitals with the app's own usage data**, through Next.js'
  `useReportWebVitals` and `trackEvent`: every measurement, and no
  allowance, but no view of them without work in the backend or GA4. Worth
  it if the free tier's score turns out too coarse.
- **Custom events in Web Analytics**: Pro only, and the backends have them.
