import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import Header from './Header';
import classes from './Home.module.scss';

function Home() {
  const headerHeight = 100;
  const isHeaderVisible = true;

  return (
    <div className={classes.home}>
      <ReflexContainer orientation='horizontal'>
        {isHeaderVisible && (
          <ReflexElement minSize={headerHeight} maxSize={headerHeight}>
            <Header></Header>
          </ReflexElement>
        )}
        <ReflexElement>
          <ReflexContainer orientation='vertical'>
            <ReflexElement minSize={100}>
              <ReflexContainer orientation='horizontal'>
                <ReflexElement minSize={100}>Photo</ReflexElement>
                <ReflexSplitter />
                <ReflexElement minSize={100}>Map</ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement minSize={100}>Data</ReflexElement>
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
