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

import classes from './AppMenu.module.scss';

interface Page {
  pathname: string;
  displayName: string;
}

const pages: Page[] = [
  { pathname: '/', displayName: 'Home' },
  { pathname: '/about', displayName: 'About' },
];

const AppMenu: React.FC<{ classNames?: string }> = (props) => {
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
    <div className={props.classNames} style={{ top: '30px', right: '20px' }}>
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
        BackdropProps={{ style: { backgroundColor: '#222222', opacity: 0.4 } }}
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
