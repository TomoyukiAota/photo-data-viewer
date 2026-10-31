# Contributing to this project

This page contains useful information to contribute to this project.

## Prerequisite

- [mise](https://mise.jdx.dev/)

This project uses mise to manage the versions of Node.js and npm, which are defined in [mise.toml](../mise.toml). Follow [the installation guide](https://mise.jdx.dev/installing-mise.html) to install mise and activate it in your shell.

## Deployments

Note that there are two deployments of this app.

| Deployment              | Note                                                                                                                |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------ |
| Standalone              | Hosted on https://photo-data-viewer.vercel.app to be opened from web browsers.                                      |
| [Photo Location Map][1] | Hosted on https://pdv-in-plm.vercel.app to be opened from Photo Location Map. This URL does not work with browsers. |

[1]: https://github.com/TomoyukiAota/photo-location-map

## Build and run for development

After cloning this repository, install Node.js and npm with this command:

```bash
mise trust && mise install
```

Then, install the dependencies with this command:

```bash
npm ci
```

### Running the standalone app

To start the development server for the standalone app, run this command:

```bash
npm run dev
```

Open http://localhost:3000 with your web browser to see the app.

### Running the app integrated into Photo Location Map

To start the development server for the app integrated into Photo Location Map, run this command:

```bash
npm run dev:plm
```

Open http://localhost:3100 from Photo Location Map to see the app.

## Validation and dependency upgrades

Use `mise exec -- <command>` when the current shell still has an older runtime
selected after changing `mise.toml`.

```bash
npm run test:all
npm run build
npm run build:plm
npx playwright install chromium
npm run test:e2e
```

The browser suite starts the standalone production server on port 3200. It uses
public/synthetic fixtures, intercepts analytics and map tiles, and loads the same
Roboto font used by the reference application.
For visual comparisons on the same macOS/Chrome environment as the committed
baseline, run `PDV_CHROME=1 PDV_VISUAL=1 npm run test:e2e`. Do not update snapshots
to accept an unexplained UI change. Cross-platform CI runs functional assertions.

`PDV_DEV=1 npm run test:e2e` starts a development server on port 3200 and runs
navigation/photo regression checks, including the About-to-Settings link. Close
other test servers on that port first; suites intentionally do not reuse servers.

For embedded integration checks, build with `npm run build:plm` and set
`PDV_ELECTRON_PATH` to a separate Electron 32.0.2 runtime executable before running
`npm run test:electron`. Tests create disposable profiles and use the companion's
Node integration settings. `PDV_ELECTRON_BASE_URL=http://localhost:3100` can target
an already running `npm run dev:plm` server instead of starting a production one.

Read [the upgrade status](./DEPENDENCY_UPGRADE_STATUS.md) before resuming an
upgrade, then follow [the implementation plan](./DEPENDENCY_UPGRADE_PLAN.md).
