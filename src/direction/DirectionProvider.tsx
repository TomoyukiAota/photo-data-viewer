import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { getLanguage, isLanguageCode } from '../i18n/languages';
import { rtlStyles } from './rtl-styles';

// What MUI's components were given before this provider existed: Emotion's own
// default cache has this key and no plugin, and the theme is MUI's default.
const ltrCache = createCache({ key: 'css' });
const ltrTheme = createTheme();
const rtlTheme = createTheme({ direction: 'rtl' });

/** Whether the language the app is shown in is written from right to left, as Arabic and Hebrew are. */
export function useIsRtl(): boolean {
  const { i18n } = useTranslation();
  return (
    isLanguageCode(i18n.language) &&
    getLanguage(i18n.language).direction === 'rtl'
  );
}

/**
 * Lays MUI's components out in the direction of the language, as MUI's guide to
 * right-to-left languages sets it up: the theme's direction, and a style plugin
 * that turns the styles around. The page's `dir` is set where the language is
 * applied (src/i18n/i18n.ts); the app's own styles follow it with logical
 * properties, such as `padding-inline-start`.
 *
 * TL;DR: both providers are always there, and only what they are given changes.
 * Details: wrapping the app in them for one direction only would make React
 * build the app anew when the direction changes, and the loaded photo would be
 * lost with it.
 */
const DirectionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isRtl = useIsRtl();
  // The styles are fetched with the language, so they are here whenever it is shown.
  const cache = (isRtl && rtlStyles()) || ltrCache;
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={isRtl ? rtlTheme : ltrTheme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};

export default DirectionProvider;
