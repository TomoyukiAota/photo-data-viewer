import { useContext } from 'react';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import GutterPositionContext from '../../context/gutter-position/gutter-position-context';

import classes from './HomeWideLayout.module.scss';

/**
 * The photo and the map in one column and the data in another, with splitters
 * between them: the layout under the header in the mode Side by side, or in a
 * wide window. Each pane keeps 100 pixels at least, which two columns have in
 * a phone's window as well.
 */
const HomeWideLayout: React.FC<{
  photoImage: React.JSX.Element;
  photoMap: React.JSX.Element;
  photoData: React.JSX.Element;
}> = (props) => {
  const gutterCtx = useContext(GutterPositionContext).wideLayout;

  return (
    <ReflexContainer orientation='vertical' className={classes['side-by-side']}>
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
  );
};

export default HomeWideLayout;
