/* eslint-disable @next/next/no-img-element */

import { IconDataUrl } from '../../icons/icon-data-url';
import { appName } from '../../app-integration/app-name';
import { openUrl } from '../../utils/open-url';

import classes from './About.module.scss';

const About: React.FC = () => {
  const handleTwitterProfileIconClicked = () => {
    openUrl(
      'https://twitter.com/TomoyukiAota',
      'Twitter Profile of Tomoyuki Aota',
      'About Page'
    );
  };
  const handleGitHubProfileIconClicked = () => {
    openUrl(
      'https://github.com/TomoyukiAota',
      'GitHub Profile of Tomoyuki Aota',
      'About Page'
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
          To improve this application, this application collects anonymized{' '}
          <br />
          usage information (e.g. opening this page) using Google Analytics.{' '}
          <br />
          You agree to it by continuing to use this application.
        </div>
        <div>
          If you find any bugs or issues, please submit them in{' '}
          <a
            href='https://github.com/TomoyukiAota/photo-data-viewer/issues'
            target='_blank'
            rel='noopener noreferrer'
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
            rel='noopener noreferrer'
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
          className={classes['twitter-profile-icon']}
          src={IconDataUrl.twitterLogo}
          alt='Twitter Profile'
          title='Open Twitter Profile'
          onClick={handleTwitterProfileIconClicked}
        />
        <img
          className={classes['github-profile-icon']}
          src={IconDataUrl.gitHubLogo}
          alt='GitHub Profile'
          title='Open GitHub Profile'
          onClick={handleGitHubProfileIconClicked}
        />
      </div>
    </div>
  );
};

export default About;
