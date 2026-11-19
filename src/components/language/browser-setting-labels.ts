import { getLanguage, LanguageCode, languageCodes } from '../../i18n/languages';
import { textsOf } from '../../i18n/static-texts';
import { valuesIn } from '../../i18n/text-values';

/**
 * The text of the Language page's first entry, the choice to follow the
 * browser's language, in each language, with that language's own name:
 * 「ブラウザの設定に従う（日本語）」 for Japanese. The list shows the one of the
 * browser's language (LanguageList.tsx).
 */
export type BrowserSettingLabels = Readonly<Record<LanguageCode, string>>;

/**
 * The text of the Language page's first entry in every language, for the
 * page's `getStaticProps` (src/pages/language.tsx), from the translation files.
 *
 * TL;DR: The page brings this text of every language with it, so that the
 * entry is in the browser's language at once, without its translation.
 * Details: The page can be shown in another language than the browser's, whose
 * texts the app has not fetched then, as it fetches the language it shows
 * (src/i18n/i18n.ts). Fetching them for this text would show the entry in
 * another language, or without a text, until they arrived, and leave it so
 * where they could not be fetched. The texts of all the languages take less
 * than 2 kB compressed, less than one translation file, in the page's props,
 * which Next.js gives the browser with the page; only the code of the server
 * runs this.
 */
export async function loadBrowserSettingLabels(): Promise<BrowserSettingLabels> {
  const labels = await Promise.all(
    languageCodes.map(async (code) => {
      const t = await textsOf(code);
      const values = valuesIn(code, { language: getLanguage(code).name });
      return [code, t('language.useBrowserSetting', values)] as const;
    }),
  );
  return Object.fromEntries(labels) as BrowserSettingLabels;
}
