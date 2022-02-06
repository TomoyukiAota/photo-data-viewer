import PhotoText from './PhotoText';
import classes from './PhotoLoadingText.module.scss';

const PhotoLoadingText: React.FC<{ className?: string }> = (props) => {
  return (
    <PhotoText className={classes['loading-text']}>
      Loading the selected photo...
    </PhotoText>
  );
};

export default PhotoLoadingText;
