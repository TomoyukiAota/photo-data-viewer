# Dependency upgrade status and resume record

Last updated: 2026-10-31 (Asia/Tokyo).
Read [the plan](./DEPENDENCY_UPGRADE_PLAN.md) and [results](./dependency-upgrade-evidence/RESULTS.md).

## Current checkpoint

- Implementation is authorized and locally verified; remote CI/review preparation is active.
- Branch: `codex/dependency-upgrades`.
- Original starting SHA: `22d1587a43da038e6f87bc828946b8ad1dcfec23`.
- Baseline harness commit: `3594ba5`; React 18 checkpoint: `d9e9fc1`;
  React 19 checkpoint: `96ec189`; latest upstream merge: `c556404`.
- Integrated upstream main `7db4679`, retaining analytics and opt-out UI changes.
- Application code at `c556404` passed 111 unit tests, builds and browser checks;
  current pending changes are final tests/evidence/CI checkpoint files.
- Next action: commit final evidence, push the implementation branch, create a
  draft PR and inspect the three-OS CI results. Fix concrete failures autonomously.
- No production publication or main-branch merge has been requested.

## Work packages

| ID | State | Evidence / remaining gate |
| --- | --- | --- |
| U00 | verified | Official version/peer snapshot, repository and available host runtime inspected |
| U01 | verified | Original builds/behavior captured; upstream baseline refreshed separately |
| U02 | verified | 111 current unit tests, 11 browser cases and tracked reference screenshots |
| U03 | verified locally | Node 26.13.0/npm 12.2.1 and reproducible install; remote OS matrix pending |
| U04 | verified | Utility packages and formatting/persistence regression checks |
| U05 | verified | Next 16.4.3, Pages Router/Webpack and both build modes retained |
| U06 | verified | libheif 1.23.5, fixed HEIC dimensions/appearance and Electron loading |
| U07 | verified | Leaflet stack, marker checks, CSS/CDN/SRI alignment |
| U08 | verified | Splitter drag/persistence and table geometry/screenshots |
| U09 | verified | React 19.3.1/MUI 9.5.0; unsupported grid replaced with equivalent table |
| U10 | verified with exceptions | TS 6.0.3 and ESLint 9.39.5; clean newer-version probes fail peers |
| U11 | verified locally | Full tree valid; 7 low dev-only findings, production audit zero |
| U12 | in_progress | Remote CI and final review packet |
| U13 | deferred | Production publication is outside the current implementation request |

## Validation and evidence

- `mise exec -- npm ci`: pass from the committed lockfile.
- `mise exec -- npm ls --all`: pass, no invalid dependency tree.
- Lint, type check, 111 unit tests in 17 suites: pass after upstream integration.
- Standalone and embedded production builds: pass.
- Chrome with before/after images: 11 cases pass against old-dependency upstream UI.
- WebKit functional regression: 11 cases pass.
- Isolated Electron 32.0.2: JPEG/HEIC local-file loads, dimensions, titles, URL
  settings and embedded controls pass. This matches the installed companion's
  runtime; it does not change that installation or its user data.
- Firefox: Playwright Nightly cannot create/find its profile before navigation;
  separate TMPDIR retry failed too. This is explicitly not a passing result.
- Large raw logs are local in ignored `.upgrade-artifacts`. Portable tests,
  fixtures, screenshots, version metadata and summaries are committed.
- All test-owned temporary servers are stopped by their suites. A reference Next
  12 server may remain on port 3300 until final cleanup; inspect ownership before
  stopping it. Never reuse a stale server after rebuilding its output directory.

## Version exceptions

| Package | Retained | Evaluated latest | Reproduced blocker |
| --- | --- | --- | --- |
| ESLint | 9.39.5 (EOL) | 10.14.0 | eslint-plugin-react 7.37.5 peers only through ^9.7 |
| TypeScript | 6.0.3 | 7.0.2 | typescript-eslint 8.72.1 requires >=4.8.4 <6.1.0 |

Seven low audit entries trace to one deepmerge advisory in current Jest/SVGR;
latest deepmerge remains affected. No unsafe forced graph or obsolete tool
major downgrade was applied. Production audit has zero findings.

## Consolidated release review packet

There are no missing user inputs blocking the local implementation. Before a
production release, review these concrete items together:

| Item | Agent work already complete | Remaining decision/action |
| --- | --- | --- |
| Browser support | Current Chrome/WebKit and companion-compatible Electron checks; official Next minimums documented | Confirm whether Chrome/Edge/Firefox 111+ and Safari 16.4+ meet the intended support policy; Firefox execution remains unverified locally |
| Deployment | Engines declare Node 26.x; both Webpack production builds pass; existing embedded distDir/mode retained | If publishing is requested, inspect actual Vercel project settings and preserve old deployment IDs before promotion |

No production settings were edited. See the results document for exact version
inventory, known limits, reproduction commands and rollback steps. Independent
work must continue while an external CI check is pending.

## Resume procedure

Inspect Git status and log, reconcile them with this record, then inspect the
current PR/CI state before repeating an install/build/push. Read current evidence
before rerunning successful checks. Preserve unrelated changes and restore code
and lockfile together when reverting a failed upgrade. Test-only profiles and
artifacts are local and do not need to be kept alive to resume.

CI follow-up: Linux passed all checks. Windows PowerShell stripped npm argument
forwarding (`npm test -- --runInBand`), so added an explicit `test:ci` script and
updated CI/test:all to call it without forwarded arguments. App tests did not run
on that first Windows attempt; this is not being classified as a test pass.

Development verification follow-up: standalone dev navigation exposed an old
Next Link-with-anchor pattern introduced by newer main. Migrated that one link
without changing its appearance, and added a dev-mode CI smoke scenario. Embedded
production checks pass, but embedded dev bootstrap is under investigation; a
Webpack global-object compatibility setting is currently being tested. Do not
mark the current working tree fully verified until this is resolved or explicitly
reported with evidence.

Embedded development issue resolved: Next 16 enables Webpack TrustedScript eval
wrappers, which Electron 32 does not evaluate. Omitting that output option only
for embedded development restores bootstrap. Both JPEG/HEIC dev checks pass;
production retains its existing default. The earlier globalObject experiment was
removed. Standalone dev navigation also passes after the current Link migration.
CI on commit 229564b passed macOS/Linux/Windows; rerunning for these final fixes.

Final local verification after development fixes: 111 tests, lint/types, both
production builds, 11 Chrome visual/browser cases and 2 Electron production cases
pass. Both standalone and embedded development scenarios pass too. The same
standalone development smoke command used by CI has also passed locally.
