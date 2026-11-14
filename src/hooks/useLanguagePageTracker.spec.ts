import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';

import { trackLeftLanguagePage } from '../analytics/track-event';
import { applyLanguage, languageReady } from '../i18n/i18n';
import {
  createLanguagePageVisits,
  readLanguageState,
  useLanguagePageTracker,
} from './useLanguagePageTracker';

// What is recorded is checked here, and sent nowhere.
jest.mock('../analytics/track-event');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  await act(() => applyLanguage('en'));
});

describe('readLanguageState', () => {
  it('reads the setting and the language the app is shown in', async () => {
    localStorage.setItem('Language', 'ja');
    await act(() => applyLanguage('ja'));
    expect(readLanguageState()).toEqual({
      languageSetting: 'ja',
      languageInUse: 'ja',
    });
  });

  it('tells a setting that follows the browser from the language shown', async () => {
    localStorage.setItem('Language', 'auto');
    await act(() => applyLanguage('fr'));
    expect(readLanguageState()).toEqual({
      languageSetting: 'auto',
      languageInUse: 'fr',
    });
  });

  it('reads a setting that is not saved, or names no language, as following the browser', () => {
    expect(readLanguageState()).toEqual({
      languageSetting: 'auto',
      languageInUse: 'en',
    });
    localStorage.setItem('Language', 'xx');
    expect(readLanguageState()).toEqual({
      languageSetting: 'auto',
      languageInUse: 'en',
    });
  });
});

describe('createLanguagePageVisits', () => {
  function visits() {
    let state = { languageSetting: 'auto', languageInUse: 'fr' };
    const tracked: unknown[][] = [];
    const pages = createLanguagePageVisits({
      read: () => state,
      track: (...args) => tracked.push(args),
    });
    return {
      shown: pages.shown,
      tracked,
      choose: (languageSetting: string, languageInUse: string) => {
        state = { languageSetting, languageInUse };
      },
    };
  }

  it('records the language settled on when the Language page is left, and the one found on arriving', () => {
    const { shown, choose, tracked } = visits();
    shown('/');
    shown('/language');
    choose('de', 'de');
    choose('ja', 'ja');
    shown('/settings');
    expect(tracked).toEqual([
      [
        { languageSetting: 'ja', languageInUse: 'ja' },
        { languageSetting: 'auto', languageInUse: 'fr' },
      ],
    ]);
  });

  it('records a visit that changed nothing as well', () => {
    const { shown, tracked } = visits();
    shown('/language');
    shown('/');
    expect(tracked).toEqual([
      [
        { languageSetting: 'auto', languageInUse: 'fr' },
        { languageSetting: 'auto', languageInUse: 'fr' },
      ],
    ]);
  });

  it('records each visit with what was found on arriving at it', () => {
    const { shown, choose, tracked } = visits();
    shown('/language');
    choose('ja', 'ja');
    shown('/about');
    shown('/language');
    shown('/');
    expect(tracked).toEqual([
      [
        { languageSetting: 'ja', languageInUse: 'ja' },
        { languageSetting: 'auto', languageInUse: 'fr' },
      ],
      [
        { languageSetting: 'ja', languageInUse: 'ja' },
        { languageSetting: 'ja', languageInUse: 'ja' },
      ],
    ]);
  });

  it('records nothing while the Language page stays, or when another page is left', () => {
    const { shown, choose, tracked } = visits();
    shown('/');
    shown('/settings');
    shown('/language');
    choose('ja', 'ja');
    shown('/language'); // The same page, with another query for instance.
    expect(tracked).toEqual([]);
  });
});

describe('useLanguagePageTracker', () => {
  /** The router's events, as the app's root is given them. */
  function router() {
    const handlers = new Set<() => void>();
    const events = {
      on: jest.fn((_type: string, handler: () => void) =>
        handlers.add(handler),
      ),
      off: jest.fn((_type: string, handler: () => void) =>
        handlers.delete(handler),
      ),
    };
    jest
      .mocked(useRouter)
      .mockReturnValue({ events } as unknown as ReturnType<typeof useRouter>);
    return {
      events,
      handlers,
      /** Another page is shown, as after the menu or the browser's Back. */
      changeTo(pathname: string) {
        window.history.pushState(null, '', pathname);
        handlers.forEach((handler) => handler());
      },
    };
  }

  it('records the language when the visitor leaves the Language page for another page', async () => {
    const { changeTo, events } = router();
    renderHook(() => useLanguagePageTracker());
    await act(() => languageReady);
    expect(events.on).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function),
    );

    changeTo('/language');
    localStorage.setItem('Language', 'ja');
    await act(() => applyLanguage('ja'));
    expect(trackLeftLanguagePage).not.toHaveBeenCalled();

    changeTo('/settings');
    expect(jest.mocked(trackLeftLanguagePage).mock.calls).toEqual([
      [
        { languageSetting: 'ja', languageInUse: 'ja' },
        { languageSetting: 'auto', languageInUse: 'en' },
      ],
    ]);
  });

  it('knows what was found on arriving when the app is opened on the Language page', async () => {
    window.history.replaceState(null, '', '/language');
    const { changeTo } = router();
    renderHook(() => useLanguagePageTracker());
    await act(() => languageReady);

    changeTo('/');
    expect(jest.mocked(trackLeftLanguagePage).mock.calls).toEqual([
      [
        { languageSetting: 'auto', languageInUse: 'en' },
        { languageSetting: 'auto', languageInUse: 'en' },
      ],
    ]);
  });

  it('stops listening when the app is taken away', async () => {
    const { handlers, events } = router();
    const { unmount } = renderHook(() => useLanguagePageTracker());
    await act(() => languageReady);
    expect(handlers.size).toBe(1);

    unmount();
    expect(events.off).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function),
    );
    expect(handlers.size).toBe(0);
  });

  it('does not start listening when the app is taken away before its language is shown', async () => {
    const { handlers } = router();
    const { unmount } = renderHook(() => useLanguagePageTracker());
    unmount();
    await act(() => languageReady);
    expect(handlers.size).toBe(0);
  });
});
