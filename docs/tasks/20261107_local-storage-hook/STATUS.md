# localStorage hook: status

Started on 2026-11-07. See the [plan](./PLAN.md) and the
[results](./evidence/RESULTS.md).

## Current state

Implemented and verified locally; the pull request is open and not merged.

- [`src/hooks/useLocalStorage.ts`](../../../src/hooks/useLocalStorage.ts)
  replaces `@rehooks/local-storage`, which is removed from the dependencies. It
  exports `useLocalStorage`, which returns the value, `writeStorage` and
  `readStorage`.
- `useUserSettingsInitializer` called the hook inside a plain function under an
  `eslint-disable` for `react-hooks/rules-of-hooks`. It is now the plain function
  `initializeUserSettingsIfNeeded`, which reads storage directly and stores the
  same values: the default of each of the four settings that has none.
- Builds and the development and production servers print no `localStorage`
  warning. The stored values, the values the Settings page first renders and the
  development-mode browser console are unchanged.

## Differences from the library

These parts are not kept, because the app does not use them:

- The setter and remover the hook returned, and `deleteFromStorage`.
- The in-memory storage the library used when `localStorage` cannot be used, for
  example when a browser blocks site data. `GutterPositionProvider` and
  `formatDate` already read `localStorage` directly, so the app depends on working
  storage either way. This was concluded from the code; a browser with storage
  blocked was not tried.
- The `CustomEvent` polyfill, which the supported browsers do not need, and the
  rewritten error message for objects with circular references.

The event that tells the hooks in the same tab about a write has a new name.
Nothing outside the hook listens for it.

## Resuming

Nothing is pending once the pull request is merged. Read and write settings
through `useLocalStorage`, `writeStorage` and `readStorage`. Code that writes a key
directly must store strings that are not JSON-quoted, as the code listed in the
[plan](./PLAN.md#what-must-not-change) does.
