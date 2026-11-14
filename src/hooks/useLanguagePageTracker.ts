import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { LanguageState, trackLeftLanguagePage } from '../analytics/track-event';
import i18next, { languageReady } from '../i18n/i18n';
import { isLanguageSetting, languageSettingAuto } from '../i18n/languages';
import { UserSettingKey } from '../utils/user-settings';
import { readStorage } from './useLocalStorage';

/** The address of the Language page (src/pages/language.tsx). */
export const LANGUAGE_PAGE_PATHNAME = '/language';

/** The Language setting as it takes effect, and the language the app is shown in, now. */
export function readLanguageState(): LanguageState {
  const saved = readStorage(UserSettingKey.Language);
  return {
    // A saved value that names no language follows the browser, as on the Language page.
    languageSetting:
      typeof saved === 'string' && isLanguageSetting(saved)
        ? saved
        : languageSettingAuto,
    languageInUse: i18next.language,
  };
}

/**
 * Follows the pages that the app shows, and records each time the Language
 * page is left for another page, with the language as it is then and as it
 * was when the page was opened.
 */
export function createLanguagePageVisits(options: {
  read: () => LanguageState;
  track: (now: LanguageState, onArrival: LanguageState | null) => void;
}) {
  /** The page shown, or null before the first one. */
  let pathname: string | null = null;
  /** The language when the Language page was opened, while it is the page shown. */
  let onArrival: LanguageState | null = null;

  return {
    /** The app shows the page of this address: the first one, and the one after each change of page. */
    shown(next: string): void {
      if (next === pathname) return; // The same page, with another query for instance.
      if (pathname === LANGUAGE_PAGE_PATHNAME) {
        options.track(options.read(), onArrival);
      }
      pathname = next;
      onArrival = next === LANGUAGE_PAGE_PATHNAME ? options.read() : null;
    },
  };
}

/**
 * Records the language that the visitor settled on, each time they leave the
 * Language page for another page of the app: by the menu, or by the browser's
 * Back and Forward.
 *
 * TL;DR: It is the app's root that listens, to the router's
 * `routeChangeComplete`, and not the Language page.
 * Details: The page is gone by the time the router says that the change is
 * complete. Recording as the page is taken away would also record as it is
 * opened in development, where React mounts a component twice
 * (`reactStrictMode`). `routeChangeStart` comes earlier, but also for a
 * change that is then cancelled. Nothing is recorded when the tab is closed
 * or the visitor goes to another site, which is not a change of page; the
 * last change recorded tells the language then (`Changed User Setting`).
 *
 * It starts once the app shows the language that it starts in
 * (`languageReady`): before that, the language in use is still English,
 * whatever the app is about to show.
 */
export const useLanguagePageTracker = () => {
  const router = useRouter();
  useEffect(() => {
    const visits = createLanguagePageVisits({
      read: readLanguageState,
      track: trackLeftLanguagePage,
    });
    // After a change of page, the address is the new page's.
    const show = () => visits.shown(window.location.pathname);
    let isMounted = true;
    languageReady.then(() => {
      if (!isMounted) return;
      show();
      router.events.on('routeChangeComplete', show);
    });
    return () => {
      isMounted = false;
      router.events.off('routeChangeComplete', show);
    };
  }, [router.events]);
};
