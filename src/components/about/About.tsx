/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

import { IconDataUrl } from '../../icons/icon-data-url';
import { appName } from '../../app-integration/app-name';
import { openUrl } from '../../utils/open-url';

import classes from './About.module.scss';

const About: React.FC = () => {
  const profileIconWidthHeight = '40px'; // Specifying width and height of <img> instead of using CSS to avoid flickering when switching pages
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
          This application fetches EXIF data from your file within your browser,{' '}
          <br />
          so the file is kept within your browser and not sent to any servers.
        </div>
        <div>
          To improve this application, it collects usage information, such as{' '}
          <br />
          which pages are opened and what kind of photo was loaded, along with{' '}
          <br />
          your IP address and the approximate location derived from it. <br />
          You can turn this off in <Link href='/settings'>Settings</Link>.
        </div>
        <div>
          If you find any bugs or issues, please submit them in{' '}
          <a
            href='https://github.com/TomoyukiAota/photo-data-viewer/issues'
            target='_blank'
            rel='noopener'
          >
            GitHub Issues
          </a>
          .
        </div>
        <div>
          The source code of this application is hosted on{' '}
          <a
            href='https://github.com/TomoyukiAota/photo-data-viewer'
            target='_blank'
            rel='noopener'
          >
            GitHub
          </a>
          .
        </div>
      </div>
      <div className={classes['developed-by']}>
        <span className={classes['developed-by-message']}>
          This application is developed by Tomoyuki Aota.
        </span>
        <img
          className={classes['x-formerly-twitter-profile-icon']}
          src={IconDataUrl.xFormerlyTwitterLogo}
          alt='X (Formerly Twitter) Profile'
          title='Open X (Formerly Twitter) Profile'
          width={profileIconWidthHeight}
          height={profileIconWidthHeight}
          onClick={handleXFormerlyTwitterProfileIconClicked}
        />
        <img
          className={classes['github-profile-icon']}
          src={IconDataUrl.gitHubLogo}
          alt='GitHub Profile'
          title='Open GitHub Profile'
          width={profileIconWidthHeight}
          height={profileIconWidthHeight}
          onClick={handleGitHubProfileIconClicked}
        />
      </div>
      <div className={classes['plm']}>
        Want to see the map for the locations of many photos all at once?
        <br />{' '}
        <a
          href='https://tomoyukiaota.github.io/photo-location-map/'
          target='_blank'
          rel='noopener'
        >
          Photo Location Map
        </a>{' '}
        is available for such purposes.
      </div>
    </div>
  );
};

export default About;
