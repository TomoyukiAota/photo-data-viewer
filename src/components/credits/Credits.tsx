/* eslint-disable @next/next/no-img-element */

import { useTranslation } from 'react-i18next';

import { IconDataUrl } from '../../icons/icon-data-url';
import { iconCredits, iconsOnDark } from './icon-credits';

import classes from './Credits.module.scss';

const FLATICON_URL = 'https://www.flaticon.com/';

/**
 * The Credits page: the authors of the icons that the app shows, from
 * Flaticon, a line for each author beside the author's icons (icon-credits.ts).
 *
 * The lines are Flaticon's words, in English in every language, read from left
 * to right; the page's title and the sentence before them are translated. The
 * icons are pictures of what the lines say, so a screen reader passes them by.
 */
const Credits: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>{t('credits.title')}</div>
      <div className={classes.intro}>{t('credits.icons')}</div>
      <ul className={classes.credits}>
        {iconCredits.map((credit) => (
          <li key={credit.author} className={classes.credit}>
            <span className={classes.icons}>
              {credit.icons.map((icon) => (
                <img
                  key={icon}
                  className={`${classes.icon} ${iconsOnDark.has(icon) ? classes['on-dark'] : ''}`}
                  src={IconDataUrl[icon]}
                  alt=''
                />
              ))}
            </span>
            <span className={classes.line} dir='ltr'>
              {credit.icons.length > 1 ? 'Icons' : 'Icon'} made by{' '}
              <a href={credit.authorUrl} target='_blank' rel='noopener'>
                {credit.author}
              </a>{' '}
              from{' '}
              <a href={FLATICON_URL} target='_blank' rel='noopener'>
                www.flaticon.com
              </a>
              {credit.license && (
                <>
                  , licensed under{' '}
                  <a href={credit.license.url} target='_blank' rel='noopener'>
                    {credit.license.name}
                  </a>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Credits;
