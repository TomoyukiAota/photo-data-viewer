import { useTranslation } from 'react-i18next';

import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';

const GridRow: React.FC<{
  className?: string;
  loadedPhotoData?: LoadedPhotoData | null;
  data?: string;
}> = (props) => {
  const { t } = useTranslation();
  if (!props?.loadedPhotoData?.isFileLoaded) {
    return <div />;
  }
  if (!props?.data) {
    return <div>{t('photoData.notAvailable')}</div>;
  }

  return <div>{props.data}</div>;
};

export default GridRow;
