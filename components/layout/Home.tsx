import { useWindowWidth } from '@react-hook/window-size/throttled';

import PhotoData from '../photo-data/PhotoData';
import PhotoImageContainer from '../photo-image/PhotoImageContainer';
import PhotoMap from '../PhotoMap';

import Header from './Header';
import HomeNarrowLayout from './HomeNarrowLayout';
import HomeWideLayout from './HomeWideLayout';
import classes from './Home.module.scss';

const Home: React.FC = () => {
  const windowWidth = useWindowWidth();
  const shouldUseWideLayout = windowWidth > 1200;

  const header = <Header />;
  const photoImage = <PhotoImageContainer />;
  const photoMap = <PhotoMap />;
  const photoData = <PhotoData />;

  return (
    <>
      {shouldUseWideLayout ? (
        <HomeWideLayout
          header={header}
          photoImage={photoImage}
          photoMap={photoMap}
          photoData={photoData}
        />
      ) : (
        <HomeNarrowLayout
          header={header}
          photoImage={photoImage}
          photoMap={photoMap}
          photoData={photoData}
        />
      )}
    </>
  );
};

export default Home;
