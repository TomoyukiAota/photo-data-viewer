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

  // A photo's data, in whatever language it is written: it takes its own
  // direction, so that "3.09 MB" keeps its order in a right-to-left language.
  return <div dir='auto'>{props.data}</div>;
};

export default GridRow;
