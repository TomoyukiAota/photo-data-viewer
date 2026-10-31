# Dependency upgrade results

Implementation branch: `codex/dependency-upgrades`.
Starting application: `22d1587`; upstream integration baseline: `7db4679`.
Exact package versions are recorded in [IMPLEMENTED_VERSIONS.json](./IMPLEMENTED_VERSIONS.json)
and the committed lockfile. Research metadata is in [registry-snapshot.json](./registry-snapshot.json).

## Implemented changes

- Node 26.13.0 LTS, npm 12.2.1, Next 16.4.3, React/React DOM 19.3.1,
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

## Local verification

macOS arm64, Node 26.13.0, npm 12.2.1:

- Clean `npm ci`, complete `npm ls --all`, lint and TypeScript checks pass.
- 111 unit tests across 17 suites pass, including upstream analytics tests.
- Standalone and embedded production builds pass. Both development modes also
  pass navigation/photo smoke checks, including Electron JPEG/HEIC local loads.
- Chrome: all 11 browser cases pass with the original-source screenshot references.
  At most four isolated rasterization pixels are allowed per image; visible layout
  changes are not accepted. The Leaflet container is masked; map markers and
  navigation are asserted independently.
- WebKit: all 11 functional browser cases pass.
- Electron 32.0.2 (same runtime as installed companion version 1.12.1): JPEG and
  HEIC local-file loading, title, dimensions, hidden standalone controls, and URL
  date/clock settings pass in isolated test profiles.
- Firefox could not launch its installed Playwright Nightly because it reported
  a missing profile directory before navigation. A separate TMPDIR retry also
  failed. This environment gap is not a passing Firefox validation.

The original baseline is `3594ba5`. After merging newer main, reference captures
were refreshed from **upstream application code and old dependencies**, served on
port 3300 in an isolated copy. Only Settings/About references changed. A temporary
`experimental.esmExternals: false` setting was required to run Next 12 SSR in that
copy; application components and dependency versions were not changed there.
Analytics endpoints are intercepted during browser tests; isolated Electron tests
have no companion analytics listener and do not send events to its service.

Tracked fixtures, screenshots and commands make checks reproducible. Raw local
logs are in ignored `.upgrade-artifacts`; the PR links remote CI evidence.

## Remaining version and audit exceptions

- ESLint 9.39.5: a clean dependency-resolution probe with ESLint 10.14.0 fails
  because eslint-plugin-react 7.37.5 publishes peers through `^9.7`. The project
  uses no force/legacy-peer flags. ESLint 9 is EOL; retry after the plugin stack
  declares/validates support for 10, or evaluate a separate tooling migration.
- TypeScript 6.0.3: a clean probe with TypeScript 7.0.2 fails because the current
  typescript-eslint 8.72.1 peer range is `>=4.8.4 <6.1.0`. The Next lint stack uses
  it. Do not bypass this declaration by forcing the native compiler into tools
  expecting the earlier compiler API.
- Seven low audit entries remain, all from the same deepmerge advisory through
  current Jest/SVGR. Published latest deepmerge 4.3.1 is still in the affected
  range. The audit suggests downgrading parent tools to obsolete majors; that is
  not applied. No runtime/production advisories remain (`npm audit --omit=dev`).
  Total audit findings declined from 61 to 7; critical/high/moderate are zero.
- Packages such as exifr, is-number and the local-file helper were already at
  their published latest version. No application behavior was replaced merely
  because their release dates are old.

## Release review and rollback

No production publication or main-branch merge is part of this implementation.
Before release, confirm the supported browser policy: Next 16 declares Chrome/
Edge/Firefox 111+ and Safari 16.4+, while the old framework supported older
browsers. Tests cover current Chrome/WebKit and Electron 32, not every historical
browser. If older browsers are required, that is a concrete support tradeoff.

The Vercel projects should use Node 26.x (also declared in package engines), retain
`PDV_IN_PLM=True` and `.next_plm` for the embedded project, and use Webpack build
scripts. Actual production project settings were not changed. The pinned Node/npm
versions are for local/CI reproduction; Vercel may roll forward patches within 26.x.

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
