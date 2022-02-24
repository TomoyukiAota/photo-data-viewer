import { useRouter } from 'next/router';
import { useEffect } from 'react';

import * as gtag from './gtag';

export default function usePageView() {
  const router = useRouter();
  useEffect(() => {
    if (!gtag.GA_ID_EXISTS) {
      return;
    }

    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        gtag.pageview(url);
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
