import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import StyledTab from '../tab/StyledTab';
import classes from './HomeNarrowLayout.module.scss';

// The tabs' values, which tell them apart; their labels are translated.
const TabName = {
  Data: 'Data',
  Map: 'Map',
  Photo: 'Photo',
};

/** The photo, the map and the data, one at a time under tabs: the layout under the header in the mode Tabs, or in a narrow window. */
const HomeNarrowLayout: React.FC<{
  photoImage: React.JSX.Element;
  photoMap: React.JSX.Element;
  photoData: React.JSX.Element;
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
  );
};

export default HomeNarrowLayout;
