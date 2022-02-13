import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import AppProvider from '../store/AppProvider';
import AppMenu from '../components/app-menu/AppMenu';

import classes from './_app.module.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AppMenu classNames={classes['app-menu']}></AppMenu>
      <Component {...pageProps} />
      <UnsupportedFileSelectedDialog />
    </AppProvider>
  );
}

export default MyApp;
