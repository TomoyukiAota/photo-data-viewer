import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import { useSyncExternalStore } from 'react';

import { AppIntegration } from '../app-integration/app-integration';
import LoadPhotoInPlm from '../app-integration/LoadPhotoInPlm';
import AppMenu from '../components/app-menu/AppMenu';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import AppProvider from '../context/AppProvider';
import { trackAppIntegrationMode, trackPageLoaded } from '../analytics/track-event';
import { useAppRoot } from '../hooks/useAppRoot';

import classes from './_app.module.scss';

if (!AppIntegration.isDuringSsrOrSsg) {
  console.debug('App Integration Mode: ', AppIntegration.mode);
  trackAppIntegrationMode();
  trackPageLoaded();
}

// An empty server/first-hydration tree preserves integration-mode detection.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function AppRoot({ Component, pageProps }: AppProps) {
  useAppRoot();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  if (!mounted) return <></>;

  return (
    <AppProvider>
      <AppMenu className={classes['app-menu']} isVisible={AppIntegration.isStandalone} />
      <Component {...pageProps} />
      <UnsupportedFileSelectedDialog />
      <LoadPhotoInPlm />
    </AppProvider>
  );
}

export default AppRoot;
