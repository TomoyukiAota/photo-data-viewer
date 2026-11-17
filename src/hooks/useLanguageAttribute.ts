import { useRouter } from 'next/router';
import { useEffect } from 'react';

import i18next from '../i18n/i18n';

/**
 * Keeps the page's `lang` that of the language it is shown in.
 *
 * TL;DR: Next.js sets `lang` to the locale of the address after each change of
 * page, and this sets it back at once.
 * Details: With an address for each language (next.config.js), Next.js' router
 * writes the locale into `lang` when a page is shown, then says that the change
 * of page is complete: `ja` on /ja/about, which is the language shown, but
 * `default` on /about, which names no language, while the page there is in the
 * language of the setting or the browser. The language shown sets `lang`
 * (src/i18n/i18n.ts), by which browsers choose the glyphs of Japanese and
 * Chinese; this sets it again as the change is complete, before anything is
 * drawn.
 */
export function useLanguageAttribute() {
  const router = useRouter();
  useEffect(() => {
    const keep = () => {
      document.documentElement.lang = i18next.language;
    };
    router.events.on('routeChangeComplete', keep);
    return () => {
      router.events.off('routeChangeComplete', keep);
    };
  }, [router.events]);
}
