import { useContext } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import { AppIntegration } from '../../app-integration/app-integration';
import GutterPositionContext from '../../context/gutter-position/gutter-position-context';

import homeClasses from './Home.module.scss';
import classes from './HomeWideLayout.module.scss';

const HomeWideLayout: React.FC<{
  header: JSX.Element;
  photoImage: JSX.Element;
  photoMap: JSX.Element;
  photoData: JSX.Element;
}> = (props) => {
  const headerHeight = 130;
  const isHeaderVisible = AppIntegration.isStandalone;

  const gutterCtx = useContext(GutterPositionContext).wideLayout;

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
            <ReflexElement
              minSize={100}
              className={classes['image-and-map-container']}
            >
              <ReflexContainer orientation='horizontal'>
                <ReflexElement
                  minSize={100}
                  flex={gutterCtx.photoImagePaneFlex}
                  onStopResize={(event) =>
                    gutterCtx.setPhotoImagePaneFlex(event.component.props.flex)
                  }
                >
                  {props.photoImage}
                </ReflexElement>
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
            <ReflexElement
              minSize={100}
              flex={gutterCtx.photoDataPaneFlex}
              onStopResize={(event) =>
                gutterCtx.setPhotoDataPaneFlex(event.component.props.flex)
              }
            >
              {props.photoData}
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default HomeWideLayout;
