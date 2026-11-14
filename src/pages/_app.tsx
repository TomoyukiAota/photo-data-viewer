import '../styles/globals.scss';
import { useLanguageReady } from '../i18n/i18n'; // First, so that the language is decided before anything is rendered.

import type { AppProps } from 'next/app';
import { useSyncExternalStore } from 'react';

import { AppIntegration } from '../app-integration/app-integration';
import LoadPhotoInPlm from '../app-integration/LoadPhotoInPlm';
import AppMenu from '../components/app-menu/AppMenu';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import ErrorBoundary from '../components/error-boundary/ErrorBoundary';
import PageNotShown from '../components/error-boundary/PageNotShown';
import AppProvider from '../context/AppProvider';
import DirectionProvider from '../direction/DirectionProvider';
import { recordErrorsNothingHandled } from '../analytics/record-error';
import { trackAppIntegrationMode, trackPageLoaded } from '../analytics/track-event';
import { useAppRoot } from '../hooks/useAppRoot';

import classes from './_app.module.scss';

if (!AppIntegration.isDuringSsrOrSsg) {
  recordErrorsNothingHandled(); // First, to record errors from the start.
  console.debug('App Integration Mode: ', AppIntegration.mode);
  trackAppIntegrationMode();
  trackPageLoaded();
}

// An empty server/first-hydration tree preserves integration-mode detection.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Every page, with the providers, the menu and the dialogs, inside the error boundary that records an error in rendering. */
function AppRoot({ Component, pageProps }: AppProps) {
  useAppRoot();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  // Nothing is rendered either until the texts of the language have arrived
  // (src/i18n/i18n.ts), so that the page is not shown in English first.
  const languageReady = useLanguageReady();
  if (!mounted || !languageReady) return <></>;

  // The error boundary Next.js' documentation puts here: it records an error in
  // rendering, which Next.js would otherwise catch before the window could.
  return (
    <ErrorBoundary name='page' fallback={<PageNotShown />}>
      <DirectionProvider>
        <AppProvider>
          <AppMenu className={classes['app-menu']} isVisible={AppIntegration.isStandalone} />
          <Component {...pageProps} />
          <UnsupportedFileSelectedDialog />
          <LoadPhotoInPlm />
        </AppProvider>
      </DirectionProvider>
    </ErrorBoundary>
  );
}

export default AppRoot;
