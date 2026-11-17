import { Check } from '@mui/icons-material';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import TabIcon from '@mui/icons-material/Tab';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import SvgIcon, { createSvgIcon } from '@mui/material/SvgIcon';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLayoutMode } from '../../hooks/useLayoutMode';
import { useUserSettings } from '../../hooks/useUserSettings';
import {
  LayoutMode,
  LayoutModeType,
  layoutModes,
  UserSettingKey,
} from '../../utils/user-settings';
import { HeaderButtonFace } from '../app-menu/AppMenu';

/**
 * Two panes stacked beside a tall one, as the panes side by side are: the
 * photo and the map on the left, and the data on the right, in a language
 * written from right to left too. It is MUI's SpaceDashboard icon, mirrored.
 */
const SideBySideIcon = createSvgIcon(
  <path d='M13 21h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-6zm-2 0H5c-1.1 0-2-.9-2-2v-7h8zM3 10V5c0-1.1.9-2 2-2h6v7z' />,
  'SideBySide',
);

/** Each mode's icon, and the keys of its texts in src/locales. */
const modes: Record<
  LayoutModeType,
  {
    Icon: typeof SvgIcon;
    nameKey: 'home.layout.auto' | 'home.layout.sideBySide' | 'home.layout.tabs';
    descriptionKey?: 'home.layout.autoDescription';
  }
> = {
  [LayoutMode.Auto]: {
    Icon: AutoModeIcon,
    nameKey: 'home.layout.auto',
    descriptionKey: 'home.layout.autoDescription',
  },
  [LayoutMode.SideBySide]: {
    Icon: SideBySideIcon,
    nameKey: 'home.layout.sideBySide',
  },
  [LayoutMode.Tabs]: { Icon: TabIcon, nameKey: 'home.layout.tabs' },
};

/** The menu's id, which the button names while the menu is open. There is one header on a page. */
const menuId = 'layout-menu';

/**
 * The button of the header that chooses how the Home page lays out its panes,
 * before the menu's button, and its menu of the layout modes.
 *
 * TL;DR: Made as the menu's button is: an icon with a word under it, and a
 * menu with a check mark at the chosen entry.
 * Details: The icon is the chosen mode's, and the word is the one for a
 * layout. The modes are radio items of the menu, so that a screen reader
 * says which one is chosen, and the menu opens with the focus on it.
 * Choosing a mode leaves the focus on the button: the header stays where it
 * is when the layout under it changes (Home.tsx).
 */
const LayoutMenu: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  const layoutMode = useLayoutMode();
  const { setUserSetting } = useUserSettings();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const id = useId();
  const buttonId = `${id}button`;

  const handleOpenMenu: React.MouseEventHandler<HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleModeChosen = (mode: LayoutModeType) => {
    if (mode !== layoutMode) {
      setUserSetting(UserSettingKey.LayoutMode, mode);
    }
    setAnchorEl(null);
  };

  return (
    <div className={props.className}>
      <IconButton
        id={buttonId}
        size='large'
        color='inherit'
        aria-label={t('home.layout.buttonLabel')}
        aria-haspopup='true'
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleOpenMenu}
      >
        <HeaderButtonFace
          Icon={modes[layoutMode].Icon}
          label={t('home.layout.label')}
        />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        // Under the button, in the middle, and inside the window.
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleCloseMenu}
        slotProps={{
          backdrop: { style: { backgroundColor: '#222222', opacity: 0.4 } },
          list: { 'aria-labelledby': buttonId },
        }}
      >
        {layoutModes.map((mode) => {
          const isChosen = mode === layoutMode;
          const { Icon, nameKey, descriptionKey } = modes[mode];
          // The entry is named by its name alone, and its description, under
          // the name, is read after it.
          const nameId = `${id}${mode}-name`;
          const descriptionId = `${id}${mode}-description`;
          return (
            <MenuItem
              key={mode}
              role='menuitemradio'
              aria-checked={isChosen}
              aria-labelledby={descriptionKey ? nameId : undefined}
              aria-describedby={descriptionKey ? descriptionId : undefined}
              // The menu opens with the focus on the chosen entry.
              selected={isChosen}
              onClick={() => handleModeChosen(mode)}
              // A text wider than the window continues on the next line.
              sx={{ whiteSpace: 'normal' }}
            >
              <ListItemIcon>
                <Check
                  style={{ visibility: isChosen ? 'visible' : 'hidden' }}
                />
              </ListItemIcon>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={t(nameKey)}
                secondary={descriptionKey && t(descriptionKey)}
                slotProps={{
                  primary: { id: nameId },
                  secondary: { id: descriptionId },
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default LayoutMenu;
