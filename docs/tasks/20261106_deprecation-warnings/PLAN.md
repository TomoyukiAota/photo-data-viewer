# Deprecation warnings: plan

## Goal

Find every deprecation warning this project emits, and decide how to handle each
one without changing the application's behavior or appearance.

## Where to look

- Installation: a clean `npm ci`, and the registry's `deprecated` field for every
  package version in `package-lock.json`.
- Lint, type check, unit tests (including coverage), both production builds and
  both development servers.
- The browser console in development mode while using every page and the main
  flows, and both Playwright browser suites.
- The latest CI logs and annotations on all three operating systems.

## Decision rules

- Stay on the setup each tool documents. Depart from it only for a specific
  reason: a feature that cannot be built otherwise, or avoiding a serious
  security vulnerability. See
  [DEVELOPMENT.md](../../DEVELOPMENT.md#stay-on-the-documented-setup). The owner
  set this rule on 2026-11-07, after the alternatives in the
  [results](./evidence/RESULTS.md) had been evaluated.
- Removing a deprecation warning is not such a reason. Record the warning and the
  condition for revisiting it.
- Do not use `--force` or `--legacy-peer-deps`, and do not weaken checks.
- Record warnings that are not deprecations, but leave them for a separate
  decision.
