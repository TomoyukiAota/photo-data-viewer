import { useTranslation } from 'react-i18next';

import PhotoText from './PhotoText';
import classes from './PhotoLoadingText.module.scss';

const PhotoLoadingText: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  return (
    <PhotoText className={classes['loading-text']}>
      {t('photo.loading')}
    </PhotoText>
  );
};

export default PhotoLoadingText;
