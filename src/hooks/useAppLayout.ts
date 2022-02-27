import { useWindowSize as useDebouncedWindowSize, DebouncedWindowSizeOptions } from '@react-hook/window-size';
import { useWindowSize as useThrottledWindowSize } from '@react-hook/window-size/throttled';
import { trackChangedAppLayout } from '../google-analytics/track-event';

function isWideLayout(windowWidth: number): boolean {
  return windowWidth > 1200;
}

export const useThrottledAppLayout = () => {
  const [windowWidth, windowHeight] = useThrottledWindowSize();
  return { isWideLayout: isWideLayout(windowWidth), windowWidth, windowHeight };
}

export const useDebouncedAppLayout = (options: DebouncedWindowSizeOptions) => {
  const [windowWidth, windowHeight] = useDebouncedWindowSize(options);
  return { isWideLayout: isWideLayout(windowWidth), windowWidth, windowHeight };
}

export const useAppLayoutTracker = () => {
  const appLayout = useDebouncedAppLayout({ wait: 10000 }); // 10 seconds

  const trackAppLayout = () => {
    trackChangedAppLayout('isWideLayout', appLayout.isWideLayout ? 'True' : 'False');
    trackChangedAppLayout('Window Width', appLayout.windowWidth.toString());
    trackChangedAppLayout('Window Height', appLayout.windowHeight.toString());
  }

  return { trackAppLayout, appLayout };
}
