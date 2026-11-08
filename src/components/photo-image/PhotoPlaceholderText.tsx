import { useTranslation } from 'react-i18next';

import PhotoText from './PhotoText';

/** The photo pane before a photo is chosen. */
const PhotoPlaceholderText: React.FC = () => {
  const { t } = useTranslation();
  return <PhotoText>{t('photo.willBeDisplayedHere')}</PhotoText>;
};

export default PhotoPlaceholderText;
