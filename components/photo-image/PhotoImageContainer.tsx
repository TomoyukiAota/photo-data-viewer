import { useContext } from 'react';

import PhotoContext from '../../store/photo/photo-context';
import classes from './PhotoImageContainer.module.scss';

const PhotoImageContainer: React.FC<{ className?: string }> = (props) => {
  const photoCtx = useContext(PhotoContext);

  return <div className={classes.background}>{photoCtx.loadedPhotoImage}</div>;
};

export default PhotoImageContainer;
