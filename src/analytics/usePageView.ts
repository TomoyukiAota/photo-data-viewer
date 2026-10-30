import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { trackPageView } from './analytics';
import { GA_ID_EXISTS } from './ga4';

export default function usePageView() {
  const router = useRouter();
  useEffect(() => {
    if (!GA_ID_EXISTS) {
      return;
    }

    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) {
        trackPageView(url);
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
}
