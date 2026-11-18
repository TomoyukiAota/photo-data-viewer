import LanguageIcon from '@mui/icons-material/Language';
import Popover from '@mui/material/Popover';
import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIsRtl } from '../../direction/DirectionProvider';
import { useLanguageChoice } from '../../hooks/useLanguageChoice';
import {
  getLanguage,
  isLanguageCode,
  LanguageSetting,
} from '../../i18n/languages';
import LanguageList from './LanguageList';
import classes from './LanguagePicker.module.scss';

/**
 * The language's button of the Home page's header, before the menu's button,
 * which opens a box under it with the list of languages: the language picker
 * of Photo Location Map's website, in this app.
 *
 * TL;DR: A button with a globe, the name of the language shown and an arrow,
 * whose box has a search field above the list, as the website's has. A choice
 * is the Language page's (useLanguageChoice).
 * Details: The button says that it opens a dialog, and whether it is open.
 * The box takes the keyboard's focus, on the search field where a keyboard is
 * at hand (LanguageList); Escape or a click outside it closes it, and gives
 * the focus back to the button, as choosing a language does once the
 * language is shown. A language that cannot be fetched is said in the box,
 * which stays open. In a phone's width the button shows the globe alone, and
 * the name of the language is read aloud with it.
 */
const LanguagePicker: React.FC<{ className?: string }> = (props) => {
  const { t, i18n } = useTranslation();
  const isRtl = useIsRtl();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);
  /**
   * How many times the box was opened. The list starts anew each time, as
   * the website's does: the search cleared, the chosen entry in view and the
   * focus on the search field, also when the box is opened again before it
   * has finished closing, which would keep the list as it was.
   */
  const [openings, setOpenings] = useState(0);
  const popupId = useId();
  const { selected, isSelectedShown, isLoadFailed, choose } =
    useLanguageChoice();
  const shown = isLanguageCode(i18n.language)
    ? getLanguage(i18n.language)
    : null;

  const handleChoose = async (setting: LanguageSetting) => {
    if (await choose(setting)) setAnchorEl(null);
  };

  return (
    <div className={props.className}>
      <button
        type='button'
        className={classes.button}
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-controls={isOpen ? popupId : undefined}
        onClick={(event) => {
          if (isOpen) {
            setAnchorEl(null);
          } else {
            setOpenings((count) => count + 1);
            setAnchorEl(event.currentTarget);
          }
        }}
      >
        {/* Read aloud before the name of the language, and not shown. */}
        <span className={classes['hidden-label']}>{t('language.title')}</span>
        {/* A globe, which says what the button is for in any language. */}
        <LanguageIcon
          sx={{ flex: 'none', fontSize: '18px', color: '#495057' }}
        />
        <span className={classes.name} lang={shown?.code}>
          {shown?.name}
        </span>
        <svg
          className={classes.chevron}
          viewBox='0 0 16 16'
          aria-hidden='true'
          focusable='false'
        >
          <path d='m2 5 6 6 6-6' />
        </svg>
      </button>
      <Popover
        id={popupId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        // Under the button, at the edge where its line ends, and inside the
        // window.
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isRtl ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isRtl ? 'left' : 'right',
        }}
        slotProps={{
          paper: {
            role: 'dialog',
            'aria-label': t('language.title'),
            // The box of the website: 260 pixels wide, and wider where an
            // entry needs it, up to the window's width.
            sx: {
              marginTop: '6px',
              boxSizing: 'border-box',
              width: 'max-content',
              minWidth: '260px',
              padding: '8px',
              border: '1px solid rgba(0, 0, 0, 0.15)',
              borderRadius: '6px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
              color: '#212529',
            },
          },
        }}
      >
        <LanguageList
          key={openings}
          look='popup'
          selected={selected}
          canChooseSelected={!isSelectedShown}
          onChoose={handleChoose}
        />
        {isLoadFailed && (
          <div className={classes['load-failed']} role='alert'>
            {t('language.loadFailed')}
          </div>
        )}
      </Popover>
    </div>
  );
};

export default LanguagePicker;
