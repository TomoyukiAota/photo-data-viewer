# Vercel release preflight

Inspected on 2026-10-31 and refreshed on 2026-11-01 (Asia/Tokyo) through the
authenticated Vercel connection and the existing Chrome dashboard session.
No production promotion, rollback, project-setting change or main merge was made.

## Effective build configuration

The runtime values were first observed at preview commit `c1934ed` and are
confirmed again in both `d67058a` preview build logs. Both projects are linked
to this public GitHub repository and use the Next.js framework preset.

| Check                                    | Standalone                               | Embedded                                    |
| ---------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| Project                                  | photo-data-viewer                        | pdv-in-plm                                  |
| Project Node setting                     | 22.x                                     | 22.x                                        |
| Effective preview build Node             | 26.13.0                                  | 26.13.0                                     |
| Default dependency-install npm           | 11.20.0                                  | 11.20.0                                     |
| Build command observed                   | npm run build, then next build --webpack | npm run build, then next build --webpack    |
| PDV_IN_PLM                               | Not configured                           | True in Production, Preview and Development |
| Preview result                           | READY                                    | READY                                       |
| Root directory                           | Repository root                          | Repository root                             |
| Dashboard build/install overrides        | Disabled                                 | Disabled                                    |
| Dashboard output override                | Disabled (Next.js default)               | Enabled: .next_plm                          |
| Production branch                        | main                                     | main                                        |
| Auto-assign production domains           | Enabled                                  | Enabled                                     |

The logs explicitly say `engines.node=26.x` overrides the project's 22.x setting.
No dashboard Node change is necessary to obtain Node 26 for this branch. Vercel
controls minor/patch rollout; build and function-runtime patches can differ.
See [Vercel's Node version rules](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

Those logs originally showed an npm engine mismatch: the branch requested npm
12.x while Vercel used Node's bundled npm 11.20.0. Commit `8cbe9e6` temporarily
overrode installation/builds with npm 12.2.1. The user subsequently selected the
bundled-npm policy: use Node 26.13.0 / npm 11.20.0 consistently in local development,
CI and Vercel. The current source removes the separate npm installation and build
override. `vercel.json` logs Node/npm versions and runs the existing `npm ci`;
Vercel's default `npm run build` command is retained. `.npmrc` enables strict
install-script approvals for npm 11. See the current PR checks for the latest
preview validation. Dashboard defaults and existing production deployments are
unchanged.

The embedded mode derives `.next_plm` and Electron renderer targeting from
`next.config.js` and `PDV_IN_PLM=True`. The flag's decrypted value and its
Production/Preview/Development scopes were checked through the connection.
The standalone project has no project environment variables. The dashboard
confirms the literal output-directory settings above. No settings need changing.

## Actual deployed-preview verification

The following immutable previews contain `d67058ad01c28466e32515fb1a8340c6ba6bdfa3`:

| Application | Preview ID | Result |
| --- | --- | --- |
| Standalone | dpl_HPWnwt54J1Tf6zsub8yS5Akk3WJW | READY; 12 Chrome functional cases pass |
| Embedded | dpl_EmBbz78YE8SKsJ3zBKE34smUrm1Q | READY; both JPEG/HEIC Electron 32.0.2 cases pass |

These checks use the actual deployed HTTPS assets, not local builds. Both preview
roots respond with HTTP 200 without additional authentication. Their build logs
show Node 26.13.0, npm 11.20.0 and the default `npm run build` / `next build --webpack`.
Map/analytics requests are isolated by the existing harness. Reproduce with:

```sh
PDV_BASE_URL=https://photo-data-viewer-nz31ko0co-tomoyukiaotas-projects.vercel.app PDV_CHROME=1 mise exec -- npm run test:e2e
PDV_ELECTRON_BASE_URL=https://pdv-in-q39syrgft-tomoyukiaotas-projects.vercel.app PDV_ELECTRON_PATH=/absolute/path/to/Electron mise exec -- npm run test:electron
```

Raw results are `.upgrade-artifacts/release-standalone-preview.log` and
`.upgrade-artifacts/release-embedded-preview.log`. Later documentation-only
commits do not change the tested application source; inspect current PR checks
for their own remote build/CI results.

## Bundled-npm validation

Runtime/configuration checkpoint `311639f2062280f0cfd96ce9e889bc3401237364` passed
[CI run 248](https://github.com/TomoyukiAota/photo-data-viewer/actions/runs/41208253850)
on macOS, Linux and Windows. Every job's version step reports Node 26.13.0 and
npm 11.20.0. Both previews for this commit are READY:

- [Standalone](https://vercel.com/tomoyukiaotas-projects/photo-data-viewer/Cc5r6LwZGf4mDdftjd1oQcLriT5P):
  `dpl_Cc5r6LwZGf4mDdftjd1oQcLriT5P`.
- [Embedded](https://vercel.com/tomoyukiaotas-projects/pdv-in-plm/4EjdB3teKebLoAE4Qni4BdKr88Ji):
  `dpl_4EjdB3teKebLoAE4Qni4BdKr88Ji`.

Both build logs show the install command `node --version && npm --version && npm ci`,
followed by `v26.13.0` and `11.20.0`. The default build command runs `npm run build`
and `next build --webpack`. No npm engine mismatch warnings occur. Production
aliases were re-resolved after these builds and still point to the deployment
IDs below.

## Current production and restore targets

The production aliases were resolved directly and matched these retained READY
production deployments. Both contain upstream main commit
`7db4679261c18e331d65e0117e3759e893d07ef7`.

| Application | Production alias             | Deployment ID                    |
| ----------- | ---------------------------- | -------------------------------- |
| Standalone  | photo-data-viewer.vercel.app | dpl_5VhaP9To4afh44Qkua1GNXBWqsJS |
| Embedded    | pdv-in-plm.vercel.app        | dpl_BJqGEzo6EKrLxauufe74EXW4HhuS |

Immutable URLs:

- [Standalone](https://photo-data-viewer-3z04w1yjs-tomoyukiaotas-projects.vercel.app)
- [Embedded](https://pdv-in-18owb4jr4-tomoyukiaotas-projects.vercel.app)

Re-resolve aliases immediately before a release: these are snapshot restore
targets, not a promise that production will remain on them indefinitely.

Both current production deployments report `source=git`, `target=production` and
branch `main`; their logs also identify that main commit. Feature-branch pushes
create previews. Both Production environment dashboards explicitly track `main`
with Auto-Assign Custom Production Domains checked. Merging this PR triggers
production builds and updates both public aliases automatically.

## Access and rollback readiness

Listing with `rollbackCandidate=true` returned HTTP 403, action `list`, resource
`deploymentRollback`, for both projects. The connection can read project details,
deployments, logs, variables and aliases; this is a distinct permission failure,
not the earlier team-consent problem. Repeating team authorization is not a
verified remedy. The unfiltered production deployment list succeeds and marks
both retained deployments above `isRollbackCandidate=true`.

Chrome already has an authenticated dashboard session. The Instant Rollback
action is enabled for both projects' eligible previous deployment at `9bf4dfe`;
the equivalent action is disabled for the currently serving deployment, as
expected. Only the menus were inspected; no recovery action was executed.

Vercel CLI 65.9.0 is now installed globally in this Mac's Node 26.13.0 environment,
outside the application's dependencies. Startup and native helper loading pass.
The two reviewed helper install scripts were approved once for this installation;
no repository or persistent user-wide script policy was changed. `vercel whoami`
reports logged out. CLI login is optional for this release because GitHub merging,
connection-based deployment inspection and dashboard recovery are available.

Preserve both current production IDs for the next release. This team uses Hobby,
which permits Instant Rollback only to the previous production deployment.
Recheck candidates immediately after the release. A rollback stops automatic
production-domain assignment; a later Promote restores it. See
[rollback limits and undoing rollback](https://vercel.com/docs/cli/rollback).

## Release procedure

1. Obtain the owner's production release decision. Refresh PR #63's exact head,
   main branch and production aliases, retaining the old deployment IDs above.
   If main or the head changed, reconcile and validate before merging.
2. Require all three OS checks to pass on that head. Main is protected with strict
   up-to-date checks enforced for administrators too. The repository permits
   merge commits; squash and rebase merges are disabled. Do not use an admin
   bypass, enable auto-merge, or enqueue the PR during preparation.
3. Merge the reviewed head with a head-match guard, using `gh pr merge 63 --merge
   --match-head-commit <reviewed-head-sha> --repo TomoyukiAota/photo-data-viewer`.
   This publishes both applications through their existing Git integrations.
4. Record the resulting main merge SHA. Monitor its three-OS CI and both Vercel
   production deployments until READY. Confirm each public alias points to its
   new deployment and that each deployment identifies the expected main SHA.
5. Run the existing standalone browser suite against
   `PDV_BASE_URL=https://photo-data-viewer.vercel.app` and the Electron JPEG/HEIC
   suite against `PDV_ELECTRON_BASE_URL=https://pdv-in-plm.vercel.app`. Keep the
   harness's analytics interception and isolated profiles. Verify navigation,
   photo metadata, rotation, maps, settings and restored pane positions.
6. If a build fails while its alias still serves the retained deployment, leave
   that deployment serving traffic. If a newly published build fails its checks,
   use the dashboard's Instant Rollback to restore that application's retained
   `7db4679` deployment, verify its public alias and repeat its smoke checks.
   Preserve the main/source history and
   prepare a reviewed correction; promote a repaired production deployment to
   restore normal automatic domain assignment.

All preparation above is complete. Production publication and the checks that
require the newly published build remain pending the owner's release decision.
