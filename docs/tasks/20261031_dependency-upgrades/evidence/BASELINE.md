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

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:947aac8c2d77d9140a665d477502a42e3acf67f90ef0bcf741b32d854a27bbf5 -->

Local raw logs are in ignored `.upgrade-artifacts/baseline-*.log`; portable inputs,
tests, source revision and image references are committed. Use separate checkouts:
the application checkout at `22d1587a43da038e6f87bc828946b8ad1dcfec23` runs
the baseline server, and the harness checkout at `3594ba5` contains the Playwright
tests and configuration. For the current E2E layout and commands, see
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

<!-- /coderabbit-ai-generated:v1 -->

No remote branch push, preview deployment, or production change has occurred.
Installed Photo Location Map reports version 1.12.1; its embedded runtime has not
been exercised against localhost yet. Browser support below Next 16's declared
minimum remains an unresolved release consideration.

Baseline stabilization: screenshots were regenerated from a separate copy of the
original `3594ba5` source/build on port 3300, never from upgraded application code.
Masking uses the bounded Leaflet container (its map pane has zero intrinsic size).
The comparator permits at most four changed pixels per full image: the measured
intermediate difference was two pixels at a text glyph edge, with no layout shift.
This avoids accepting visible styling/layout differences while tolerating isolated
font rasterization noise. All other expectations remain unchanged.
