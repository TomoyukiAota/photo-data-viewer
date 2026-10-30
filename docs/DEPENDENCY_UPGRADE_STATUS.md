# Dependency upgrade status and resume record

Read [DEPENDENCY_UPGRADE_PLAN.md](./DEPENDENCY_UPGRADE_PLAN.md) for scope,
version candidates, validation requirements, and autonomous decision rules.

## Current checkpoint

| Field | Recorded value |
| --- | --- |
| Last updated | 2026-10-31, Asia/Tokyo |
| Phase | Implementation in progress: U00/U01 |
| Implementation authorization | User requested implementation on 2026-10-31 |
| Checkout when plan was written | `feature/write-claude-md-in-english` |
| Starting code SHA | `22d1587a43da038e6f87bc828946b8ad1dcfec23` |
| Latest verified upgrade code SHA | None; current app baseline has not been executed for this project |
| Active work package | U00 / U01 |
| Working-tree changes | Planning documents only; inspect actual Git status on resume |
| Dependency install/version changes | None |
| Agent-owned active processes | None |
| Next action | Refresh targets, install original lockfile, and execute baseline checks |

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
| U00 | in_progress | — | Refresh registry and environment metadata |
| U01 | pending | — | Capture current behavior and both-mode baseline |
| U02 | pending | — | Add and prove regression checks against baseline |
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
