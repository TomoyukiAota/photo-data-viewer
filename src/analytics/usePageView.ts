import { useRouter } from 'next/router';
import { useEffect } from 'react';

import * as ga4 from './ga4';

export default function usePageView() {
  const router = useRouter();
  useEffect(() => {
    if (!ga4.GA_ID_EXISTS) {
      return;
    }

    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        ga4.pageview(url);
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
