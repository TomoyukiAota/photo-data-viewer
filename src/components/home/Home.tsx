import { useState } from 'react';

import { AppIntegration } from '../../app-integration/app-integration';
import { useThrottledAppLayout } from '../../hooks/useAppLayout';
import LayoutButton, { LayoutButtonFocus } from '../layout-mode/LayoutButton';
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
  const [layoutButtonFocus] = useState(() => new LayoutButtonFocus());

  const photoImage = <PhotoImageContainer />;
  const photoMap = <PhotoMap />;

  // TL;DR: In Photo Location Map, the layout is chosen with the button Layout,
  // at the end of the topmost tabs: the data's beside the split panes, or
  // those of the single pane.
  // Details: Its window shows neither the header nor the menu, whose entry
  // Layout chooses it in the standalone app. In a single pane, the data's own
  // tabs are under the pane's, and have no button.
  const layoutButton = AppIntegration.isPlm ? (
    <LayoutButton focus={layoutButtonFocus} />
  ) : undefined;

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
            photoData={<PhotoData afterTabs={layoutButton} />}
          />
        ) : (
          <HomeNarrowLayout
            photoImage={photoImage}
            photoMap={photoMap}
            photoData={<PhotoData />}
            afterTabs={layoutButton}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
