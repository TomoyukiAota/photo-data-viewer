import '../styles/globals.scss';

import type { AppProps } from 'next/app';

import AppMenu from '../components/app-menu/AppMenu';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import usePageView from '../google-analytics/usePageView';
import AppProvider from '../store/AppProvider';
import { useUserSettingsInitializer } from '../hooks/useUserSettings';

import classes from './_app.module.scss';

function MyApp({ Component, pageProps }: AppProps) {
  usePageView();
  const { initilizeUserSettingsIfNeeded } = useUserSettingsInitializer();
  initilizeUserSettingsIfNeeded();

  return (
    <AppProvider>
      <AppMenu classNames={classes['app-menu']} />
      <Component {...pageProps} />
      <UnsupportedFileSelectedDialog />
    </AppProvider>
  );
}

export default MyApp;
