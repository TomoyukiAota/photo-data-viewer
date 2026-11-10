import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import classes from './AppMenu.module.scss';

interface Page {
  pathname: string;
  /** The key of the page's name in src/locales. */
  nameKey: 'menu.home' | 'menu.demo' | 'menu.settings' | 'menu.about';
  icon: React.JSX.Element;
}

const pages: Page[] = [
  { pathname: '/', nameKey: 'menu.home', icon: <HomeIcon /> },
  { pathname: '/demo', nameKey: 'menu.demo', icon: <PlayArrowIcon /> },
  { pathname: '/settings', nameKey: 'menu.settings', icon: <SettingsIcon /> },
  { pathname: '/about', nameKey: 'menu.about', icon: <InfoIcon /> },
];

const AppMenu: React.FC<{ className?: string; isVisible: boolean }> = (
  props,
) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

  const handleOpenMenu: React.MouseEventHandler<HTMLElement> = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenuItemClicked = (page: Page) => {
    router.push(page.pathname);
    setAnchorElNav(null);
  };

  const handleCloseMenu: React.MouseEventHandler<HTMLElement> = () => {
    setAnchorElNav(null);
  };

  return (
    <div
      className={props.className}
      style={{
        top: '30px',
        right: '10px',
        display: props.isVisible ? 'block' : 'none',
      }}
    >
      <IconButton
        size='large'
        color='inherit'
        aria-label={t('menu.buttonLabel')}
        onClick={handleOpenMenu}
      >
        <div className={classes['menu-icon-wrapper']}>
          <MenuIcon className={classes['menu-icon']} />
          <span className={classes['menu-icon-text']}>{t('menu.label')}</span>
        </div>
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
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
        }}
      >
        {pages.map((page) => {
          const isCurrentPage = router.pathname === page.pathname;
          return (
            <MenuItem
              key={page.pathname}
              onClick={() => handleMenuItemClicked(page)}
            >
              <ListItemIcon>
                <Check
                  style={{ visibility: isCurrentPage ? 'visible' : 'hidden' }}
                />
              </ListItemIcon>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText>{t(page.nameKey)}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default AppMenu;
