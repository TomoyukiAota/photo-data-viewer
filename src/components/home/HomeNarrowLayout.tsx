import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import StyledTab from '../tab/StyledTab';
import TabBar from '../tab/TabBar';
import classes from './HomeNarrowLayout.module.scss';

// The tabs' values, which tell them apart; their labels are translated.
const TabName = {
  Data: 'Data',
  Map: 'Map',
  Photo: 'Photo',
};

/**
 * A single pane: the photo, the map or the data, chosen with tabs. The layout
 * under the header in the mode Single pane, and in a narrow window in the
 * automatic one.
 */
const HomeNarrowLayout: React.FC<{
  photoImage: React.JSX.Element;
  photoMap: React.JSX.Element;
  photoData: React.JSX.Element;
  /** What comes after the tabs, at the end of their row: the button Layout in Photo Location Map (Home.tsx). */
  afterTabs?: React.ReactNode;
}> = (props) => {
  const { t } = useTranslation();

  const [selectedTabName, setSelectedTabName] = useState(TabName.Data);

  const handleTabsChange = (
    event: React.SyntheticEvent,
    newTabName: string,
  ) => {
    setSelectedTabName(newTabName);
  };

  return (
    <div className={classes['tab-container']}>
      <TabBar
        value={selectedTabName}
        onChange={handleTabsChange}
        end={props.afterTabs}
      >
        <StyledTab label={t('home.tabs.data')} value={TabName.Data} />
        <StyledTab label={t('home.tabs.map')} value={TabName.Map} />
        <StyledTab label={t('home.tabs.photo')} value={TabName.Photo} />
      </TabBar>
      <div className={classes['tab-content']}>
        {selectedTabName === TabName.Data && props.photoData}
        {selectedTabName === TabName.Map && props.photoMap}
        {selectedTabName === TabName.Photo && props.photoImage}
      </div>
    </div>
  );
};

export default HomeNarrowLayout;
