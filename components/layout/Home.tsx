import PhotoData from '../photo-data/PhotoData';
import PhotoImageContainer from '../photo-image/PhotoImageContainer';
import PhotoMap from '../PhotoMap';

import Header from './Header';
import HomeWideLayout from './HomeWideLayout';
import classes from './Home.module.scss';

const Home: React.FC = () => {
  return (
    <HomeWideLayout
      header={<Header />}
      photoImage={<PhotoImageContainer />}
      photoMap={<PhotoMap />}
      photoData={<PhotoData />}
    />
  );
};

export default Home;
