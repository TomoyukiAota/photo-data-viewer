import '../styles/globals.scss';

import type { AppProps } from 'next/app';

import AppMenu from '../components/app-menu/AppMenu';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import { useAppRoot } from '../hooks/useAppRoot';
import AppProvider from '../context/AppProvider';

import classes from './_app.module.scss';

function AppRoot({ Component, pageProps }: AppProps) {
  useAppRoot();

  return (
    <AppProvider>
      <AppMenu classNames={classes['app-menu']} />
      <Component {...pageProps} />
      <UnsupportedFileSelectedDialog />
    </AppProvider>
  );
}

export default AppRoot;
