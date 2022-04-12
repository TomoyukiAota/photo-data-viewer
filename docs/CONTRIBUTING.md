# Contributing to this project

This page contains useful information to contribute to this project.

## Prerequisite

- Node.js (64-bit, version 16.14.0 or greater)

## Deployments

Note that there are two deployments of this app.

| Deployment              | Note                                                                                                                |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------ |
| Standalone              | Hosted in https://photo-data-viewer.vercel.app to be opened from web browsers.                                      |
| [Photo Location Map][1] | Hosted in https://pdv-in-plm.vercel.app to be opened from Photo Location Map. This URL does not work with browsers. |

[1]: https://github.com/TomoyukiAota/photo-location-map

## Build and run for development

After cloning this repository, install the dependencies with this command:

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
