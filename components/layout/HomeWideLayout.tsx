import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import homeClasses from './Home.module.scss';

import classes from './HomeWideLayout.module.scss';

const HomeWideLayout: React.FC<{
  header: JSX.Element;
  photoImage: JSX.Element;
  photoMap: JSX.Element;
  photoData: JSX.Element;
}> = (props) => {
  const headerHeight = 100;
  const isHeaderVisible = true;

  return (
    <div className={homeClasses.home}>
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
            {props.header}
          </ReflexElement>
        )}
        <ReflexElement>
          <ReflexContainer orientation='vertical'>
            <ReflexElement minSize={100}>
              <ReflexContainer orientation='horizontal'>
                <ReflexElement minSize={100}>{props.photoImage}</ReflexElement>
                <ReflexSplitter
                  className={classes['horizontal-splitter']}
                  style={{ height: '8px', border: 0 }}
                />
                <ReflexElement minSize={100}>{props.photoMap}</ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <ReflexSplitter
              className={classes['vertical-splitter']}
              style={{ width: '8px', border: 0 }}
            />
            <ReflexElement minSize={100}>{props.photoData}</ReflexElement>
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default HomeWideLayout;
