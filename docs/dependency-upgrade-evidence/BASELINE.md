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
External font CSS, remote tiles and GA are isolated for deterministic comparisons.
Visual comparison is opt-in (`PDV_VISUAL=1`) on the same OS/browser. Functional
checks run without platform-specific image comparison on CI.

Local raw logs are in ignored `.upgrade-artifacts/baseline-*.log`; portable inputs,
tests, source revision and image references are committed. Reproduce with:

```sh
npm ci
npm run build
npm start -- -p 3200
# In another terminal, with Chrome installed:
PDV_CHROME=1 PDV_VISUAL=1 npx playwright test
```

No remote branch push, preview deployment, or production change has occurred.
Installed Photo Location Map reports version 1.12.1; its embedded runtime has not
been exercised against localhost yet. Browser support below Next 16's declared
minimum remains an unresolved release consideration.
