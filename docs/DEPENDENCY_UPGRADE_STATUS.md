# Dependency upgrade status and resume record

Read [DEPENDENCY_UPGRADE_PLAN.md](./DEPENDENCY_UPGRADE_PLAN.md) for scope,
version candidates, validation requirements, and autonomous decision rules.

## Current checkpoint

| Field | Recorded value |
| --- | --- |
| Last updated | 2026-10-31, Asia/Tokyo |
| Phase | Baseline captured; runtime and dependency migration next |
| Implementation authorization | User requested implementation on 2026-10-31 |
| Checkout when plan was written | `feature/write-claude-md-in-english` |
| Starting code SHA | `22d1587a43da038e6f87bc828946b8ad1dcfec23` |
| Latest verified upgrade code SHA | `3594ba5` (baseline harness and portable images) |
| Active work package | U03 / U05 |
| Working-tree changes | Baseline harness, fixtures, screenshots and evidence |
| Dependency install/version changes | Next/React intermediate install complete; not yet accepted |
| Agent-owned active processes | None |
| Next action | Migrate runtime and the coupled Next/React/tooling group, preserving baseline screenshots |

The branch above is an observation, not a command to switch branches or discard
work. Implementation branch: `codex/dependency-upgrades`. Planning files are now being
committed with the initial implementation checkpoint. The starting SHA predates
these files.

## Work package tracker

States: `pending`, `in_progress`, `verified`, `awaiting_external`, or `deferred`.
Use `awaiting_external` only for the affected task; it does not pause independent
work. A deferred task must include the reason, retained version, and release
implications. No row is verified until its declared checks have evidence.

| ID | State | Verified code SHA / evidence | Next action or remaining gate |
| --- | --- | --- | --- |
| U00 | verified | [Baseline](./dependency-upgrade-evidence/BASELINE.md) | Complete locally; external integration gate retained |
| U01 | verified | [Baseline](./dependency-upgrade-evidence/BASELINE.md) | Complete locally; external integration gate retained |
| U02 | verified | [Baseline](./dependency-upgrade-evidence/BASELINE.md) | Complete locally; external integration gate retained |
| U03 | pending | — | Upgrade runtime/CI and verify reproducibility |
| U04 | pending | — | Upgrade independent utility packages |
| U05 | pending | — | Upgrade Next/React intermediate and coupled tools |
| U06 | pending | — | Upgrade and validate HEIF decoder |
| U07 | pending | — | Upgrade map stack and reconcile CSS/SRI |
| U08 | pending | — | Upgrade panes and grid/MUI intermediate |
| U09 | pending | — | Resolve grid barrier, then evaluate React 19/MUI 9 |
| U10 | pending | — | Complete development tools and compatibility probes |
| U11 | pending | — | Review resolved tree, audit, and remaining exceptions |
| U12 | pending | — | Finish accessible validations and final decision packet |
| U13 | pending | — | Only after necessary decisions and actual release authorization |

## Validation record

Planning-time observations are not implementation test results.

| Check | Result | Notes |
| --- | --- | --- |
| Repository inventory | Inspected | 26 runtime + 18 development direct dependencies; two deployment modes |
| Public package metadata and migration constraints | Researched 2026-10-31 | Snapshot is in the plan; refresh at U00 |
| Existing lockfile audit | 61 affected entries reported during research | Critical 4, high 31, moderate 13, low 13; exploitability not established |
| Baseline install / lint / type check / tests | Not run for this upgrade effort | Do not infer a passing baseline from existing CI configuration |
| Baseline standalone and embedded builds / runtime | Not run | Required at U01 |
| Visual regression baseline | Not captured | Required at U01/U02 |
| Actual Vercel project settings and deployed companion versions | Not inspected | Investigate accessible sources before requesting user work |

## User decision and external-action queue

There are **no concrete user decisions ready to request yet**. Research risks
are not themselves permission requests. Resolve what is possible and prepare
the remaining items together at U12.

| ID | Affected tasks | Concrete issue | Agent work/evidence completed | Recommended option and alternatives | Exact user action | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | None prepared yet | — | — | — | — |

## Exceptions to latest versions

No implementation versions have been accepted yet. Candidates such as React 18,
MUI 6, ESLint 9, and TypeScript 6 are research-stage intermediate options, not
accepted permanent exceptions. Record tested exceptions here as work proceeds.

| Package / group | Retained exact version | Newer version evaluated | Reproducible blocker and evidence | Support/security implications | Next opportunity |
| --- | --- | --- | --- | --- | --- |
| — | — | — | None tested yet | — | — |

## Task handoff template

Replace or append this record when work is in progress. Keep it concise enough to
read at every resume. Commands must omit secrets and private machine details.

```text
Timestamp (Asia/Tokyo):
Task ID / state:
Branch / current HEAD:
Last verified code SHA:
Goal of this checkpoint:
Selected exact versions and rationale:
Changed files / unfinished changes:
Commands completed (environment, result, evidence location):
Failure / hypothesis / next discriminating check:
Active command or server (ownership, working directory, safe recovery):
Deferred items and independent work still possible:
One specific next action:
Rollback reference and matching lockfile:
User action needed, if any (otherwise none):
```

## Activity log

- 2026-10-31: Converted the research into a repository-local implementation plan
  with checkpoint/resume rules, bounded work packages, autonomous decisions,
  regression gates, and one consolidated final user decision/action packet.
  No application, dependency, runtime, CI, or deployment changes were made.

- 2026-10-31: User authorized implementation. Created `codex/dependency-upgrades`
  from the inspected starting SHA and began U00/U01.

- 2026-10-31: Resumed after interruption. Both original production builds, lint,
  type checks, scoped unit tests and browser baseline checks completed. Fixtures
  and comparison screenshots are stored in Git. Runtime 26.13.0/npm 12.2.1 installed
  via mise; project selection has not changed yet.

- Node 26.13.0/npm 12.2.1: unit tests and lint pass, but Next 12 build fails
  in bundled jsonwebtoken because Node 26 removes SlowBuffer. Runtime and Next
  must therefore land together. Intermediate migration now targets Next 16.4.3,
  React 18.3.1, MUI 5.18.0, DevExpress 4.0.11, ESLint 9.39.5, TS 5.9.3.

- Intermediate dependencies installed cleanly under Node 26.13.0/npm 12.2.1.
  The old mutually pinned DevExpress lock graph caused ERESOLVE; original lock and
  node_modules were preserved in ignored artifacts, then a fresh lock was resolved
  without force/legacy-peer flags. Lint/types/16 unit tests pass. SSR needed
  transpilePackages for legacy DevExpress ESM imports; build under investigation.

- Intermediate verification: Next 16.4.3, Node 26.13.0/npm 12.2.1, React 18.3.1,
  MUI 5.18.0, DevExpress 4.0.11, libheif 1.23.5 and TypeScript 6.0.3 pass
  lint/type checks/16 unit tests, production build, and all 9 browser tests
  including visual comparison against the original-source baselines. Browser
  comparison allows four isolated rasterization pixels; observed differences were
  at text glyph edges. Leaflet CDN CSS/SRI now matches installed 1.9.4 bytes.
  Next step: checkpoint embedded build, then bounded grid/React19/MUI9 migration.
