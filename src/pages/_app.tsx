import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import { useEffect } from 'react';

import AppMenu from '../components/app-menu/AppMenu';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import usePageView from '../google-analytics/usePageView';
import AppProvider from '../store/AppProvider';
import { useAppLayoutTracker } from '../hooks/useAppLayout';
import {
  useUserSettingsInitializer,
  useUserSettingsTracker,
} from '../hooks/useUserSettings';

import classes from './_app.module.scss';

function MyApp({ Component, pageProps }: AppProps) {
  usePageView();

  const { initilizeUserSettingsIfNeeded } = useUserSettingsInitializer();
  initilizeUserSettingsIfNeeded();

  const { trackAppLayout, appLayout } = useAppLayoutTracker();
  useEffect(
    () => trackAppLayout(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appLayout.windowWidth, appLayout.windowHeight]
  );

  const { trackLoadedUserSettings } = useUserSettingsTracker();
  useEffect(
    () => trackLoadedUserSettings(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Run only once when the page is loaded.
  );

  return (
    <AppProvider>
      <AppMenu classNames={classes['app-menu']} />
      <Component {...pageProps} />
      <UnsupportedFileSelectedDialog />
    </AppProvider>
  );
}

export default MyApp;
