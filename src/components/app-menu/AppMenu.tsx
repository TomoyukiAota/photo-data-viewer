import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PopoverActions,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import AttributionIcon from '@mui/icons-material/Attribution';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsRtl } from '../../direction/DirectionProvider';
import classes from './AppMenu.module.scss';
import LayoutSubmenu, { LayoutMenuItem } from './LayoutSubmenu';

interface Page {
  pathname: string;
  /** The key of the page's name in src/locales. */
  nameKey:
    | 'menu.home'
    | 'menu.demo'
    | 'menu.settings'
    | 'menu.language'
    | 'menu.about'
    | 'menu.credits';
  icon: React.JSX.Element;
}

const pages: Page[] = [
  { pathname: '/', nameKey: 'menu.home', icon: <HomeIcon /> },
  { pathname: '/demo', nameKey: 'menu.demo', icon: <PlayArrowIcon /> },
  { pathname: '/settings', nameKey: 'menu.settings', icon: <SettingsIcon /> },
  { pathname: '/language', nameKey: 'menu.language', icon: <LanguageIcon /> },
  { pathname: '/about', nameKey: 'menu.about', icon: <InfoIcon /> },
  { pathname: '/credits', nameKey: 'menu.credits', icon: <AttributionIcon /> },
];

/** What the menu's button shows: the icon, and the word for a menu under it. */
const AppMenuFace: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.face}>
      <MenuIcon className={classes['face-icon']} />
      <span className={classes['face-text']}>{t('menu.label')}</span>
    </div>
  );
};

/**
 * Room as wide as the menu's button, for a page to keep free where the button
 * lies over it, at the end of its first lines.
 *
 * TL;DR: It is the button's own content, not drawn, so it is as wide as the
 * button in every language.
 * Details: The button is as wide as the word under its icon, which differs
 * from language to language (MENU, メニュー, IZBORNIK). A width set here in
 * pixels would be too small for one of them, or leave a gap for the others.
 */
export const AppMenuRoom: React.FC<{ className?: string }> = (props) => (
  <div
    className={`${classes.room} ${props.className ?? ''}`}
    aria-hidden='true'
  >
    <AppMenuFace />
  </div>
);

const AppMenu: React.FC<{ className?: string; isVisible: boolean }> = (
  props,
) => {
  const { t } = useTranslation();
  const isRtl = useIsRtl();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  /** The menu's entry Layout while its submenu is open (LayoutSubmenu), or null. */
  const [layoutEntry, setLayoutEntry] = useState<HTMLElement | null>(null);
  const layoutEntryId = useId();
  const submenuActions = useRef<PopoverActions>(null);

  const handleOpenMenu: React.MouseEventHandler<HTMLElement> = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenuItemClicked = (page: Page) => {
    router.push(page.pathname);
    setAnchorElNav(null);
  };

  const handleCloseMenu = () => {
    setLayoutEntry(null);
    setAnchorElNav(null);
  };

  // The entries of the pages, with Layout after Language: the three entries
  // that set how the app is shown together.
  const entries = pages.flatMap((page) => {
    const isCurrentPage = router.pathname === page.pathname;
    const entry = (
      <MenuItem
        key={page.pathname}
        onClick={() => handleMenuItemClicked(page)}
        // A name wider than the window continues on the next line.
        sx={{ whiteSpace: 'normal' }}
      >
        <ListItemIcon>
          <Check style={{ visibility: isCurrentPage ? 'visible' : 'hidden' }} />
        </ListItemIcon>
        <ListItemIcon>{page.icon}</ListItemIcon>
        <ListItemText>{t(page.nameKey)}</ListItemText>
      </MenuItem>
    );
    if (page.pathname !== '/language') return [entry];
    return [
      entry,
      <LayoutMenuItem
        key='layout'
        id={layoutEntryId}
        isSubmenuOpen={Boolean(layoutEntry)}
        onOpenSubmenu={setLayoutEntry}
      />,
    ];
  });

  return (
    <div
      className={props.className}
      style={{
        top: '30px',
        insetInlineEnd: '10px', // The right, or the left in a language written from right to left.
        display: props.isVisible ? 'block' : 'none',
      }}
    >
      <IconButton
        size='large'
        color='inherit'
        aria-label={t('menu.buttonLabel')}
        onClick={handleOpenMenu}
      >
        <AppMenuFace />
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isRtl ? 'right' : 'left', // The button's side towards the page.
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseMenu}
        slotProps={{
          backdrop: { style: { backgroundColor: '#222222', opacity: 0.4 } },
          // The submenu, opened while the menu grew, is placed again by its
          // entry where the entry ends up (LayoutSubmenu).
          transition: {
            onEntered: () => submenuActions.current?.updatePosition(),
          },
        }}
      >
        {entries}
      </Menu>
      <LayoutSubmenu
        anchorEl={layoutEntry}
        actions={submenuActions}
        onClose={() => setLayoutEntry(null)}
        onChosen={handleCloseMenu}
      />
    </div>
  );
};

export default AppMenu;
