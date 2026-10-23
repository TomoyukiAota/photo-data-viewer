import { useEffect } from 'react';
import { trackPageHidden } from '../analytics/track-event';

// How long a page has been visible, from the times it was shown and hidden, in
// milliseconds since it was loaded (performance.now()).
export function createVisibleTime(isVisibleAtStart: boolean) {
  let visibleMs = 0;
  // A page visible when this starts is taken to have been visible since it was
  // loaded, a second or so before; one opened in a background tab is not.
  let visibleSince: number | null = isVisibleAtStart ? 0 : null;

  return {
    hidden(now: number): number {
      if (visibleSince !== null) {
        visibleMs += now - visibleSince;
        visibleSince = null;
      }
      return visibleMs;
    },
    shown(now: number): void {
      if (visibleSince === null) visibleSince = now;
    },
  };
}

// Records, each time the page is hidden, how long it has been loaded and visible.
export const usePageHiddenTracker = () => {
  useEffect(() => {
    const visibleTime = createVisibleTime(document.visibilityState === 'visible');
    const handleVisibilityChange = () => {
      const now = performance.now();
      if (document.visibilityState === 'hidden') {
        const visibleMs = visibleTime.hidden(now);
        trackPageHidden({ secondsSinceLoad: now / 1000, visibleSeconds: visibleMs / 1000 });
      } else {
        visibleTime.shown(now);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
};
