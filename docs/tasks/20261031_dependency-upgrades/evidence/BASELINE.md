# Baseline verification (2026-10-31)

Application source: `22d1587a43da038e6f87bc828946b8ad1dcfec23`.
Environment: macOS arm64, Node 24.6.0, npm 11.5.1, installed Chrome headless.
`npm ci`, lint, type checking, standalone build and embedded build passed.
Original Jest discovery included unrelated `.claude/worktrees` copies (99 tests).
Restricting roots to `src` correctly selected the application's original 2 tests.
Added regression checks pass for 16 unit cases and browser operations/screenshots.
The browser suite covers six viewport widths, JPEG metadata, tabs, rotation,
splitter/settings persistence, navigation/demo, malformed images, and HEIF decoding.
The fixed HEIF input decodes to 3024 x 4032 in the baseline (orientation applied).

Tracked PNG baselines are captured from the original production build. Map panes
are masked because Leaflet's movement is animated; marker existence is asserted.
Remote tiles and GA are isolated. Roboto remains loaded identically in both builds;
Next 12 inlines the Google font CSS whereas Next 16 uses the stylesheet request.
Visual comparison is opt-in (`PDV_VISUAL=1`) on the same OS/browser. Functional
checks run without platform-specific image comparison on CI.

Local raw logs are in ignored `.upgrade-artifacts/baseline-*.log`; portable inputs,
tests, source revision and image references are committed. The following commands
reproduce the initial baseline suite, before stabilization. Use separate checkouts:
the application checkout at `22d1587a43da038e6f87bc828946b8ad1dcfec23` runs
the baseline server, and the harness checkout at `3594ba5` contains the original
Playwright tests and references. For the current E2E layout and commands, see
[DEVELOPMENT.md](../../../DEVELOPMENT.md).

```sh
# In the application checkout at 22d1587a43da038e6f87bc828946b8ad1dcfec23:
npm ci
npm run build
npm start -- -p 3200

# In another terminal, in the harness checkout at 3594ba5, with Chrome installed:
npm ci
PDV_CHROME=1 PDV_VISUAL=1 npx playwright test --config playwright.config.mjs
```

The harness configuration targets the baseline server at `http://127.0.0.1:3200`.

No remote branch push, preview deployment, or production change has occurred.
Installed Photo Location Map reports version 1.12.1; its embedded runtime has not
been exercised against localhost yet. Browser support below Next 16's declared
minimum remains an unresolved release consideration.

## Stabilized comparison

The intermediate application and matching Playwright harness are at
`d9e9fc1abbf9c7c16b7edd0c94dd7794e677e889`. Its
`tests/e2e/snapshots/` contains the references used by that harness. These were
regenerated from the original application at `3594ba5`, served separately on port
3300, rather than from the upgraded application. The harness masks the bounded
Leaflet container and allows at most four changed pixels per image. The recorded
intermediate difference was two pixels at a text glyph edge, with no layout shift.

To reproduce the intermediate comparison on the recorded macOS/Chrome environment,
use a checkout at `d9e9fc1abbf9c7c16b7edd0c94dd7794e677e889` with its declared
Node 26.13.0 and npm 12.2.1. Close other servers on port 3200 first:

```sh
npm ci
npm run build
PDV_CHROME=1 PDV_VISUAL=1 npx playwright test --config playwright.config.mjs
```

The harness starts the intermediate application on port 3200 and compares it to
its committed references. It does not need the original server to be running.
