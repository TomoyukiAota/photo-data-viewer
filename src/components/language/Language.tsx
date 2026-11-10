import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PhotoContext from '../../context/photo/photo-context';
import { useUserSettings } from '../../hooks/useUserSettings';
import { applyLanguage, loadLanguage } from '../../i18n/i18n';
import {
  isLanguageSetting,
  LanguageSetting,
  languageSettingAuto,
} from '../../i18n/languages';
import { browserLanguage } from '../../i18n/resolve-language';
import { UserSettingKey } from '../../utils/user-settings';
import LanguageList from './LanguageList';
import classes from './Language.module.scss';

/**
 * The Language page: the list to choose the Language setting from, which is
 * saved in the browser with the other settings. It is a page of its own, as the
 * list of every language would make the Settings page too tall.
 */
const Language: React.FC = () => {
  const { t } = useTranslation();
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

  const handleChoose = async (setting: LanguageSetting) => {
    const choice = ++choices.current;
    const language =
      setting === languageSettingAuto ? browserLanguage() : setting;
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
    setUserSetting(UserSettingKey.Language, setting);
    await applyLanguage(language); // At once, as the language is loaded.
    setChoosing(null);
    // After the language is applied, so that the photo's dates are in it.
    photoCtx.reloadPhoto();
  };

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>{t('language.title')}</div>
      <div className={classes['language-list']}>
        <LanguageList selected={choosing ?? saved} onChoose={handleChoose} />
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
