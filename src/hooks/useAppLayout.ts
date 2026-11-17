import { useWindowSize as useDebouncedWindowSize, DebouncedWindowSizeOptions } from '@react-hook/window-size';
import { useWindowSize as useThrottledWindowSize } from '@react-hook/window-size/throttled';
import { trackChangedAppLayout } from '../analytics/track-event';
import { isWideLayout, useLayoutMode } from './useLayoutMode';

// `isWideLayout` is whether the panes are split, as the user chose or, in the
// automatic mode, by the window's width (useLayoutMode.ts).

export const useThrottledAppLayout = () => {
  const [windowWidth, windowHeight] = useThrottledWindowSize();
  const layoutMode = useLayoutMode();
  return { isWideLayout: isWideLayout(windowWidth, layoutMode), layoutMode, windowWidth, windowHeight };
}

export const useDebouncedAppLayout = (options: DebouncedWindowSizeOptions) => {
  const [windowWidth, windowHeight] = useDebouncedWindowSize(options);
  const layoutMode = useLayoutMode();
  return { isWideLayout: isWideLayout(windowWidth, layoutMode), layoutMode, windowWidth, windowHeight };
}

/**
 * Records the layout that is shown, and the window's size: `isWideLayout` is
 * true for the split panes, at whatever width, whether the user chose them or
 * the window is wide. The layout mode itself is recorded as a setting
 * (useUserSettings.ts).
 */
export const useAppLayoutTracker = () => {
  const appLayout = useDebouncedAppLayout({ wait: 10000 }); // 10 seconds

  const trackAppLayout = () => {
    trackChangedAppLayout('isWideLayout', appLayout.isWideLayout ? 'True' : 'False');
    trackChangedAppLayout('Window Width', appLayout.windowWidth.toString());
    trackChangedAppLayout('Window Height', appLayout.windowHeight.toString());
  }

  return { trackAppLayout, appLayout };
}
