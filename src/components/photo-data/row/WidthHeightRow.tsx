import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import PhotoDimensionsContext from '../../../context/photo-dimensions/photo-dimensions-context';

const WidthHeightRow: React.FC = () => {
  const { t } = useTranslation();
  const { dimensions, loadStatus } = useContext(PhotoDimensionsContext);

  if (loadStatus === 'Not Loaded') {
    return <div />; // at app start
  } else if (loadStatus === 'Loading') {
    return <div>{t('photoData.loading')}</div>;
  } else if (loadStatus === 'Load Failed') {
    return <div>{t('photoData.notAvailable')}</div>;
  }

  if (!dimensions) {
    console.assert(
      false,
      "Something went wrong when loadStatus === 'Load Success' and dimensions is falsy."
    );
    return <div />;
  }

  const { width, height } = dimensions;
  return <div>{t('photoData.general.dimensions', { width, height })}</div>;
};

export default WidthHeightRow;
