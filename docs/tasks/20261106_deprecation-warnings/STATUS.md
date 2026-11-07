# Deprecation warnings: status

Started on 2026-11-06. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Complete. This task changes only documentation.

Only a clean `npm ci` emitted deprecation warnings, from three package versions.
Each comes from the latest release of a package in the standard setup, so all
three are kept until upstream updates remove them. The revisit conditions are in
[DEVELOPMENT.md](../../DEVELOPMENT.md#known-deprecation-warnings).

| Deprecated version      | Brought in by                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `eslint@9.39.5`         | Direct development dependency; the plugins `eslint-config-next` bundles accept only ESLint 9 |
| `glob@10.5.0`           | Jest → `babel-plugin-istanbul@8.0.0` → `test-exclude@7.0.2`                                  |
| `whatwg-encoding@3.1.1` | `jest-environment-jsdom@30.5.2` → `jsdom@26.1.0`                                             |

## Alternatives evaluated and not adopted

Each of these removed its warning and passed every check it was given (see the
[results](./evidence/RESULTS.md)):

- Jest's documented `@jest/environment-jsdom-abstract` with jsdom 30.1.3, instead
  of `jest-environment-jsdom`.
- ESLint 10, with npm `overrides` replacing the `eslint` peer of the three
  plugins.
- An npm override selecting `test-exclude` 8.0.0 for `babel-plugin-istanbul`.

None was adopted (decided on 2026-11-07). Each departs from the documented setup,
and a deprecation warning is not a reason to do that. Overrides would also hide
an accurate signal without changing its cause, and turn off npm's compatibility
check for those packages. If a feature or a security fix ever needs ESLint 10 or
a newer jsdom, the results can inform that decision.

## Remaining warnings (not deprecations)

- During builds and server startup, Node 26 prints an `ExperimentalWarning` that
  `localStorage` is not available because `--localstorage-file` was not provided.
  `@rehooks/local-storage` 2.4.5 probes `localStorage` when it is imported on the
  server. A hook in this repository has since replaced the library, and the
  warning is gone; see the
  [localStorage hook record](../20261107_local-storage-hook/STATUS.md).
- `PDV_DEV=1 npm run test:e2e` logs that the development server blocked a
  cross-origin `/_next/hmr` request from `127.0.0.1`, because the suite uses that
  host while the server's origin is `localhost`. The test passes.

## Resuming

Nothing is pending. When upgrading `jest`, `eslint-config-next` or the plugins it
bundles, check the revisit conditions in
[DEVELOPMENT.md](../../DEVELOPMENT.md#known-deprecation-warnings) and update the
list.
