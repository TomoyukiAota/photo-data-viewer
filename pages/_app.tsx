import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';
import AppProvider from '../store/AppProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <UnsupportedFileSelectedDialog />
    </AppProvider>
  );
}

export default MyApp;
