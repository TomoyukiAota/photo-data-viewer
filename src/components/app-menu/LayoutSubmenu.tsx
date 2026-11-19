import { Check } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PopoverActions,
  useMediaQuery,
} from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsRtl } from '../../direction/DirectionProvider';
import { useLayoutMode } from '../../hooks/useLayoutMode';
import { useUserSettings } from '../../hooks/useUserSettings';
import { LayoutModeType, UserSettingKey } from '../../utils/user-settings';
import SplitPanesIcon from '../layout-mode/SplitPanesIcon';
import { useLayoutModeItems } from '../layout-mode/useLayoutModeItems';
import { SubmenuEntryHandlers } from './useSubmenuHover';

/** The submenu's id, which its entry in the menu names while it is open. */
const submenuId = 'layout-submenu';

/** The key that goes into a submenu from its entry, towards where a line ends, and the one that comes back. */
function submenuKeys(isRtl: boolean) {
  return isRtl
    ? { open: 'ArrowLeft', back: 'ArrowRight' }
    : { open: 'ArrowRight', back: 'ArrowLeft' };
}

/**
 * The menu's entry Layout, which opens the submenu of the layout modes
 * (LayoutSubmenu): as the entries of the pages, with the icon of the split
 * panes, which it always has, and an arrow towards the submenu.
 *
 * TL;DR: A mouse's pointer that rests on the entry opens the submenu, and so
 * do a click, Enter, Space and the arrow towards the submenu.
 * Details: As a submenu of a desktop's menu opens: its entry says that it
 * opens one and whether it is open, and the keyboard's focus goes to the
 * chosen mode. The pointer that goes on to another entry closes the submenu,
 * unless it is on its way to the submenu (useSubmenuHover.ts).
 */
export const LayoutMenuItem: React.FC<{
  id: string;
  isSubmenuOpen: boolean;
  onOpenSubmenu: (entry: HTMLElement) => void;
  /** Opens and closes the submenu on hover (useSubmenuHover). */
  hoverHandlers: SubmenuEntryHandlers;
}> = (props) => {
  const { t } = useTranslation();
  const isRtl = useIsRtl();
  const Arrow = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <MenuItem
      {...props.hoverHandlers}
      id={props.id}
      aria-haspopup='menu'
      aria-expanded={props.isSubmenuOpen}
      aria-controls={props.isSubmenuOpen ? submenuId : undefined}
      onClick={(event) => props.onOpenSubmenu(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key !== submenuKeys(isRtl).open) return;
        event.preventDefault();
        event.stopPropagation();
        props.onOpenSubmenu(event.currentTarget);
      }}
      // A name wider than the window continues on the next line.
      sx={{ whiteSpace: 'normal' }}
    >
      {/* Where the entries of the pages have the check mark of the page shown. */}
      <ListItemIcon>
        <Check style={{ visibility: 'hidden' }} />
      </ListItemIcon>
      <ListItemIcon>
        <SplitPanesIcon />
      </ListItemIcon>
      <ListItemText>{t('menu.layout')}</ListItemText>
      <Arrow sx={{ marginInlineStart: '16px', color: 'action.active' }} />
    </MenuItem>
  );
};

/**
 * The submenu of the layout modes, which the menu's entry Layout opens
 * (LayoutMenuItem), beside the menu, towards the page.
 *
 * TL;DR: The modes are radio items (useLayoutModeItems), and the submenu opens
 * with the keyboard's focus on the chosen one.
 * Details: Escape or the arrow back towards the menu closes the submenu
 * alone, and gives the focus back to its entry; choosing a mode closes the
 * menu too, once the submenu is closed, so that the focus goes back to the
 * menu's button through the entry: closed together, it was lost. It is in the
 * page beside the menu rather than inside it, so that its keys do not move
 * along the menu as well. With a mouse, the menu under it stays in reach (see
 * `pointerEvents` below).
 */
const LayoutSubmenu: React.FC<{
  /** The menu's entry Layout while the submenu is open, or null. */
  anchorEl: HTMLElement | null;
  /** Places the submenu again by its entry, which the menu does once it has grown. */
  actions: React.RefObject<PopoverActions | null>;
  /** Closes the submenu alone. */
  onClose: () => void;
  /** Closes the menu, once the submenu is closed after a mode is chosen. */
  onChosen: () => void;
}> = (props) => {
  const isRtl = useIsRtl();
  const layoutMode = useLayoutMode();
  const { setUserSetting } = useUserSettings();
  /** Whether a mode was chosen, which closes the menu once the submenu is closed. */
  const isChosen = useRef(false);
  // In a phone's width the menu takes most of the window, and the submenu
  // beside it would lie over its own entry: it opens under the entry there.
  const isNarrow = useMediaQuery('(max-width: 600px)');
  const side = isRtl ? 'right' : 'left';
  const otherSide = isRtl ? 'left' : 'right';

  const handleModeChosen = (mode: LayoutModeType) => {
    if (mode !== layoutMode) {
      setUserSetting(UserSettingKey.LayoutMode, mode);
    }
    isChosen.current = true;
    props.onClose();
  };
  const items = useLayoutModeItems(handleModeChosen);

  return (
    <Menu
      id={submenuId}
      action={props.actions}
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.onClose}
      // Beside its entry, towards the page: at the left of the menu, or at
      // its right in a language written from right to left. Under it in a
      // phone's width.
      anchorOrigin={
        isNarrow
          ? { vertical: 'bottom', horizontal: otherSide }
          : { vertical: 'top', horizontal: side }
      }
      transformOrigin={{ vertical: 'top', horizontal: otherSide }}
      // TL;DR: With a mouse, the pointer goes through the submenu's layer to
      // the menu under it, beside the submenu.
      // Details: The layer covers the window, to close the submenu at a click
      // beside it. With a mouse, the pointer reaches the menu's other entries
      // instead, which close the submenu on hover (useSubmenuHover.ts) and
      // open their pages at a click, and the menu's own layer, at whose click
      // the submenu closes alone (AppMenu.tsx). A touch, which has no hover,
      // closes the submenu as it did.
      sx={{
        '@media (hover: hover) and (pointer: fine)': { pointerEvents: 'none' },
      }}
      slotProps={{
        paper: { sx: { pointerEvents: 'auto' } },
        transition: {
          // TL;DR: Placed again by its entry once it is open, and once the
          // menu is (AppMenu.tsx).
          // Details: Its place is taken from where its entry is when it opens.
          // Opened at once after the menu, as the keyboard can, the menu was
          // still growing, and the submenu was dozens of pixels off its entry.
          onEntered: () => props.actions.current?.updatePosition(),
          onExited: () => {
            if (!isChosen.current) return;
            isChosen.current = false;
            props.onChosen();
          },
        },
        list: {
          'aria-labelledby': props.anchorEl?.id,
          onKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === submenuKeys(isRtl).back) {
              event.preventDefault();
              props.onClose();
            }
          },
        },
      }}
    >
      {items}
    </Menu>
  );
};

export default LayoutSubmenu;
