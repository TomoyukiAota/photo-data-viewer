# localStorage hook: plan

## Goal

Replace `@rehooks/local-storage` with a small hook in this repository, so that
Node 26's `localStorage` warning no longer appears, without changing what the app
stores, reads or shows.

## Why

During `npm run build`, `npm run build:plm` and server startup, Node 26 prints:

```
ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
```

`@rehooks/local-storage` 2.4.5 tests whether `localStorage` works when its module
is imported (`localStorageAvailable()` in `lib/storage.js`), and Next.js imports
the pages on Node.js to prerender them. Node 26 has a `localStorage` of its own;
reading that global without `--localstorage-file` returns `undefined` and prints
the warning once per process. Even `typeof localStorage` prints it;
`typeof window` does not. The library has had no release since 2023-08, so no
update will remove the warning.

`@mantine/hooks`, `use-local-storage-state` and `usehooks-ts` were compared. Each
stores strings JSON-quoted by default and differs in API or first-render behavior,
so the owner chose a small hook that keeps the current behavior and storage
format.

## What must not change

- The storage format. Objects are stored as JSON and other values as strings
  (`"" + value`); reading tries `JSON.parse` and falls back to the string. Code
  that reads and writes the same keys directly relies on strings that are not
  JSON-quoted: `src/utils/format-date.ts`, `src/utils/user-settings.ts`,
  `src/app-integration/plm-settings.ts`, `src/analytics/opt-out.ts`,
  `src/context/gutter-position/GutterPositionProvider.tsx` and the inline script
  in `src/pages/_document.tsx`. Saved values must load unchanged.
- The first render on the client reads the stored value, so that nothing flashes
  or jumps on reload. On the server the default is used, and the `localStorage`
  global is never read: `typeof window` is checked first.
- When a key is missing and the default is not null, the default is stored on
  mount.
- A write reaches every mounted hook of the key in the same tab, and a change in
  another tab (the `storage` event) does too.
- What the settings initializer stores as the app loads.

## Decision rules

- Keep the code small, and do not add another third-party hook library.
- Stay on the documented setup
  ([DEVELOPMENT.md](../../DEVELOPMENT.md#stay-on-the-documented-setup)): no npm
  `overrides`, custom environments or patches. The three deprecation warnings of
  a clean `npm ci` stay as they are.

## Verification

- Unit tests in the Jest jsdom environment: format round trips, defaults, the
  default being stored, and same-tab and cross-tab updates. A test in Jest's node
  environment checks that the server reads nothing.
- `npm run test:all`, `npm run build`, `npm run build:plm` (no warning),
  `npm run test:e2e`, `PDV_DEV=1 npm run test:e2e` and `npm run test:electron`.
- The development-mode browser console before and after, reloading with
  non-default settings: no new hydration warnings.
- A clean `npm ci` prints only the three known deprecation warnings, and
  `npm ls --all` passes.
