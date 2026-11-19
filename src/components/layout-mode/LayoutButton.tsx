import { IconButton, Menu } from '@mui/material';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsRtl } from '../../direction/DirectionProvider';
import { useLayoutMode } from '../../hooks/useLayoutMode';
import { useUserSettings } from '../../hooks/useUserSettings';
import { LayoutModeType, UserSettingKey } from '../../utils/user-settings';
import SplitPanesIcon from './SplitPanesIcon';
import { useLayoutModeItems } from './useLayoutModeItems';
import classes from './LayoutButton.module.scss';

/**
 * The keyboard's focus of the button Layout, which goes from the button that
 * a new layout takes away to the one that it draws at the end of its own
 * tabs: the two are not the same element. Kept by the Home page, which draws
 * both.
 */
export class LayoutButtonFocus {
  private isGiven = false;

  /** Called by a button that leaves the page while it has the focus. */
  give(): void {
    this.isGiven = true;
  }

  /** Whether a button that left gave the focus, to the one drawn now, which takes it. */
  take(): boolean {
    const isGiven = this.isGiven;
    this.isGiven = false;
    return isGiven;
  }
}

/**
 * The button Layout, with which the layout is chosen in Photo Location Map,
 * whose window shows neither the header nor the menu: at the end of the
 * topmost tabs (Home.tsx). It opens a menu of the modes that the submenu of
 * the menu's entry Layout has in the standalone app (useLayoutModeItems),
 * under the button, with its end at the button's end, so that the menu lies
 * over the tabs' own pane.
 *
 * TL;DR: The icon of the split panes, whichever mode is chosen, with the word
 * Layout under it, as the menu's entry has them; the menu's button has its
 * word under its icon too (AppMenu).
 * Details: An icon for each mode would say which is chosen, but not what the
 * button is for. The word is the one of the menu's entry, `menu.layout`.
 */
const LayoutButton: React.FC<{ focus: LayoutButtonFocus }> = (props) => {
  const { t } = useTranslation();
  const isRtl = useIsRtl();
  const layoutMode = useLayoutMode();
  const { setUserSetting } = useUserSettings();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  /** The mode chosen in the menu, which takes effect once the menu is closed. */
  const chosenMode = useRef<LayoutModeType | null>(null);
  const buttonId = useId();
  const menuId = useId();
  const isOpen = Boolean(anchorEl);
  const end = isRtl ? 'left' : 'right';

  // TL;DR: The button that a new layout draws takes the focus, if the one
  // that it replaces had it.
  // Details: The one that leaves gives it while it is still in the page:
  // React runs the cleanup of a layout effect before it takes the elements
  // away.
  useLayoutEffect(() => {
    const button = buttonRef.current;
    return () => {
      if (button !== null && button === document.activeElement) {
        props.focus.give();
      }
    };
  }, [props.focus]);
  useEffect(() => {
    if (props.focus.take()) buttonRef.current?.focus();
  }, [props.focus]);

  const handleChosen = (mode: LayoutModeType) => {
    chosenMode.current = mode;
    setAnchorEl(null);
  };
  const items = useLayoutModeItems(handleChosen);

  // TL;DR: The mode chosen takes effect once the menu is closed.
  // Details: Closing, the menu gives the focus back to this button, which
  // then gives it to the button of a new layout. Taking effect at once, a new
  // layout would take the menu away with this button, while the focus is in
  // the menu.
  const applyChosenMode = () => {
    const mode = chosenMode.current;
    chosenMode.current = null;
    if (mode === null || mode === layoutMode) return;
    setUserSetting(UserSettingKey.LayoutMode, mode);
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        id={buttonId}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        // A box around the icon and the word, which the circle of an icon's
        // button would cut. Shown pressed while its menu is open.
        sx={{
          flex: 'none',
          marginInline: '4px 8px',
          padding: '3px 10px',
          borderRadius: '6px',
          '&[aria-expanded="true"]': { backgroundColor: 'action.selected' },
        }}
      >
        <span className={classes.face}>
          <SplitPanesIcon />
          <span className={classes['face-text']}>{t('menu.layout')}</span>
        </span>
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: end }}
        transformOrigin={{ vertical: 'top', horizontal: end }}
        slotProps={{
          list: { 'aria-labelledby': buttonId },
          transition: { onExited: applyChosenMode },
        }}
      >
        {items}
      </Menu>
    </>
  );
};

export default LayoutButton;
