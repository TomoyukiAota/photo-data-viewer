import Tabs from '@mui/material/Tabs';
import { useState } from 'react';

import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import { useAppLayout } from '../../hooks/useAppLayout';
import StyledTab from '../tab/StyledTab';
import homeClasses from './Home.module.scss';
import classes from './HomeNarrowLayout.module.scss';

const TabName = {
  Data: 'Data',
  Map: 'Map',
  Photo: 'Photo',
};

const HomeNarrowLayout: React.FC<{
  header: JSX.Element;
  photoImage: JSX.Element;
  photoMap: JSX.Element;
  photoData: JSX.Element;
}> = (props) => {
  const appLayout = useAppLayout();

  const headerHeight = appLayout.windowWidth < 360 ? 120 : 100; // Use larger header height because the text is displayed in 2 lines with narrower window.
  const isHeaderVisible = true;

  const [selectedTabName, setSelectedTabName] = useState(TabName.Data);

  const handleTabsChange = (
    event: React.SyntheticEvent,
    newTabName: string
  ) => {
    setSelectedTabName(newTabName);
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
          <div className={classes['tab-container']}>
            <Tabs
              value={selectedTabName}
              onChange={handleTabsChange}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                padding: '0 10px',
              }}
            >
              <StyledTab label={TabName.Data} value={TabName.Data} />
              <StyledTab label={TabName.Map} value={TabName.Map} />
              <StyledTab label={TabName.Photo} value={TabName.Photo} />
            </Tabs>
            <div className={classes['tab-content']}>
              {selectedTabName === TabName.Data && props.photoData}
              {selectedTabName === TabName.Map && props.photoMap}
              {selectedTabName === TabName.Photo && props.photoImage}
            </div>
          </div>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
};

export default HomeNarrowLayout;
