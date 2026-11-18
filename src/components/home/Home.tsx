import { AppIntegration } from '../../app-integration/app-integration';
import { useThrottledAppLayout } from '../../hooks/useAppLayout';
import PhotoData from '../photo-data/PhotoData';
import PhotoImageContainer from '../photo-image/PhotoImageContainer';
import PhotoMap from '../photo-map/PhotoMap';

import Header from './Header';
import HomeNarrowLayout from './HomeNarrowLayout';
import HomeWideLayout from './HomeWideLayout';
import classes from './Home.module.scss';

const Home: React.FC = () => {
  const appLayout = useThrottledAppLayout();
  const isHeaderVisible = AppIntegration.isStandalone;

  const photoImage = <PhotoImageContainer />;
  const photoMap = <PhotoMap />;
  const photoData = <PhotoData />;

  // TL;DR: The header stays where it is when the layout changes, and only
  // what is under it changes.
  // Details: The layout is chosen with a button of the header (LayoutMenu).
  // Inside each layout, the header was rendered anew when the layout
  // changed, and the keyboard's focus, which is on that button after the
  // choice, was lost.
  return (
    <div className={classes.home}>
      {/* As high as its texts need; the panes have the rest of the window. */}
      {isHeaderVisible && <Header />}
      <div className={classes.main}>
        {appLayout.isWideLayout ? (
          <HomeWideLayout
            photoImage={photoImage}
            photoMap={photoMap}
            photoData={photoData}
          />
        ) : (
          <HomeNarrowLayout
            photoImage={photoImage}
            photoMap={photoMap}
            photoData={photoData}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
