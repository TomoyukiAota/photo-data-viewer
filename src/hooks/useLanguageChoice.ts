import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { trackChangedLanguageInUse } from '../analytics/track-event';
import PhotoContext from '../context/photo/photo-context';
import { DEFAULT_LOCALE, languageOfLocale } from '../i18n/address';
import { applyLanguage, loadLanguage } from '../i18n/i18n';
import {
  isLanguageSetting,
  LanguageCode,
  LanguageSetting,
  languageSettingAuto,
} from '../i18n/languages';
import { browserLanguage, currentLanguage } from '../i18n/resolve-language';
import { UserSettingKey } from '../utils/user-settings';
import { useUserSettings } from './useUserSettings';

/** The language that an entry of the list stands for. */
function languageOf(setting: LanguageSetting): LanguageCode {
  return setting === languageSettingAuto ? browserLanguage() : setting;
}

/**
 * The choice of the Language setting from the list of languages, on the
 * Language page and in the language's button of the Home page's header
 * (LanguagePicker): which entry is chosen, and choosing one, which shows the
 * app in its language at once and saves it with the other settings.
 *
 * TL;DR: On an address that names a language, such as /ja/language, the page
 * is in that language, which is the one chosen in the list, and choosing
 * another opens its address.
 * Details: Such an address shows its language whatever the setting
 * (src/i18n/address.ts). A choice there is saved as the setting as well, and
 * opens the address of the language chosen, or the one without a language for
 * the browser's language, which the setting then follows.
 */
export function useLanguageChoice() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { userSettings, setUserSetting } = useUserSettings();
  const photoCtx = useContext(PhotoContext);
  /** The language that the page's address names, or null. */
  const addressLanguage = languageOfLocale(router.locale);

  // A saved value that names no language the app has is shown as the default.
  const saved: LanguageSetting = isLanguageSetting(userSettings.language)
    ? userSettings.language
    : languageSettingAuto;
  /** The entry the user chose, while its language is being fetched. */
  const [choosing, setChoosing] = useState<LanguageSetting | null>(null);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  /** Counts the choices, so that only the last one takes effect when languages arrive out of order. */
  const choices = useRef(0);

  const selected = choosing ?? addressLanguage ?? saved;
  // TL;DR: The chosen entry can be chosen again while the app is not shown in
  // its language, which is how the user asks for that language again.
  // Details: When a language cannot be fetched as the app starts, the app is
  // shown in English and the setting stays, so the entry of that language is
  // the chosen one on a page in English. Choosing it would do nothing, as it
  // does while its language is the one shown.
  const isSelectedShown = languageOf(selected) === i18n.language;

  // TL;DR: When the address changes its language, the page follows it.
  // Details: A choice on an address that names a language opens another
  // address (choose), and the browser's Back and Forward go between the two,
  // on the same page. The language of the address is then shown, as when the
  // app is opened at it.
  const previousLocale = useRef(router.locale);
  useEffect(() => {
    if (previousLocale.current === router.locale) return;
    previousLocale.current = router.locale;
    const language = currentLanguage();
    if (language === i18n.language) return;
    applyLanguage(language).then(
      () => {
        trackChangedLanguageInUse(language);
        photoCtx.reloadPhoto();
      },
      () => {}, // It could not be fetched (i18n.ts reported why): the app stays as it was.
    );
  }, [router.locale, i18n, photoCtx]);

  /**
   * Shows the app in the language of the entry chosen, once it is fetched, and
   * saves the setting. Resolves to whether the language is shown: not when it
   * could not be fetched, which `isLoadFailed` then says, nor when another
   * entry was chosen since.
   */
  const choose = async (setting: LanguageSetting): Promise<boolean> => {
    const choice = ++choices.current;
    const language = languageOf(setting);
    setChoosing(setting);
    setIsLoadFailed(false);
    try {
      await loadLanguage(language);
    } catch {
      // The language could not be fetched (i18n.ts reported why): the app and
      // the setting stay as they were.
      if (choice === choices.current) {
        setChoosing(null);
        setIsLoadFailed(true);
      }
      return false;
    }
    if (choice !== choices.current) {
      return false; // Another entry was chosen since: its language is the one to show.
    }
    // Asking again for the language of the saved setting changes no setting.
    if (setting !== saved) setUserSetting(UserSettingKey.Language, setting);
    await applyLanguage(language); // At once, as the language is loaded.
    // The language shown now, beside the setting, which does not tell it when
    // it follows the browser. Also when the setting stayed and its language
    // was asked for again: the language shown changed then.
    trackChangedLanguageInUse(language);
    // On an address that names a language, the address goes with the choice.
    const locale = setting === languageSettingAuto ? DEFAULT_LOCALE : language;
    if (addressLanguage && locale !== router.locale) {
      await router.push(router.asPath, undefined, { locale });
    }
    setChoosing(null);
    // After the language is applied, so that the photo's dates are in it.
    photoCtx.reloadPhoto();
    return true;
  };

  return { selected, isSelectedShown, isLoadFailed, choose };
}
