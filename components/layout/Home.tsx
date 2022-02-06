import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import PhotoData from '../photo-data/PhotoData';
import PhotoImageContainer from '../photo-image/PhotoImageContainer';
import PhotoMap from '../PhotoMap';

import Header from './Header';
import classes from './Home.module.scss';

const Home: React.FC = () => {
  const headerHeight = 100;
  const isHeaderVisible = true;

  return (
    <div className={classes.home}>
      <ReflexContainer orientation='horizontal'>
        {isHeaderVisible && (
          <ReflexElement
            minSize={headerHeight}
            maxSize={headerHeight}
            style={{
              height: `${headerHeight}px`,
              minHeight: `${headerHeight}px`,
              maxHeight: `${headerHeight}px`,
            }}
          >
            <Header></Header>
          </ReflexElement>
        )}
        <ReflexElement>
          <ReflexContainer orientation='vertical'>
            <ReflexElement minSize={100}>
              <ReflexContainer orientation='horizontal'>
                <ReflexElement minSize={100}>
                  <PhotoImageContainer />
                </ReflexElement>
                <ReflexSplitter
                  className={classes['horizontal-splitter']}
                  style={{ height: '8px', border: 0 }}
                />
                <ReflexElement minSize={100}>
                  <PhotoMap />
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <ReflexSplitter
              className={classes['vertical-splitter']}
              style={{ width: '8px', border: 0 }}
            />
            <ReflexElement minSize={100}>
              <PhotoData />
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default Home;
