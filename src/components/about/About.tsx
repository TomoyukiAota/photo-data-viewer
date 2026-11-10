/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { Trans, useTranslation } from 'react-i18next';

import { IconDataUrl } from '../../icons/icon-data-url';
import { appName } from '../../app-integration/app-name';
import { openUrl } from '../../utils/open-url';

import classes from './About.module.scss';

const About: React.FC = () => {
  const { t } = useTranslation();
  const profileIconWidthHeight = '40px'; // Specifying width and height of <img> instead of using CSS to avoid flickering when switching pages

  // The descriptions given to the analytics stay English, whatever the language.
  const handleXFormerlyTwitterProfileIconClicked = () => {
    openUrl(
      'https://x.com/TomoyukiAota',
      'X (Formerly Twitter) Profile of Tomoyuki Aota',
      'About Page',
    );
  };
  const handleGitHubProfileIconClicked = () => {
    openUrl(
      'https://github.com/TomoyukiAota',
      'GitHub Profile of Tomoyuki Aota',
      'About Page',
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes['app-name']}>{appName.standalone}</div>
      <div className={classes['messages']}>
        <div>
          <Trans i18nKey='about.keptInBrowser' />
        </div>
        <div>
          <Trans
            i18nKey='about.usageData'
            components={{ settingsLink: <Link href='/settings' /> }}
          />
        </div>
        <div>
          <Trans
            i18nKey='about.reportIssues'
            components={{
              issuesLink: (
                <a
                  href='https://github.com/TomoyukiAota/photo-data-viewer/issues'
                  target='_blank'
                  rel='noopener'
                />
              ),
            }}
          />
        </div>
        <div>
          <Trans
            i18nKey='about.sourceCode'
            components={{
              gitHubLink: (
                <a
                  href='https://github.com/TomoyukiAota/photo-data-viewer'
                  target='_blank'
                  rel='noopener'
                />
              ),
            }}
          />
        </div>
        <div>
          <Trans
            i18nKey='about.translations'
            components={{
              guideLink: (
                <a
                  href='https://github.com/TomoyukiAota/photo-data-viewer/blob/main/docs/TRANSLATING.md'
                  target='_blank'
                  rel='noopener'
                />
              ),
            }}
          />
        </div>
      </div>
      <div className={classes['developed-by']}>
        <span className={classes['developed-by-message']}>
          {t('about.developedBy')}
        </span>
        <img
          className={classes['x-formerly-twitter-profile-icon']}
          src={IconDataUrl.xFormerlyTwitterLogo}
          alt={t('about.xProfile.alt')}
          title={t('about.xProfile.title')}
          width={profileIconWidthHeight}
          height={profileIconWidthHeight}
          onClick={handleXFormerlyTwitterProfileIconClicked}
        />
        <img
          className={classes['github-profile-icon']}
          src={IconDataUrl.gitHubLogo}
          alt={t('about.gitHubProfile.alt')}
          title={t('about.gitHubProfile.title')}
          width={profileIconWidthHeight}
          height={profileIconWidthHeight}
          onClick={handleGitHubProfileIconClicked}
        />
      </div>
      <div className={classes['plm']}>
        <Trans
          i18nKey='about.photoLocationMap'
          components={{
            plmLink: (
              <a
                href='https://tomoyukiaota.github.io/photo-location-map/'
                target='_blank'
                rel='noopener'
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default About;
