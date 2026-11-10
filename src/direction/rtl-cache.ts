import createCache from '@emotion/cache';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';

// The styles of MUI's components for a language written from right to left, as
// MUI's guide sets them up: https://mui.com/material-ui/customization/right-to-left/
// The plugin turns each style around (`left` into `right`, and so on) as it is
// written into the page. This file is fetched with the first such language
// (rtl-styles.ts), so that the plugin is not part of the app's own code.
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default rtlCache;
