import React, { useContext } from 'react';
import PhotoContext from '../../store/photo-context';
import { createGeneralDataRows } from './row/general-data-row';
import NameValueGrid from './grid/NameValueGrid';

const PhotoDataDetails: React.FC<{ className?: string }> = () => {
  const photoCtx = useContext(PhotoContext);
  const rows = createGeneralDataRows(photoCtx.loadedPhotoData);
  return <NameValueGrid rows={rows} />;
};

export default PhotoDataDetails;
