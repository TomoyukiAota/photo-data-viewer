# Next.js security patch: results

Checked on 2026-11-18 on macOS arm64, with Node 26.13.0 and npm 11.20.0,
against `main` at `f77a012`. The dates of the advisories are in UTC.

## The change

| Package              | Before | After  |
| -------------------- | ------ | ------ |
| `next`               | 16.4.3 | 16.4.6 |
| `eslint-config-next` | 16.4.3 | 16.4.6 |

`npm install --save-exact next@16.4.6 eslint-config-next@16.4.6` changed
twelve packages in `package-lock.json` from 16.4.3 to 16.4.6, and nothing
else: `next`, `@next/env`, the eight `@next/swc-*` binaries,
`eslint-config-next` and `@next/eslint-plugin-next`. Each asks for the same
dependencies as in 16.4.3, so no other package moved.

A clean `npm ci` passes with `strict-allow-scripts`: none of the twelve has an
install script to approve. It prints the three deprecation warnings that
[DEVELOPMENT.md](../../../DEVELOPMENT.md#known-deprecation-warnings) lists,
and no other, and `npm ls --all` finds the tree valid.

## What 16.4.4 to 16.4.6 change for this app

Nothing that it uses, by the release notes and by the code.

The release notes:

- [16.4.4](https://github.com/vercel/next.js/releases/tag/v16.4.4): fixes of
  Turbopack and of the bundle analyzer, and `fast-jwt` instead of
  `jsonwebtoken` for the cookie of Preview Mode, which this app does not use.
- [16.4.5](https://github.com/vercel/next.js/releases/tag/v16.4.5): the fixes
  of the seven advisories below, alone.
- [16.4.6](https://github.com/vercel/next.js/releases/tag/v16.4.6): the
  responses of route handlers (App Router) compressed, Turbopack's memory in
  development, and Tailwind's version in `create-next-app`.

The installed packages, compared file by file with the version in them set
aside:

- The same: the webpack configuration (`dist/build/webpack-config.js`), the
  webpack development server's reloader, the loading of `next.config.js`, the
  client's entry (`dist/client/index.js`), and the router with its locales.
  `eslint-config-next`, `@next/eslint-plugin-next` and `@next/env` are the
  same entirely.
- Changed where the Pages Router runs, with nothing changed for this app:
  `render.js` reads the nonce of a Content Security Policy through a function
  that does the same; `_document.js` adds a script that only Turbopack's
  development server gives a value; in development, `page-bootstrap.js` no
  longer reloads the page when the server asks, which
  `hot-middleware-client.js` still does, as both did before.
- The rest is the fixes of the advisories (the headers of a forwarded
  response, an internal header of cookies, the image optimizer,
  `'use cache'`), the App Router, Turbopack and the bundle analyzer.

## The advisories fixed in 16.4.5

Each is moderate and includes 16.4.3. Each is about a feature that this app
does not use: it has no `'use cache'`, no Cache Components, no `next/image`,
no Edge runtime, no API routes and no middleware, and Vercel serves it.

| Advisory                                                                                         | About                                                | In `npm audit`        |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------- |
| [GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h)                         | `'use cache'` called through `unstable_cache()`      | Yes, since 2026-11-16 |
| [GHSA-vc7v-qv4w-wrv8](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8)                         | Nested `'use cache'` functions                       | Yes, since 2026-11-17 |
| [GHSA-vvgp-ww4w-46vf](https://github.com/vercel/next.js/security/advisories/GHSA-vvgp-ww4w-46vf) | The fallback shells of Cache Components              | Not yet               |
| [GHSA-rhh4-g77r-r9qj](https://github.com/vercel/next.js/security/advisories/GHSA-rhh4-g77r-r9qj) | `'use cache'` with binary arguments                  | Not yet               |
| [GHSA-pc58-hwjq-p385](https://github.com/vercel/next.js/security/advisories/GHSA-pc58-hwjq-p385) | A self-hosted server that forwards fetched responses | Not yet               |
| [GHSA-7qx7-33qx-rqx2](https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2) | SVG in the image optimizer                           | Not yet               |
| [GHSA-f3mh-rxg3-f5g2](https://github.com/vercel/next.js/security/advisories/GHSA-f3mh-rxg3-f5g2) | HttpOnly cookies on routes of the Edge runtime       | Not yet               |

"Not yet": published in Next.js's repository on 2026-11-03, with 16.4.5, but
not yet in the database that `npm audit` reads.

## npm audit

|                           | 16.4.3                   | 16.4.6                  |
| ------------------------- | ------------------------ | ----------------------- |
| All                       | 53: 10 moderate, 43 high | 52: 9 moderate, 43 high |
| Production (`--omit=dev`) | 3: 1 moderate, 2 high    | 2: 2 high               |

`next` is the entry that leaves. Both lists are longer than in the earlier
records: the picomatch advisory, updated on 2026-11-17, now covers every
release of picomatch. The low deepmerge advisory of those records was
withdrawn on 2026-11-16.

The 52 entries that remain come from three advisories. This upgrade fixes
none of them, and this setup can take no fix that removes one:

| Advisory                                                                                      | Entries                     | In the tree    | Fixed release, and why this setup cannot take it                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------- | --------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), picomatch, high     | 48, 2 of them in production | 2.3.2, 4.0.7   | None: every release up to 4.0.7, the latest, is affected.                                                                                                                                                                        |
| [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), glob, moderate      | 17                          | 10.5.0, 13.0.6 | 14.0.2. Jest 30.5.2, the latest, asks for glob `^13.0.6`; `babel-plugin-istanbul`, up to its newest 8.0.2, asks for `test-exclude` `^7.0.1`, which asks for glob `^10.4.1`.                                                      |
| [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), minimatch, moderate | 24                          | 9.0.9, 10.2.6  | 11.0.1. `typescript-eslint` 8.73.0, within the `^8.56.0` that `eslint-config-next` asks for, takes it, but its entries stay in the list for picomatch. The glob and the `test-exclude` that Jest uses ask for minimatch 9 or 10. |

The two production entries are `@parcel/watcher` and picomatch. Sass, a
development dependency here, is an optional peer of `next`, which brings it
into the tree that `--omit=dev` counts. Sass compiles the styles when the app
is built, and `@parcel/watcher` is for its watch mode; neither runs in the
deployed app.

Tried on a copy of the lockfile, `npm audit fix` takes `typescript-eslint` to
8.73.0, takes `eslint-import-resolver-typescript` back from 3.10.1 to 3.7.0,
and leaves 52 entries (4 moderate, 48 high). `npm audit fix --force` would take
Jest back to 30.2.0 and `eslint-config-next` to 14.2.35. Neither was used.

## Checks

| Check                                                                                                    | Result                                                                                         |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Clean `npm ci`, `npm ls --all`                                                                           | Passed; the three known deprecation warnings alone                                             |
| `npm run test:all`                                                                                       | Lint and type check clean; 49 suites, 730 tests passed                                         |
| `npm run build`, with `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` empty, as in CI                                  | Passed on its first run; 301 pages                                                             |
| `npm run build:plm`                                                                                      | Passed on its first run; 7 pages                                                               |
| Browser suite, `PDV_CHROME=1 PDV_VISUAL=1`, in Chrome 157 without a window, against `next start -p 3300` | 41 passed, with the visual comparison; no reference screenshot changed                         |
| Development-mode smoke test, `PDV_DEV=1`, against `next dev --webpack -p 3301`                           | Passed                                                                                         |
| The build for Photo Location Map, served by `next start`                                                 | Every page with `X-Robots-Tag: noindex`; no address of a language, no manifest, no search head |
| `npm run test:electron`                                                                                  | Not run: it opens windows on this machine                                                      |
| Firefox, WebKit                                                                                          | Not run                                                                                        |

Neither build printed a warning. The development server printed the one known
notice, that it blocked `/_next/hmr` from `127.0.0.1`
([deprecation warnings](../../20261106_deprecation-warnings/STATUS.md#remaining-warnings-not-deprecations)).
