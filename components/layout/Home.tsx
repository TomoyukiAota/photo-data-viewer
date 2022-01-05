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
            <ReflexElement className='left-pane'>
              <div className='pane-content'>
                <label>Left Pane (resizable)</label>
              </div>
            </ReflexElement>
            <ReflexSplitter />
            <ReflexElement className='right-pane' minSize={200}>
              <div className='pane-content'>
                <label>
                  Right Pane (resizable)
                  <br />
                  <br />
                  minSize = 200px
                  <br />
                  maxSize = 800px
                </label>
              </div>
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}

export default Home;
