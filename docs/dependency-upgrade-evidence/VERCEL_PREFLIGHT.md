# Vercel release preflight

Inspected on 2026-10-31 (Asia/Tokyo) through the authenticated Vercel connection.
No production promotion, rollback, project-setting change or main merge was made.

## Effective build configuration

The observations below describe preview commit `c1934ed`, before the npm pin in
`vercel.json`. Both projects are linked to this public GitHub repository and use
the Next.js framework preset.

| Check                                    | Standalone                               | Embedded                                    |
| ---------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| Project                                  | photo-data-viewer                        | pdv-in-plm                                  |
| Project Node setting                     | 22.x                                     | 22.x                                        |
| Effective preview build Node             | 26.13.0                                  | 26.13.0                                     |
| Default dependency-install npm           | 11.20.0                                  | 11.20.0                                     |
| Build command observed                   | npm run build, then next build --webpack | npm run build, then next build --webpack    |
| PDV_IN_PLM                               | Not configured                           | True in Production, Preview and Development |
| Preview result                           | READY                                    | READY                                       |

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

The embedded mode still derives `.next_plm` and Electron renderer targeting from
the existing `next.config.js` and `PDV_IN_PLM=True`. The configuration does not
override project-specific output directories. The project/deployment responses
available through the connection did not expose the dashboard's output-directory
override, so its literal setting was not independently inspected. Successful
embedded previews confirm the effective build works with the existing settings.

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
automatically created the observed previews. Treat a main merge as a production
release trigger. The connection's project summaries did not expose production
branch tracking or automatic domain assignment settings, so those switches were
not independently read from the dashboard.

## Remaining release gate

Listing with `rollbackCandidate=true` returned HTTP 403, action `list`, resource
`deploymentRollback`, for both projects. The connection can read project details,
deployments, logs, variables and aliases; this is a distinct permission failure,
not the earlier team-consent problem. Repeating team authorization is not a
verified remedy. No authenticated CLI fallback is available on this machine.
The dashboard browser also requires a separate login.

The retained READY deployments above are concrete restore targets to preserve
after the next release. Candidate eligibility and rollback execution permissions
remain unverified. A permitted operator must confirm them before releasing;
do not test permissions by actually rolling production back. Current-plan limits
on rollback depth also apply; see [the rollback documentation](https://vercel.com/docs/cli/rollback).

Before any authorized release, verify the exact branch commit and production
environment configuration, resolve the dashboard-only settings and rollback gate,
and retain these deployment IDs. Check both applications after publication.
