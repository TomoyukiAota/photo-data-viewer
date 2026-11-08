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
      <Tabs
        value={selectedTabName}
        onChange={handleTabsChange}
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
