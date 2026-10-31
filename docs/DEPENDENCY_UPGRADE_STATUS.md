# Dependency upgrade status and resume record

Last updated: 2026-10-31 (Asia/Tokyo).
Read [the plan](./DEPENDENCY_UPGRADE_PLAN.md) and [results](./dependency-upgrade-evidence/RESULTS.md).

## Current checkpoint

- Authorized implementation and independent validation are complete. The user
  accepted the new browser minimums on 2026-10-31; no policy decisions remain.
  Production publication was not requested.
- Branch: `codex/dependency-upgrades`.
- Draft PR: [#63](https://github.com/TomoyukiAota/photo-data-viewer/pull/63).
- Verified application commit: `a8d4ff29c392a9dc28c6e7392913386682b1c3ae`.
  Subsequent checkpoint changes update documentation only.
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
- No implementation work or user decisions are pending. A main merge or production
  publication remains outside this request.

## Work packages

| ID  | State                    | Evidence / remaining gate                                                       |
| --- | ------------------------ | ------------------------------------------------------------------------------- |
| U00 | verified                 | Official version/peer snapshot, repository and available host runtime inspected |
| U01 | verified                 | Original builds/behavior captured; upstream baseline refreshed separately       |
| U02 | verified                 | 111 current unit tests, 11 browser cases and tracked reference screenshots      |
| U03 | verified                 | Node 26.13.0/npm 12.2.1, reproducible install and three-OS CI                   |
| U04 | verified                 | Utility packages and formatting/persistence regression checks                   |
| U05 | verified                 | Next 16.4.3, Pages Router/Webpack and both build modes retained                 |
| U06 | verified                 | libheif 1.23.5, fixed HEIC dimensions/appearance and Electron loading           |
| U07 | verified                 | Leaflet stack, marker checks, CSS/CDN/SRI alignment                             |
| U08 | verified                 | Splitter drag/persistence and table geometry/screenshots                        |
| U09 | verified                 | React 19.3.1/MUI 9.5.0; equivalent table; new browser minimums accepted         |
| U10 | verified with exceptions | TS 6.0.3 and ESLint 9.39.5; clean newer-version probes fail peers               |
| U11 | verified                 | Full tree valid; 7 low dev-only findings, production audit zero                 |
| U12 | verified                 | Three-OS CI, draft PR and final review packet                                   |
| U13 | deferred                 | Production publication is outside the current implementation request            |

## Validation and evidence

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
- Firefox: Playwright Nightly cannot create/find its profile before navigation;
  a separate TMPDIR retry also failed. Firefox execution remains unverified.
- Tests, public/synthetic fixtures, screenshots, version metadata and summaries
  are committed. Large local logs/runtime copies remain ignored in `.upgrade-artifacts`.

## Version exceptions

| Package    | Retained     | Evaluated latest | Reproduced blocker                                 |
| ---------- | ------------ | ---------------- | -------------------------------------------------- |
| ESLint     | 9.39.5 (EOL) | 10.14.0          | eslint-plugin-react 7.37.5 peers only through ^9.7 |
| TypeScript | 6.0.3        | 7.0.2            | typescript-eslint 8.72.1 requires >=4.8.4 <6.1.0   |

Seven low audit entries trace to one deepmerge advisory in current Jest/SVGR;
latest deepmerge remains affected. No forced graph or obsolete tool major
rollback was applied. Production audit has zero findings; critical/high/moderate
findings are zero across the entire tree.

## Resolved user decision

On 2026-10-31 the user accepted the new browser minimums, retaining the implemented
Next/MUI versions. This resolves the final policy decision:

| Decision        | Accepted policy                                               | Validation limits                                                                                                                                             |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser support | Chrome 117+, Edge/Firefox 121+, Safari 17+ (macOS/iOS/iPadOS) | Current Chrome/WebKit/Electron and screenshot checks pass; historical browser versions were not individually tested. Local Firefox launch remains unverified. |

[MUI 9's supported platforms](https://mui.com/material-ui/getting-started/supported-platforms/)
are stricter than Next 16's. Older browsers fall outside the accepted range;
the support-policy change is intentional even though the tested UI/functionality
matches. The accepted minimums are also documented in the README.

No main merge or production publication was performed. If release is later
requested, the agent should inspect actual Vercel project settings, preserve old
deployment IDs and follow the results document's release/rollback procedure;
this is future release work, not a request for the user to perform it now.

## Resolved implementation issues

- Windows PowerShell stripped `npm test -- --runInBand` argument forwarding.
  An explicit `test:ci` script removes forwarding and passes the complete matrix.
- Current Next development rejected the upstream nested About Link/anchor. The
  modern Link form preserves the rendered link and passes navigation checks.
- Next 16 development TrustedScript eval wrappers did not bootstrap in Electron 32. Omitting that Webpack output option only in embedded development restores
  module evaluation; production defaults are unchanged. JPEG/HEIC both pass.

## Resume procedure

Inspect Git status/log and current PR/CI state before repeating installs or
builds. The application commit above has full successful CI; later documentation
commits may have their own runs. Read evidence first and preserve unrelated work.
Browser support is accepted and no further implementation is currently pending.
Restore code, lockfile and runtime settings together when rolling back. Keep
production release separate from this implementation request.
