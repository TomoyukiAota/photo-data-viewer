import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import DialogProvider from '../store/DialogProvider';
import PhotoProvider from '../store/PhotoProvider';
import UnsupportedFileSelectedDialog from '../components/dialog/UnsupportedFileSelectedDialog';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DialogProvider>
      <PhotoProvider>
        <Component {...pageProps} />
        <UnsupportedFileSelectedDialog />
      </PhotoProvider>
    </DialogProvider>
  );
}

export default MyApp;
