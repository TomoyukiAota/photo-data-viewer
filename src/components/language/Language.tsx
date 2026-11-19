import { useTranslation } from 'react-i18next';

import { useLanguageChoice } from '../../hooks/useLanguageChoice';
import type { BrowserSettingLabels } from './browser-setting-labels';
import LanguageList from './LanguageList';
import classes from './Language.module.scss';

/**
 * The Language page: the list to choose the Language setting from, which is
 * saved in the browser with the other settings. It is a page of its own, as the
 * list of every language would make the Settings page too tall. What a choice
 * does, also on an address that names a language, is useLanguageChoice's.
 */
const Language: React.FC<{
  /** The text of the list's first entry in every language, which the page's props bring (src/pages/language.tsx). */
  browserSettingLabels: BrowserSettingLabels;
}> = ({ browserSettingLabels }) => {
  const { t } = useTranslation();
  const { selected, isSelectedShown, isLoadFailed, choose } =
    useLanguageChoice();

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>{t('language.title')}</div>
      <div className={classes['language-list']}>
        <LanguageList
          selected={selected}
          browserSettingLabels={browserSettingLabels}
          canChooseSelected={!isSelectedShown}
          onChoose={choose}
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
