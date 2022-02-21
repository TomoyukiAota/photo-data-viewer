import {
  HandlerProps,
  ReflexContainer,
  ReflexElement,
  ReflexSplitter,
} from 'react-reflex';
import 'react-reflex/styles.css';

import {
  UserSettingKey,
  UserSettingKeyType,
  useUserSettings,
} from '../../hooks/useUserSettings';

import homeClasses from './Home.module.scss';
import classes from './HomeWideLayout.module.scss';

const HomeWideLayout: React.FC<{
  header: JSX.Element;
  photoImage: JSX.Element;
  photoMap: JSX.Element;
  photoData: JSX.Element;
}> = (props) => {
  const { userSettings, setUserSetting } = useUserSettings();

  const headerHeight = 120;
  const isHeaderVisible = true;

  const photoImagePaneFlex = userSettings.wideLayoutPhotoImagePaneSize;
  const photoDataPaneFlex = userSettings.wideLayoutPhotoDataPaneSize;
  const onResizePane = (
    event: HandlerProps,
    userSettingKey: UserSettingKeyType
  ) => {
    const size = event.component.props.flex;
    setUserSetting(userSettingKey, size);
  };

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
                <ReflexElement
                  minSize={100}
                  flex={photoImagePaneFlex}
                  onStopResize={(event) =>
                    onResizePane(
                      event,
                      UserSettingKey.WideLayoutPhotoImagePaneSize
                    )
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
              flex={photoDataPaneFlex}
              onStopResize={(event) =>
                onResizePane(event, UserSettingKey.WideLayoutPhotoDataPaneSize)
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
