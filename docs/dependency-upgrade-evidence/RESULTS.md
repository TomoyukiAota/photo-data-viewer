# Dependency upgrade results

Implementation branch: `codex/dependency-upgrades`.
Starting application: `22d1587`; upstream integration baseline: `7db4679`.
Exact package versions are recorded in [IMPLEMENTED_VERSIONS.json](./IMPLEMENTED_VERSIONS.json)
and the committed lockfile. Research metadata is in [registry-snapshot.json](./registry-snapshot.json).

## Implemented changes

- Node 26.13.0 LTS with bundled npm 11.20.0, Next 16.4.3, React/React DOM 19.3.1,
  MUI 9.5.0, TypeScript 6.0.3, Jest/jsdom 30.5.2, current compatible
  supporting packages, and current CI actions/mise.
- Retained Pages Router, Webpack, both output directories, Electron renderer
  targeting, local-file integration, SVG loading, and HEIF WASM lazy loading.
- Replaced the unsupported DevExpress grid with the same read-only two-column
  table. Column widths, padding, typography, overflow, empty-state centering and
  computed header positioning match the original implementation.
- Migrated the upstream About link to the current Next Link API, preserving the
  rendered anchor and its navigation. A development-mode CI smoke check covers it.
- For embedded development only, omit the new Webpack TrustedScript wrapper:
  Electron 32 treats eval(TrustedScript) as a no-op, preventing Next dev bootstrap.
  Production keeps Next's default Trusted Types configuration.
- Migrated React types and nullable element refs, hydration initialization and
  pane-size keyed map remounts. Existing settings keys and visible behavior remain.
- Updated both Leaflet package CSS and CDN CSS/SRI to byte-matching 1.9.4.
- Migrated Next lint to flat ESLint configuration, added explicit type checks,
  limited Jest discovery to app sources, and made jsdom/types/test dependencies
  explicit. No lint rules or Strict Mode were disabled to pass validation.
- Removed npm-check (unmaintained dependencies with high/moderate audit findings);
  `npm run check` now uses npm's own `outdated --long` command.
- Integrated upstream analytics/opt-out changes, retaining their functionality.
- Consolidated both Playwright configurations and browser/Electron suites under
  `tests/e2e`, with shared fixtures and browser screenshot references. Existing npm
  commands remain the entry points; app-server working directories and result
  paths explicitly resolve from the repository root. Both configurations are linted.
- Follow the selected Node LTS release's bundled npm in local development, CI and
  Vercel. The independent npm mise entry and cloud npm download/build override
  are removed. `vercel.json` logs versions and runs the existing `npm ci`.
  Version-specific `allowScripts` approvals remain; `.npmrc` enables
  `strict-allow-scripts` so npm 11 rejects unreviewed dependency install scripts.

## Local verification

macOS arm64, Node 26.13.0 and bundled npm 11.20.0. The checks below were repeated
after npm alignment. Earlier application checkpoints used npm 12.2.1; current
remote validation is recorded in the status file and PR checks.

The npm 11 follow-up confirms that only the root lockfile's npm engine changed;
every dependency entry is identical. A separate offline fixture exercises the
actual npm lifecycle policy: unreviewed scripts fail with `ESTRICTALLOWSCRIPTS`
before execution; an explicit approval runs the fixture's marker-writing script;
an explicit denial skips it. File/tarball approvals use npm's resolved-source
identity. The application's two registry-package approvals remain version-pinned.
Raw local probe evidence is `.upgrade-artifacts/npm11-script-policy/validation.log`.

- Clean `npm ci`, complete `npm ls --all`, lint and TypeScript checks pass.
- 111 unit tests across 17 suites pass, including upstream analytics tests.
- Standalone and embedded production builds pass. Both development modes also
  pass navigation/photo smoke checks, including Electron JPEG/HEIC local loads.
- Following the E2E directory move: lint, 11 Chrome cases with unchanged screenshot
  references, both Electron JPEG/HEIC cases and standalone development smoke pass.
  All 23 moved test/helper/fixture/reference files are byte-for-byte unchanged.
- Chrome: all 11 browser cases pass with the original-source screenshot references.
  At most four isolated rasterization pixels are allowed per image; visible layout
  changes are not accepted. The Leaflet container is masked; map markers and
  navigation are asserted independently.
- WebKit: all 11 functional browser cases pass.
- Electron 32.0.2 (same runtime as installed companion version 1.12.1): JPEG and
  HEIC local-file loading, title, dimensions, hidden standalone controls, and URL
  date/clock settings pass in isolated test profiles.
- Firefox 157.0: all 11 functional browser cases pass on macOS 27.0.1. The initial
  profile-folder startup failure persisted with a separate TMPDIR; a process-scoped
  `CFFIXED_USER_HOME` pointing to a test-owned directory restored startup and
  allowed the complete suite to pass. This matches the app-data lookup problem in
  [the upstream report](https://github.com/microsoft/playwright/issues/42768).
  See CONTRIBUTING.md for reproduction; raw local evidence is
  `.upgrade-artifacts/firefox-isolated-e2e.log`. Chrome screenshot references are
  not used for cross-engine pixel comparisons.

The original baseline is `3594ba5`. After merging newer main, reference captures
were refreshed from **upstream application code and old dependencies**, served on
port 3300 in an isolated copy. Only Settings/About references changed. A temporary
`experimental.esmExternals: false` setting was required to run Next 12 SSR in that
copy; application components and dependency versions were not changed there.
Analytics endpoints are intercepted during browser tests; isolated Electron tests
have no companion analytics listener and do not send events to its service.

Tracked fixtures, screenshots and commands make checks reproducible. Raw local
logs are in ignored `.upgrade-artifacts`; the PR links remote CI evidence.

## Remote verification

Application commit `a8d4ff29c392a9dc28c6e7392913386682b1c3ae` passed
[CI run 234](https://github.com/TomoyukiAota/photo-data-viewer/actions/runs/41156267381)
on macOS, Linux and Windows. Each job installs the pinned runtime/dependencies,
runs lint/types/unit tests, builds standalone and embedded modes, and runs Chrome
production regression plus development navigation/photo smoke checks.

Both [standalone Vercel preview](https://vercel.com/tomoyukiaotas-projects/photo-data-viewer/6LAv9PPg39Fh4U88hqY8ZKsLNavK)
and [embedded Vercel preview](https://vercel.com/tomoyukiaotas-projects/pdv-in-plm/ER9P7PUTdNkwB7XT1Cr6aFBefBYB)
build checks succeeded for that application commit. These are preview build checks,
not a production promotion or an inspection of production project settings.
The reviewable implementation is in [draft PR #63](https://github.com/TomoyukiAota/photo-data-viewer/pull/63).

## Remaining version and audit exceptions

- ESLint 9.39.5: a clean dependency-resolution probe with ESLint 10.14.0 fails
  because eslint-plugin-react 7.37.5 publishes peers through `^9.7`. The project
  uses no force/legacy-peer flags. ESLint 9 is EOL; retry after the plugin stack
  declares/validates support for 10, or evaluate a separate tooling migration.
- TypeScript 6.0.3: a clean probe with TypeScript 7.0.2 fails because the current
  typescript-eslint 8.72.1 peer range is `>=4.8.4 <6.1.0`. The Next lint stack uses
  it. Do not bypass this declaration by forcing the native compiler into tools
  expecting the earlier compiler API.
- The 2026-10-31 audit refresh reports **37 development-only entries: 32 moderate,
  5 low, zero high/critical**. Production audit remains zero. Earlier checkpoints
  reported seven low entries. The refreshed count includes two advisories
  published at 2026-10-30 23:09 UTC:
  [glob cancellation bypass](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)
  and [minimatch denial of service](https://github.com/advisories/GHSA-g3hv-75wg-m249).
  Both npm 11.20.0 and npm 12.2.1 reproduce the same counts on the unchanged
  dependency graph. Patched glob 14.0.2+ and minimatch 11.0.1+ fall outside ranges
  used by the current Jest/ESLint stack; no forced transitive major overrides or
  obsolete parent-tool downgrades were applied. The low deepmerge advisory also
  remains in current Jest/SVGR, with latest deepmerge 4.3.1 still affected.
  Recheck compatible upstream fixes before a later release.
- Packages such as exifr, is-number and the local-file helper were already at
  their published latest version. No application behavior was replaced merely
  because their release dates are old.

## Release review and rollback

No production publication or main-branch merge is part of this implementation.
On 2026-10-31 the user accepted the new supported browser minimums:
**Chrome 117+, Edge/Firefox 121+, and Safari (macOS/iOS/iPadOS) 17+**.
This resolves the final policy decision and retains the implemented Next/MUI
versions. MUI 9's minimums are stricter than Next 16's.
See [MUI's supported platforms](https://mui.com/material-ui/getting-started/supported-platforms/).
The old framework/UI stack supported older browsers. Tests cover current Chrome/
WebKit and Electron 32, not every historical browser. Older iOS devices such as
those limited to Safari 15 are outside the accepted range. This intentional
support-policy change is documented in the README; browser coverage is not
described as unchanged.

The [Vercel preflight](./VERCEL_PREFLIGHT.md) confirmed that package engines override
both projects' Node 22.x defaults: previews use Node 26.13.0. Embedded mode has
`PDV_IN_PLM=True` in all three environments. The selected policy aligns the local,
CI and preview npm with Node's bundled 11.20.0. `vercel.json` logs the versions and
runs `npm ci` with the existing npm; the default build command is retained.
Current PR checks record validation. The existing project-specific output
configuration is retained. Actual production project settings were not changed.
Vercel may roll forward patches within 26.x.

Current production aliases and retained READY deployment IDs are recorded in the
preflight. Rollback candidate eligibility returned HTTP 403; execution permission
and dashboard-only branch/output switches remain unverified. These are release
gates, not successful checks. No production promotion or rollback was performed.

Rollback code and lockfile together to the prior deployed revision and restore
that revision's Node/npm settings. Preserve each project's old deployment ID and
promote the prior deployment if a release needs rollback. The upgrade's original
baseline is `3594ba5`; use the actual prior deployed SHA (which may contain newer
upstream work) for production rollback, rather than discarding intervening work.

## Reproduction

```sh
mise install
mise exec -- npm ci
mise exec -- npm run test:all
mise exec -- npm run build
mise exec -- npm run build:plm
mise exec -- npx playwright install chromium webkit
PDV_CHROME=1 PDV_VISUAL=1 mise exec -- npm run test:e2e
PDV_BROWSER=webkit mise exec -- npm run test:e2e
# Optional matching Electron runtime, kept outside app dependencies:
PDV_ELECTRON_PATH=/absolute/path/to/Electron mise exec -- npm run test:electron
```

The browser suites own their servers and do not reuse existing servers. This
prevents a server from retaining an old build manifest after a rebuild. Baseline
comparison against another server is explicit through `PDV_BASE_URL`.
