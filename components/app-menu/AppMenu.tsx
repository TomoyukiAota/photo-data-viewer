import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { Check } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useAppLayout } from '../../hooks/useAppLayout';
import classes from './AppMenu.module.scss';

interface Page {
  pathname: string;
  displayName: string;
}

const pages: Page[] = [
  { pathname: '/', displayName: 'Home' },
  { pathname: '/about', displayName: 'About' },
];

function getAppMenuCssProperties(windowWidth: number): React.CSSProperties {
  if (windowWidth > 600) {
    return { top: '30px', right: '30px' };
  } else {
    return { top: '30px', right: '10px' };
  }
}

const AppMenu: React.FC<{ classNames?: string }> = (props) => {
  const router = useRouter();
  const { windowWidth } = useAppLayout();
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

  const appMenuCssProperties = getAppMenuCssProperties(windowWidth);

  return (
    <div className={props.classNames} style={appMenuCssProperties}>
      <IconButton
        size='large'
        color='inherit'
        aria-label='menu'
        onClick={handleOpenMenu}
      >
        <MenuIcon />
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
      >
        {pages.map((page) => {
          const isCurrentPage = router.pathname === page.pathname;
          return (
            <MenuItem
              key={page.displayName}
              onClick={() => handleMenuItemClicked(page)}
            >
              {isCurrentPage && (
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
              )}
              <ListItemText inset={!isCurrentPage}>
                {page.displayName}
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default AppMenu;
