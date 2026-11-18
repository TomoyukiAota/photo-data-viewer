# Opened as the installed app: status

Started on 2026-11-18, a follow-up of the
[installable app](../20261118_installable-app/STATUS.md#follow-ups). The
maintainer wanted the usage data to tell whether the app was opened as the
installed app: Chrome's and Edge's window of the app, or an iPhone's or
iPad's Home Screen.

## Current state

Implemented and verified locally.

- `Page Loaded`, sent once per page load, has a field `displayMode`
  (`src/analytics/display-mode.ts`): the `display-mode` media feature as it
  is when the page loads. `standalone` is the installed app's window and the
  Home Screen; Safari's own `navigator.standalone` says the same on iPhone and
  iPad. `browser` is a tab, `fullscreen` the browser's full screen,
  `minimal-ui` and `window-controls-overlay` the other modes of an installed
  app, and `unknown` a browser that answers none.
- GA4 receives it as the parameter `display_mode` of `page_loaded`, and the
  analytics backend in the label. A visit's other events can be told apart by
  their session: the backend's `session_id`, and a session's segment in GA4.

## Decisions

- **A field of `Page Loaded`, not an event of its own**: the event is sent
  once per page load already, with what the app is viewed with (the screen,
  the viewport), and opening the installed app is one more of those.
- **The mode at the load only.** What the window is made into after it is
  opened, such as the browser's full screen, does not change how the app was
  opened, and is not recorded.
- **"Send usage data"**: the field goes with `Page Loaded`, which is sent only
  while usage data is sent, as every event is.
- **Photo Location Map's window**: the field is left out there. The app is
  always opened in that application's window, never as the installed app.
- **The About page** is not changed, as the maintainer decided: like the
  screen and the viewport, which it does not name either, the mode is part of
  what the app is viewed with.

## GA4

A parameter of an event is shown in GA4's reports once it is registered as a
custom dimension, and from then on: **Admin**, **Data display**, **Custom
definitions**, **Create custom dimension**, with the dimension name
`Display mode`, the scope **Event** and the event parameter `display_mode`.
Explorations can then break `page_loaded` down by it.

## Vercel Web Analytics

It cannot tell the installed app apart on the Hobby plan.

- Custom events, which could carry the mode, are for Pro and Enterprise
  ([custom events](https://vercel.com/docs/analytics/custom-events)).
- UTM parameters, which a `start_url` of the manifest could carry, are shown
  with Web Analytics Plus only, a Pro add-on
  ([filtering](https://vercel.com/docs/analytics/filtering)). They would also
  mark the first page of a launch only.
- The page's address could be changed in `beforeSendToVercel`, but to an
  address of no page, which every panel would then show.
- Page views can carry the values of feature flags found in the page, a beta
  on every plan
  ([flags in Web Analytics](https://vercel.com/docs/flags/observability/web-analytics)).
  The mode is not a feature flag, its panel would show it as one, and the
  script would load one more module from Vercel to read it. Not done.

## Verification

Unit tests of `displayMode` and of `Page Loaded` with and without the field;
a browser test that loads the app in a tab, where Chromium answers `browser`,
and again with the media query answered as the installed app's window
answers it, as neither Playwright nor the DevTools protocol emulates the
feature (`Emulation.setEmulatedMedia` leaves it `browser`).

Not verified: the installed app itself, on Chrome, Edge, iPhone and iPad;
that is for a person once this is deployed.
