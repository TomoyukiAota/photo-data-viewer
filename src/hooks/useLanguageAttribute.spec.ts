import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';

import { applyLanguage } from '../i18n/i18n';
import { useLanguageAttribute } from './useLanguageAttribute';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

/** The router's events, and what Next.js' router does to `lang` when a change of page is complete. */
function router() {
  const handlers = new Set<() => void>();
  const events = {
    on: jest.fn((_type: string, handler: () => void) => handlers.add(handler)),
    off: jest.fn((_type: string, handler: () => void) =>
      handlers.delete(handler),
    ),
  };
  jest
    .mocked(useRouter)
    .mockReturnValue({ events } as unknown as ReturnType<typeof useRouter>);
  return {
    handlers,
    events,
    changeToLocale(locale: string) {
      document.documentElement.lang = locale; // As Next.js' router does (next/dist/shared/lib/router/router.js).
      handlers.forEach((handler) => handler()); // routeChangeComplete
    },
  };
}

afterEach(async () => {
  jest.clearAllMocks();
  await act(() => applyLanguage('en'));
});

it('sets lang back to the language shown when Next.js has set it to the locale of an address without a language', async () => {
  await act(() => applyLanguage('ja'));
  const { changeToLocale } = router();
  renderHook(() => useLanguageAttribute());

  changeToLocale('default');
  expect(document.documentElement.lang).toBe('ja');
});

it("keeps a language's own address as Next.js sets it, which is the language shown", async () => {
  await act(() => applyLanguage('de'));
  const { changeToLocale } = router();
  renderHook(() => useLanguageAttribute());

  changeToLocale('de');
  expect(document.documentElement.lang).toBe('de');
});

it('stops listening when the app is taken away', () => {
  const { handlers, events } = router();
  const { unmount } = renderHook(() => useLanguageAttribute());
  expect(handlers.size).toBe(1);
  unmount();
  expect(events.off).toHaveBeenCalledWith(
    'routeChangeComplete',
    expect.any(Function),
  );
  expect(handlers.size).toBe(0);
});
