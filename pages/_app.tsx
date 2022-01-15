import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import PhotoProvider from '../store/PhotoProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PhotoProvider>
      <Component {...pageProps} />
    </PhotoProvider>
  );
}

export default MyApp;
