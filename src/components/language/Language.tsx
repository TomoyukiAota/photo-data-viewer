import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { trackChangedLanguageInUse } from '../../analytics/track-event';
import PhotoContext from '../../context/photo/photo-context';
import { useUserSettings } from '../../hooks/useUserSettings';
import { applyLanguage, loadLanguage } from '../../i18n/i18n';
import {
  isLanguageSetting,
  LanguageCode,
  LanguageSetting,
  languageSettingAuto,
} from '../../i18n/languages';
import { browserLanguage } from '../../i18n/resolve-language';
import { UserSettingKey } from '../../utils/user-settings';
import LanguageList from './LanguageList';
import classes from './Language.module.scss';

/** The language that an entry of the list stands for. */
function languageOf(setting: LanguageSetting): LanguageCode {
  return setting === languageSettingAuto ? browserLanguage() : setting;
}

/**
 * The Language page: the list to choose the Language setting from, which is
 * saved in the browser with the other settings. It is a page of its own, as the
 * list of every language would make the Settings page too tall.
 */
const Language: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userSettings, setUserSetting } = useUserSettings();
  const photoCtx = useContext(PhotoContext);

  // A saved value that names no language the app has is shown as the default.
  const saved: LanguageSetting = isLanguageSetting(userSettings.language)
    ? userSettings.language
    : languageSettingAuto;
  /** The entry the user chose, while its language is being fetched. */
  const [choosing, setChoosing] = useState<LanguageSetting | null>(null);
  const [isLoadFailed, setIsLoadFailed] = useState(false);
  /** Counts the choices, so that only the last one takes effect when languages arrive out of order. */
  const choices = useRef(0);

  const selected = choosing ?? saved;
  // TL;DR: The chosen entry can be chosen again while the app is not shown in
  // its language, which is how the user asks for that language again.
  // Details: When a language cannot be fetched as the app starts, the app is
  // shown in English and the setting stays, so the entry of that language is
  // the chosen one on a page in English. Choosing it would do nothing, as it
  // does while its language is the one shown.
  const isSelectedShown = languageOf(selected) === i18n.language;

  const handleChoose = async (setting: LanguageSetting) => {
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
      return;
    }
    if (choice !== choices.current) {
      return; // Another entry was chosen since: its language is the one to show.
    }
    // Asking again for the language of the saved setting changes no setting.
    if (setting !== saved) setUserSetting(UserSettingKey.Language, setting);
    await applyLanguage(language); // At once, as the language is loaded.
    // The language shown now, beside the setting, which does not tell it when
    // it follows the browser. Also when the setting stayed and its language
    // was asked for again: the language shown changed then.
    trackChangedLanguageInUse(language);
    setChoosing(null);
    // After the language is applied, so that the photo's dates are in it.
    photoCtx.reloadPhoto();
  };

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>{t('language.title')}</div>
      <div className={classes['language-list']}>
        <LanguageList
          selected={selected}
          canChooseSelected={!isSelectedShown}
          onChoose={handleChoose}
        />
        {isLoadFailed && (
          <div className={classes['load-failed']} role='alert'>
            {t('language.loadFailed')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Language;
