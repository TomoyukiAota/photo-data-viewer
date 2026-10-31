# Dependency upgrade status and resume record

Last updated: 2026-11-01 (Asia/Tokyo).
Read [the plan](./PLAN.md) and [results](./evidence/RESULTS.md).

## Current checkpoint

- Implementation and validation are complete, including the npm 11.20.0
  follow-up. The user accepted the new browser minimums and selected Node LTS's
  bundled npm on 2026-10-31. Production publication was not requested.
- Branch: `codex/dependency-upgrades`.
- Draft PR: [#63](https://github.com/TomoyukiAota/photo-data-viewer/pull/63).
- Detailed runtime and verification instructions are in
  [DEVELOPMENT.md](../../DEVELOPMENT.md). CONTRIBUTING.md retains its original
  basic setup instructions.
- On 2026-11-01, task documents were grouped in this directory using the original
  start date. All 22 local Markdown links were checked after the move. Application
  source, dependencies and runtime/CI configuration are unchanged by this move.
- Verified application commit: `a8d4ff29c392a9dc28c6e7392913386682b1c3ae`.
  Subsequent checkpoints update agent instructions, E2E organization and hosting
  build configuration; application source is unchanged.
- [Vercel preflight](./evidence/VERCEL_PREFLIGHT.md) confirms
  effective Node 26.13.0, embedded-mode variables and both current production
  alias/deployment mappings. Local development, CI and Vercel now select the
  bundled npm 11.20.0. The separate npm tool and cloud npm download/build override
  are removed; strict script approvals are retained. Inspect current PR checks
  when resuming rather than treating earlier npm 12 runs as npm 11 evidence.
- Verified runtime/configuration checkpoint: `311639f2062280f0cfd96ce9e889bc3401237364`.
  [CI run 248](https://github.com/TomoyukiAota/photo-data-viewer/actions/runs/41208253850)
  passed the full macOS/Linux/Windows matrix. All three job logs and both READY
  Vercel preview logs show Node 26.13.0 / npm 11.20.0, with no npm engine mismatch.
  Preview IDs/links are recorded in the preflight. Production alias mappings are
  unchanged. Subsequent documentation-only checkpoints may have separate checks.
- [CI run 234](https://github.com/TomoyukiAota/photo-data-viewer/actions/runs/41156267381)
  passed on macOS, Linux and Windows, including both builds and production/dev
  browser checks. Both standalone and embedded Vercel preview build checks passed.
- Documentation checkpoint `4aa6c28` also passed the complete three-OS matrix in
  [CI run 236](https://github.com/TomoyukiAota/photo-data-viewer/actions/runs/41156910247).
- Original starting SHA: `22d1587a43da038e6f87bc828946b8ad1dcfec23`.
  Baseline harness: `3594ba5`; React 18 checkpoint: `d9e9fc1`;
  React 19 checkpoint: `96ec189`; upstream merge: `c556404`.
- Integrated upstream main `7db4679`, retaining analytics and opt-out UI changes.
- Test-owned development/reference servers are stopped. No persistent runtime
  process or disposable profile must remain alive to resume.
- Production release remains outside this request. Rollback candidate eligibility
  returns a distinct HTTP 403, and dashboard-only branch/output settings are not
  exposed by the project summaries. These release gates are recorded in the preflight.

## Work packages

| ID  | State                    | Evidence / remaining gate                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------- |
| U00 | verified                 | Official version/peer snapshot, repository and available host runtime inspected |
| U01 | verified                 | Original builds/behavior captured; upstream baseline refreshed separately       |
| U02 | verified                 | 111 current unit tests, 11 browser cases and tracked reference screenshots      |
| U03 | verified                 | Node 26.13.0/bundled npm 11.20.0; clean install, script policy and three-OS CI |
| U04 | verified                 | Utility packages and formatting/persistence regression checks                   |
| U05 | verified                 | Next 16.4.3, Pages Router/Webpack and both build modes retained                 |
| U06 | verified                 | libheif 1.23.5, fixed HEIC dimensions/appearance and Electron loading           |
| U07 | verified                 | Leaflet stack, marker checks, CSS/CDN/SRI alignment                             |
| U08 | verified                 | Splitter drag/persistence and table geometry/screenshots                        |
| U09 | verified                 | React 19.3.1/MUI 9.5.0; equivalent table; new browser minimums accepted         |
| U10 | verified with exceptions | TS 6.0.3 and ESLint 9.39.5; clean newer-version probes fail peers               |
| U11 | verified with exceptions | Full tree valid; 32 moderate/5 low dev-only findings, production audit zero     |
| U12 | verified                 | Bundled-npm three-OS CI, both preview builds and draft PR review packet       |
| U13 | deferred                 | Production publication is outside the current implementation request            |

## Validation and evidence

- Bundled npm follow-up: `mise exec` selects Node 26.13.0 and npm 11.20.0 from
  the Node installation. Clean install, full dependency-tree validation,
  lint/types, all 111 unit tests and both production builds pass. Chrome's 11
  unchanged screenshot cases, WebKit's 11 cases, Firefox's 11 cases and both
  Electron local-file cases pass. Standalone development smoke and both embedded
  development JPEG/HEIC cases also pass. Full three-OS CI and both Vercel preview
  builds pass on the runtime/configuration checkpoint above.
  npm 11's offline script-policy probe confirms unreviewed scripts fail with
  `ESTRICTALLOWSCRIPTS` before execution, approved scripts execute, and explicit
  denials skip execution. Raw local logs use `.upgrade-artifacts/npm11-*`.
  The lockfile differs only in the root npm engine; dependency versions and
  application source are unchanged.
- E2E configurations, browser tests/screenshots, Electron tests and shared fixtures
  are consolidated in `tests/e2e`. Existing npm commands select the moved configs;
  app-server working directories and output paths remain rooted at the repository.
  After the move, lint, 11 Chrome visual cases, two Electron cases and the standalone
  development scenario pass. All 23 moved test/reference/fixture files are byte-identical.
- Clean `mise exec -- npm ci`, complete `npm ls --all`, lint and type checks pass.
- 111 unit tests in 17 suites pass, including integrated upstream analytics tests.
- Standalone and embedded production builds pass locally and on all three CI OSes.
- Chrome: 11 cases pass with original-source screenshot references at six viewport
  widths; map markers/navigation are checked separately from masked map imagery.
- WebKit: 11 functional cases pass. The final About-link migration was subsequently
  covered in Chrome production/dev and three-OS CI.
- Electron 32.0.2: JPEG/HEIC local-file loads, dimensions, titles, URL settings and
  embedded controls pass in production and development. This matches the installed
  companion runtime without modifying that installation or its user data.
- Standalone development navigation/photo smoke passes locally and in three-OS CI.
- Firefox 157.0: all 11 functional cases pass on macOS 27.0.1 with an isolated
  test-owned app-data home. The previous profile-folder startup failure is
  resolved; see [DEVELOPMENT.md](../../DEVELOPMENT.md) for the process-scoped
  reproduction command.
- Tests, public/synthetic fixtures, screenshots, version metadata and summaries
  are committed. Large local logs/runtime copies remain ignored in `.upgrade-artifacts`.

## Version exceptions

| Package    | Retained     | Evaluated latest | Reproduced blocker                                 |
| ---------- | ------------ | ---------------- | -------------------------------------------------- |
| ESLint     | 9.39.5 (EOL) | 10.14.0          | eslint-plugin-react 7.37.5 peers only through ^9.7 |
| TypeScript | 6.0.3        | 7.0.2            | typescript-eslint 8.72.1 requires >=4.8.4 <6.1.0   |

The audit refresh reports 32 moderate and 5 low entries, all development-only,
from glob/minimatch and deepmerge. Both npm 11 and npm 12 reproduce these counts
on the unchanged dependency graph; production audit remains zero, with no
high/critical findings. Current parent-tool ranges exclude the patched
glob/minimatch majors. No forced graph or obsolete tool major rollback was
applied; see the results for advisory links and recheck upstream fixes later.

## Resolved user decision

On 2026-10-31 the user accepted the new browser minimums, retaining the implemented
Next/MUI versions. This resolves the final policy decision:

| Decision        | Accepted policy                                               | Validation limits                                                                                                                                     |
| --------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser support | Chrome 117+, Edge/Firefox 121+, Safari 17+ (macOS/iOS/iPadOS) | Current Chrome/WebKit/Firefox/Electron functional checks and Chrome screenshot checks pass; historical browser versions were not individually tested. |

[MUI 9's supported platforms](https://mui.com/material-ui/getting-started/supported-platforms/)
are stricter than Next 16's. Older browsers fall outside the accepted range;
the support-policy change is intentional even though the tested UI/functionality
matches. The accepted minimums are also documented in the README.

On the same date, the user selected Node LTS's bundled npm for local development,
CI and Vercel: Node 26.13.0 / npm 11.20.0. npm will not be upgraded independently
without a concrete compatibility or security need. Preserve strict install-script
approvals and revalidate the selected bundle when updating Node.

No main merge or production publication was performed. The preflight records
inspected settings, existing deployment IDs and the remaining dashboard/rollback
permission gates. Resolve those gates before any later authorized release and
follow the results document's release/rollback procedure.

## Resolved implementation issues

- Firefox's macOS app-data lookup failed before navigation even with a fresh
  profile. A command-scoped `CFFIXED_USER_HOME` pointing to a test-owned directory
  isolates browser data and restores startup. All 11 functional cases pass;
  raw evidence is `.upgrade-artifacts/firefox-isolated-e2e.log`.
- Windows PowerShell stripped `npm test -- --runInBand` argument forwarding.
  An explicit `test:ci` script removes forwarding and passes the complete matrix.
- Current Next development rejected the upstream nested About Link/anchor. The
  modern Link form preserves the rendered link and passes navigation checks.
- Next 16 development TrustedScript eval wrappers did not bootstrap in Electron 32. Omitting that Webpack output option only in embedded development restores
  module evaluation; production defaults are unchanged. JPEG/HEIC both pass.

## Resume procedure

Inspect Git status/log and current PR/CI state before repeating installs or
builds. The runtime/configuration checkpoint above has full successful CI; later
documentation commits may have their own runs. Read evidence first and preserve
unrelated work. Browser support and the bundled-npm policy are accepted. Check
current preview/CI results and the preflight's remaining release gates before
choosing a next action.
Restore code, lockfile and runtime settings together when rolling back. Keep
production release separate from this implementation request.
