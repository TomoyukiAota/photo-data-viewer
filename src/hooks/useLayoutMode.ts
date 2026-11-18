import { AppIntegration } from '../app-integration/app-integration';
import {
  isLayoutMode,
  LayoutMode,
  LayoutModeType,
  UserSettingDefaultValue,
  UserSettingKey,
} from '../utils/user-settings';
import { useLocalStorage } from './useLocalStorage';

// Apart from useAppLayout.ts, which reads the window's size with
// @react-hook/window-size: Jest cannot load that package, whose code for
// browsers is an ES module, so a test of what imports it cannot run.

/**
 * Whether the Home page splits its panes, the layout that the code calls wide
 * (HomeWideLayout), rather than showing a single pane chosen with tabs
 * (HomeNarrowLayout): as the user chose, or, in the automatic mode, when the
 * window is wider than 1200 pixels.
 */
export function isWideLayout(
  windowWidth: number,
  layoutMode: LayoutModeType,
): boolean {
  switch (layoutMode) {
    case LayoutMode.SplitPanes:
      return true;
    case LayoutMode.SinglePane:
      return false;
    default:
      return windowWidth > 1200;
  }
}

/**
 * The layout mode that applies: the one chosen with the button before the
 * menu's (LayoutMenu), or the automatic one for a stored value that is none of
 * the modes.
 *
 * TL;DR: In Photo Location Map, the layout is always the automatic one.
 * Details: Its window shows no header, and so no button to choose the mode
 * with. A mode stored there in some other way could not be changed back.
 */
export function useLayoutMode(): LayoutModeType {
  const stored = useLocalStorage<unknown>(
    UserSettingKey.LayoutMode,
    UserSettingDefaultValue.LayoutMode,
  );
  if (!AppIntegration.isStandalone) return LayoutMode.Auto;
  return isLayoutMode(stored) ? stored : LayoutMode.Auto;
}
