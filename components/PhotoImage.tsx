import { Fragment, useContext } from 'react';

import PhotoContext from '../store/photo-context';

const PhotoImage: React.FC<{ className?: string }> = (props) => {
  const photoCtx = useContext(PhotoContext);

  return <Fragment>{photoCtx.loadedPhotoImage}</Fragment>;
};

export default PhotoImage;
