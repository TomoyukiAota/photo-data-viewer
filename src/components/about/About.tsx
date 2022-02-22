/* eslint-disable @next/next/no-img-element */

import { IconDataUrl } from '../../icons/icon-data-url';

import classes from './About.module.scss';

const About: React.FC = () => {
  const handleTwitterProfileIconClicked = () => {
    window.open('https://twitter.com/TomoyukiAota', '_blank');
  };
  const handleGitHubProfileIconClicked = () => {
    window.open('https://github.com/TomoyukiAota', '_blank');
  };

  return (
    <div className={classes.container}>
      <div className={classes['app-name']}>Photo Data Viewer</div>
      <div className={classes['messages']}>
        <div>
          This application fetches EXIF data from your file within your browser.
          <br />
          Therefore, it does not send your file to any servers.
        </div>
        <div>
          If you find issues and bugs, please submit them in{' '}
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
