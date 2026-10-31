# Dependency upgrade implementation plan

Planning date: 2026-10-31 (Asia/Tokyo).

Execution state: **implementation authorized on 2026-10-31**. The user requested
execution of this plan. Routine implementation, local verification, and reversible
checkpoints are authorized. Production publication has not been requested.

Read [DEPENDENCY_UPGRADE_STATUS.md](./DEPENDENCY_UPGRADE_STATUS.md) first when
resuming. That file records the actual state; this file describes the procedure.
Neither document relies on chat history or machine-specific assistant memory.

## Objective and acceptance criteria

Upgrade repository-managed runtimes, direct and indirect dependencies, build and
test tools, and CI actions as far as compatibility allows. Prefer supported LTS
runtime lines and stable package releases. Preserve application functionality,
appearance, interaction, settings, and both deployment modes.

Internal compatibility changes are allowed during implementation. Preserve the
Pages Router and Webpack initially, including the Electron renderer target,
local-file access, SVG loader, and HEIF loading configuration. A router, bundler,
design system, or application architecture migration is not a prerequisite.

The behavior contract covers:

- All existing pages, navigation, labels, document titles, menus, and dialogs.
- Image loading, loading indicators, rotation, unsupported/corrupt-file behavior,
  EXIF extraction, value formatting, and row ordering.
- Maps, marker placement, zoom, external links, and wide/narrow layout behavior.
- Split-pane sizes and dragging, scrolling, sticky headers, and stored settings.
- Standalone operation and operation inside Photo Location Map, including query
  parameters, local files, and the embedded mode's different visible controls.
- Existing analytics event semantics; test fixtures must not send real events.

Success requires evidence of preserved behavior, not just a successful install or
build. Existing defects are recorded separately; do not silently change them as
part of an upgrade. Snapshot acceptance must not conceal a regression.

Supported browser and deployed Electron versions are not fully documented.
Establish what can be learned from repository history, connected services, and
available app builds. Record remaining uncertainty and continue reversible work.
Do not silently narrow browser support or change a deployed companion app to
make the upgrade pass. Any unresolved support decision belongs in the final
decision packet, with concrete compatibility results and alternatives.

## Working autonomously

Once implementation is requested, independently perform source and release-note
research, dependency resolution, internal compatibility fixes, targeted tests,
visual comparison, local builds, and preparation of reviewable changes. Reuse a
suitable checkout, protect unrelated work, and use `codex/` for a new branch.
Keep related changes in small, reversible commits.

Use these decision rules:

| Situation | Agent action |
| --- | --- |
| Routine API, import, type, test, or configuration migration | Implement and verify without asking the user. |
| New stable release since the research snapshot | Recheck official metadata, select compatible exact versions, and record why. |
| Dependency conflict | Diagnose the complete peer graph; update the coupled group together or use a documented intermediate version. |
| An upgrade fails | Repair it or return the affected task to the last verified version; record the failure and continue independent tasks. |
| A legacy component blocks newer React/MUI | Try a bounded compatibility fix. A small internal replacement is also within scope if it reproduces existing behavior and appearance with regression evidence. |
| A fix would change visible behavior, browser support, licensing/cost, or require substantial long-term fork maintenance | Prepare concrete options and evidence; defer the dependent action to the final packet. |
| A service or device cannot be accessed | First inspect available connectors/tools and public information, complete local substitutes, then record the exact remaining action. |
| A task genuinely depends on a user's unresolved choice | Stop only that dependency chain; continue other authorized work. Never treat silence as approval. |

Do not use blanket `--force`, `--legacy-peer-deps`, `npm audit fix --force`, or
unreviewed bulk upgrade commands to declare compatibility. A specific documented
override can be justified, such as the React 18/MUI 6 `react-is` alignment.
Do not weaken checks or switch off Strict Mode merely to obtain green results.

No additional sub-agents are assumed by this plan. Independent tasks can be
advanced sequentially whenever another task is waiting.

## Checkpoints and interruption recovery

Maintain the status file before starting a task, after a meaningful test result,
after a verified commit, and before an intentional stop. Record the current task,
changed files, selected versions, evidence, failures, and one specific next action.
Do not wait for a whole phase to finish before recording progress.

A verified checkpoint has a code commit, its exact dependency lockfile, the
runtime versions used, completed checks, and evidence locations. Record its SHA
in a subsequent status update; do not try to embed a commit's own SHA in itself.
An unfinished task may remain uncommitted. Clearly distinguish the latest
verified checkpoint from the working tree so interruption never implies that
unfinished code is safe to release.

If the user says to stop, stop starting new work immediately. Save a short
checkpoint if possible; do not keep working to finish a phase. Note any active
agent-owned command or server and whether it is safe to stop. A forced stop may
leave the status file behind the working tree; the resume procedure handles this.

On every resume:

1. Read repository instructions, this plan, and the status file.
2. Inspect branch, HEAD, working-tree changes, and the latest relevant commits.
   Reconcile actual files with the recorded checkpoint. Preserve other work.
3. Inspect any recorded process before restarting it. Do not replay installs,
   commits, deployments, or other stateful actions just because a log ended early.
4. Identify the active task's inputs and last completed check. Re-run checks only
   when inputs/environment changed, results are missing, or a failure needs it.
5. Continue the smallest unblocked next action. If a gate is external, advance
   another task and leave the gate explicitly unresolved.

Use `npm ci` to reconstruct dependencies from an accepted lockfile. Application
and dependency rollback must restore the corresponding code and lockfile
together. Do not use destructive resets to discard unrelated or unfinished work;
use targeted reversal or revert commits when appropriate.

Keep small, sanitized evidence summaries in the repository. Store large rendered
screenshots, videos, and reports as accessible review artifacts, and record stable
links, content hashes, fixture provenance, and reproduction commands. If an
artifact is only local, explicitly mark it as local and regenerate or publish it
to an authorized artifact store before claiming a portable handoff. Do not commit
personal photos, credentials, private service names, build output, or npm caches.

## Work packages and dependencies

Each row is a checkpoint-sized work package or a parent for smaller checkpoints.
Split a row when needed. Keep mutually dependent version changes together.

| ID | Depends on | Work and completion gate |
| --- | --- | --- |
| U00 | Implementation requested | Inspect current checkout and service capabilities, record the starting SHA, refresh official version/peer/support data, freeze candidate versions, and identify deployment triggers and browser/Electron assumptions. |
| U01 | U00 | Reproduce the current application and current lint/tests/type checks; build and run both modes. Record pre-existing failures and capture reference screenshots and behavior using public or synthetic fixtures. |
| U02 | U01 | Add focused regression checks for the behavior contract. Prove they pass against the unchanged application before upgrading it. Keep externally unavailable checks explicit. |
| U03 | U02 | Upgrade runtime and CI infrastructure. Target Node LTS; separate the npm major change. Add explicit type checks and builds for both modes on the existing OS matrix. Verify lockfile reproducibility. |
| U04 | U02 | Update relatively independent utility packages in small groups. Compare date, size, storage, resize, and EXIF ordering results. Add a U03 dependency when a selected package requires the newer runtime. |
| U05 | U03 | Upgrade Next toward the current supported target while retaining Pages Router/Webpack. Use React 18 as an intermediate checkpoint; coordinate React types, Testing Library, React Leaflet 4, and lint dependencies as required. Review each intervening Next major's migration guide. |
| U06 | U03 | Update the HEIF decoder separately. Verify decoded dimensions/orientation/color, loading/failure behavior, repeated loads, memory cleanup, and both build modes. |
| U07 | U05 | Finish Leaflet 1.9, icon compatibility, map types, and CSS/CDN/SRI alignment. Test maps on desktop/narrow layouts and inside the companion app when accessible. |
| U08 | U05 | Upgrade split panes and the existing grid/MUI stack in separate small checkpoints. Try DevExpress 4 with MUI 5.18 then 6.5. Preserve layout/styles/storage and align `react-is` while on React 18. |
| U09 | U07, U08 | Resolve DevExpress's React 19/MUI compatibility barrier with a bounded internal change. If equivalence is proven, move to React 19, MUI 9, React Leaflet 5, and matching types. Otherwise retain a verified intermediate configuration and prepare the remaining decision. |
| U10 | U05 | Finish development tools, including Jest/jsdom, TypeScript, Sass, SVGR, and Prettier. Evaluate ESLint 10 and TypeScript 7 against actual peer/API compatibility. Tool formatting changes stay separate from behavior changes. |
| U11 | U04, U06, U07, U08, U10; U09 resolved or documented as deferred | Inspect the complete resolved dependency tree, audit findings, licenses, browser targets, warnings, bundle/runtime behavior, and reproducible installs. Classify remaining old versions; do not force transitive majors. |
| U12 | U11 | Complete accessible CI and preview/runtime validation for both deployments; prepare the final diff, evidence, remaining user actions, and rollback procedure. No unresolved gate may be described as passed. |
| U13 | U12 and any genuinely required user decisions/actions | Perform only authorized remaining actions and release steps. Run post-release smoke checks if release is requested; record deployed versions and rollback references. |

The table is a dependency graph, not a requirement to wait on every earlier ID.
An inaccessible companion app or cloud setting must not block unrelated upgrades.
For cross-OS/cloud checks that cannot be run yet, record a provisional local
checkpoint and a release gate; do not mark the overall validation complete.

Update candidate versions at U00 and then keep the migration target stable.
Recheck release support and relevant security advisories at U11/U12. Newly
published versions are not a reason to restart already verified work without
assessing relevance.

## Validation procedure

Capture exact commands in the status/evidence records, including environment and
working directory. Initial commands include `npm ci`, `npm run lint`,
`npm test -- --runInBand`, and a standalone `tsc --noEmit` check. Account for the
current TypeScript incremental setting when checking for generated artifacts.

Build the standalone mode with `PDV_IN_PLM` unset and the embedded mode with
`PDV_IN_PLM=True`. Run each production server with the same mode used to build it;
preserve `.next` versus `.next_plm`. Use cross-platform scripts for CI. Build
success alone does not prove Electron local-file integration works.

Regression coverage must include:

| Area | Required comparisons |
| --- | --- |
| Images | JPEG, HEIC/HEIF, no EXIF, no GPS, malformed files, sequential loads, reload, rotation, loading and error states. |
| Values | EXIF values/order, date and clock settings, time zones, file-size units/rounding, coordinate availability including zero values. |
| Layout | Wide/narrow modes including widths 1199/1200/1201, tabs, splitters, sticky headers, scrolling, buttons/icons/typography, dialogs. |
| Persistence | Existing storage keys/values, changed settings, pane positions, reload, standalone and embedded initialization. |
| Maps | Tile and marker loading, photo changes, zoom and movement, resize, external links, narrow-layout tab changes. |
| Integration | Embedded URL parameters, local files, titles, hidden controls, host/browser behavior, duplicate effects or analytics events after React upgrades. |
| Delivery | Development and production execution, both build modes, three CI OSes, agreed browser/Electron matrix, console/runtime errors. |

Use a fixed fixture corpus, viewport, device scale, fonts, locale, time zone, and
browser version for before/after visual comparison. Stabilize map tiles and other
network content. Treat intentional application animation separately from stable
screenshot capture. Investigate differences rather than automatically replacing
reference images. Public/synthetic fixtures must have recorded provenance and
appropriate licenses; do not request private photos when equivalent fixtures work.

Existing unit tests cover only two filename/HEIF classification cases. The
research audit reported 61 affected dependency entries (4 critical, 31 high,
13 moderate, 13 low), not 61 proven exploitable application vulnerabilities.
Re-run and assess applicability at implementation time. Do not promise a zero
audit count merely from selecting latest packages.

## Research snapshot and target inventory

These are candidates observed on 2026-10-31, not a successfully installed or
tested combination. U00 must revalidate them against official registry metadata,
release notes, and the actual checkout. All 44 direct dependencies are covered.

| Package(s) | Current | Candidate / intermediate |
| --- | --- | --- |
| `next` | 12.1.0 | 16.4.3, with migration review through intervening majors |
| `react`, `react-dom` | 17.0.2 | 18.3.1, then 19.3.1 if UI compatibility is proven |
| `@devexpress/dx-react-core`, `@devexpress/dx-react-grid`, `@devexpress/dx-react-grid-material-ui` | 3.0.1 | 4.0.11; product is end-of-life |
| `@mui/material`, `@mui/icons-material` | 5.4.2 | 5.18.0, 6.5.0, then 9.5.0 after grid compatibility work |
| `@emotion/react` | 11.8.1 | 11.14.0 |
| `@emotion/styled` | 11.8.1 | 11.14.1 |
| `@react-hook/debounce` | 4.0.0 | Already latest in snapshot |
| `@react-hook/size` | 2.1.2 | Already latest in snapshot |
| `@react-hook/window-size` | 3.0.7 | 3.1.1 |
| `@rehooks/local-storage` | 2.4.4 | 2.4.5 |
| `classnames` | 2.3.1 | 2.5.1 |
| `dayjs` | 1.10.7 | 1.11.23 |
| `exifr` | 7.1.3 | Already latest in snapshot |
| `filesize` | 8.0.7 | 11.0.29; migrate import and compare formatting |
| `get-file-object-from-local-path` | 1.0.2 | Already latest in snapshot |
| `is-number` | 7.0.0 | Already latest in snapshot |
| `leaflet` | 1.7.1 | 1.9.4 |
| `leaflet-defaulticon-compatibility` | 0.1.1 | 0.1.2 |
| `libheif-js` | 1.19.8 | 1.23.5 |
| `react-leaflet` | 3.2.5 | 4.2.1 with React 18, then 5.0.0 with React 19 |
| `react-reflex` | 4.0.6 | 6.0.2 |
| `sort-keys` | 5.0.0 | 6.0.1 |
| `@svgr/webpack` | 6.2.1 | 8.1.0 |
| `@testing-library/jest-dom` | 5.16.2 | 7.0.1 |
| `@testing-library/react` | 12.1.3 | 16.3.3 with React 18 or 19 |
| `@types/gtag.js` | 0.0.8 | 0.0.20 |
| `@types/is-number` | 7.0.2 | 7.0.5 |
| `@types/leaflet` | 1.7.9 | 1.9.22 |
| `@types/node` | 24.3.0 | 26.6.6 for Node 26; align with selected runtime |
| `@types/react` | 17.0.39 | 18.3.31, then 19.3.0 with React 19 |
| `cross-env` | 7.0.3 | 10.1.0 |
| `eslint` | 8.9.0 | 9.39.5 intermediate; investigate 10.14.0 compatibility |
| `eslint-config-next` | 12.1.0 | 16.4.3, aligned with Next |
| `eslint-config-prettier` | 8.4.0 | 10.1.8 |
| `eslint-plugin-react` | 7.28.0 | 7.37.5; published peer range excludes ESLint 10 |
| `jest` | 27.5.1 | 30.5.2 |
| `npm-check` | 5.9.2 | 6.0.1; assess remaining audit/maintenance issues |
| `prettier` | 2.5.1 | 3.9.10 |
| `sass` | 1.49.8 | 1.107.0 |
| `typescript` | 5.9.2 | 5.9.3, then 6.0.3; latest 7.0.2 has tooling barriers |

Additional direct declarations may be needed: `jest-environment-jsdom` 30.5.2,
`@testing-library/dom` 10.4.2, `@types/react-dom` 18.3.7 or 19.3.0,
and `@types/jest` 30.0.0 or explicit `@jest/globals` imports. If Playwright is
selected for regression coverage, the observed candidate was 1.64.1; verify its
compatibility with the baseline runtime before adopting it.

Infrastructure candidates: Node 26.13.0 LTS (24.22.2 LTS as a possible bridge),
npm 12.2.1 (Node 26.13.0 bundles 11.20.0), mise 2026.10.24, and mise-action
5.2.4. Checkout already uses major v7; the observed latest release was 7.0.1.
The existing `*-latest` CI images float. Vercel supports Node 26.x, but actual
project settings and deployed patch versions have not been inspected.

Important constraints from the research:

- DevExpress Reactive 4.0.11 uses MUI icon internal paths and function
  `defaultProps`; do not equate permissive peers with React 19/MUI 9 compatibility.
- React 18/MUI 6 requires `react-is` alignment. React type upgrades require
  explicit `children`; React 19 also changes JSX namespace usage.
- Next 16 defaults to Turbopack and removes `next lint`; preserve Webpack and
  migrate lint invocation/configuration explicitly.
- Next's ESLint 10 support statement and `eslint-plugin-react`'s published peer
  range do not by themselves establish a valid complete dependency graph.
  ESLint 9 is EOL and must be documented as an intermediate exception.
- The observed `typescript-eslint` support range is `>=4.8.4 <6.1.0`.
  TypeScript 6 changes implicit global types; the current `es5` target and `node`
  module resolution also need migration before TypeScript 7.
- `_document.tsx` separately pins Leaflet CSS 1.7.1 with an SRI hash, while the
  map component imports package CSS. Update these coherently.
- The public companion repository listed Electron 32.0.2 during research. This
  does not identify every distributed app version or authorize updating it.
- The lockfile contains 1,185 dependency entries excluding the root. Update
  transitive packages through supported parent ranges, not independent major
  overrides. Node's bundled components and Next's bundled compiler/build tools
  normally move with their owning packages.
- Demo photo revisions are content references, while fonts, analytics, and map
  services are externally managed. Do not change them to satisfy an artificial
  requirement that every URL or component must have a newer version.

Primary sources to refresh:

- [npm registry](https://registry.npmjs.org/): query each package's dist-tags,
  exact version metadata, engines, peers, and tarball when needed.
- [Node release index](https://nodejs.org/dist/index.json) and
  [Node LTS policy](https://nodejs.org/en/about/previous-releases).
- [Next support policy](https://nextjs.org/support-policy) and
  [Pages Router v16 upgrade guide](https://nextjs.org/docs/pages/guides/upgrading/version-16).
- [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).
- [MUI v6](https://mui.com/material-ui/migration/upgrade-to-v6/),
  [v7](https://mui.com/material-ui/migration/upgrade-to-v7/), and
  [v9](https://mui.com/material-ui/migration/upgrade-to-v9/) migration guides.
- [DevExpress Reactive end-of-life notice](https://js.devexpress.com/React/Documentation/25_1/Guide/React_Components/Migrate_from_DevExtreme_Reactive/).
- [typescript-eslint supported versions](https://typescript-eslint.io/users/dependency-versions/),
  [TypeScript 6](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/),
  and [ESLint support policy](https://eslint.org/version-support/).
- [Jest 30 migration](https://jestjs.io/docs/upgrading-to-jest30),
  [mise-action releases](https://github.com/jdx/mise-action/releases), and
  [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Final user decision and action packet

Collect unresolved items while working. Do not repeatedly ask the user to make
routine technical choices. Before presenting the packet, finish all independent
authorized work and make every pending item concrete and reviewable.

The packet must contain:

1. The implemented version matrix, code/diff or PR reference, verified commit,
   completed checks, comparison evidence, and explicitly unverified environments.
2. One consolidated table of decisions/actions that truly require the user. For
   each: why the agent could not complete it, work already done, the recommended
   option, alternatives and consequences, and exactly what the user must do.
3. Remaining exceptions to latest versions, including support/security status,
   the tested blocker, and what would make a future upgrade possible.
4. A release sequence and rollback reference for each deployment, if release is
   requested. Preserve old deployment identifiers and matching code/lockfiles.

Possible packet items are a browser-support tradeoff, access-dependent Vercel
configuration, or verification in a distributed companion app that is unavailable
to the agent. These are possibilities, not automatic demands for manual work.
If tools and existing authorization allow the agent to resolve an item, do so.
If nothing requires user judgment, report completion without inventing an
approval step. Production publication remains subject to the actual deployment
authorization; do not infer it from this planning request.

Some external prerequisites may be impossible to prepare around. In that case,
finish every independent task and explain the minimum missing input. Do not
claim dependent work is complete, and do not wait indefinitely without a useful
handoff. A user reply may unlock additional work and validation before release.
