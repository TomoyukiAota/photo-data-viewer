import '../styles/globals.scss';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';

import { AppIntegration } from '../app-integration/app-integration';
import LoadPhotoInPlm from '../app-integration/LoadPhotoInPlm';
import AppMenu from '../components/app-menu/AppMenu';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import AppProvider from '../context/AppProvider';
import DocumentTitleContext from '../context/document-title/document-title-context';
import { trackAppIntegrationMode } from '../google-analytics/track-event';
import { useAppRoot } from '../hooks/useAppRoot';

import classes from './_app.module.scss';

if (!AppIntegration.isDuringSsrOrSsg) {
  console.debug('App Integration Mode: ', AppIntegration.mode);
  trackAppIntegrationMode();
}

function AppRoot({ Component, pageProps }: AppProps) {
  useAppRoot();

  const { documentTitle } = useContext(DocumentTitleContext);

  // rootElement is <></> during SSR and the first render in the browser,
  // and then useEffect triggers a re-render for the wanted one.
  // This is to match the DOM between SSR and the first render in order to avoid the React hydration error.
  // The different DOM between SSR and the first render is due to integration mode detection (standalone or Photo Location Map)
  // using global process variable which exists in Photo Location Map but during SSR,
  // but such detection mechanism is inevitable.
  // See also: https://nextjs.org/docs/messages/react-hydration-error
  const [rootElement, setRootElement] = useState(<></>);
  useEffect(
    () =>
      setRootElement(
        <AppProvider>
          <Head>
            <title>{documentTitle}</title>
            <meta name='description' content='View your photo data.' />
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <AppMenu
            className={classes['app-menu']}
            isVisible={AppIntegration.isStandalone}
          />
          <Component {...pageProps} />
          <UnsupportedFileSelectedDialog />
          <LoadPhotoInPlm />
        </AppProvider>
      ),
    [Component, pageProps, documentTitle]
  );

  return rootElement;
}

export default AppRoot;
