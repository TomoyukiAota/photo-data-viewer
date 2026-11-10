import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css';

import { AppIntegration } from '../../app-integration/app-integration';
import StyledTab from '../tab/StyledTab';
import homeClasses from './Home.module.scss';
import classes from './HomeNarrowLayout.module.scss';

// The tabs' values, which tell them apart; their labels are translated.
const TabName = {
  Data: 'Data',
  Map: 'Map',
  Photo: 'Photo',
};

const HomeNarrowLayout: React.FC<{
  header: React.JSX.Element;
  photoImage: React.JSX.Element;
  photoMap: React.JSX.Element;
  photoData: React.JSX.Element;
}> = (props) => {
  const { t } = useTranslation();
  const headerHeight = 130;
  const isHeaderVisible = AppIntegration.isStandalone;

  const [selectedTabName, setSelectedTabName] = useState(TabName.Data);

  const handleTabsChange = (
    event: React.SyntheticEvent,
    newTabName: string,
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
            {/* Scrollable without buttons, as the tabs of PhotoData.tsx are. */}
            <Tabs
              value={selectedTabName}
              onChange={handleTabsChange}
              variant='scrollable'
              scrollButtons={false}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                padding: '0 10px',
              }}
            >
              <StyledTab label={t('home.tabs.data')} value={TabName.Data} />
              <StyledTab label={t('home.tabs.map')} value={TabName.Map} />
              <StyledTab label={t('home.tabs.photo')} value={TabName.Photo} />
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
