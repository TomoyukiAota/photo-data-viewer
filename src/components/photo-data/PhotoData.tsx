import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import StyledTab from '../tab/StyledTab';
import PhotoDataDetails from './PhotoDataDetails';
import PhotoDataGeneral from './PhotoDataGeneral';
import PhotoDataRawData from './PhotoDataRawData';
import classes from './PhotoData.module.scss';

// The tabs' values, which tell them apart; their labels are translated.
const TabName = {
  General: 'General',
  Details: 'Details',
  RawData: 'Raw Data',
};

const PhotoData: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  const [selectedTabName, setSelectedTabName] = useState(TabName.General);

  const handleTabsChange = (
    event: React.SyntheticEvent,
    newTabName: string
  ) => {
    setSelectedTabName(newTabName);
  };

  return (
    <div className={classes.container}>
      {/*
        Scrollable, for a language whose labels are wider than a phone's window:
        the tabs are swiped along, and choosing one brings it into view.
        TL;DR: without MUI's scroll buttons.
        Details: MUI shows them when a tab is less than 99% in view, and this
        bar is a pixel lower than its tabs while the table under it is tall, so
        they would appear with nothing to scroll.
      */}
      <Tabs
        value={selectedTabName}
        onChange={handleTabsChange}
        variant='scrollable'
        scrollButtons={false}
        sx={{ borderBottom: 1, borderColor: 'divider', padding: '0 10px' }}
      >
        <StyledTab label={t('photoData.tabs.general')} value={TabName.General} />
        <StyledTab label={t('photoData.tabs.details')} value={TabName.Details} />
        <StyledTab label={t('photoData.tabs.rawData')} value={TabName.RawData} />
      </Tabs>
      <div className={classes['tab-content']}>
        {selectedTabName === TabName.General && <PhotoDataGeneral />}
        {selectedTabName === TabName.Details && <PhotoDataDetails />}
        {selectedTabName === TabName.RawData && <PhotoDataRawData />}
      </div>
    </div>
  );
};

export default PhotoData;
