import React, { useContext } from 'react';
import PhotoContext from '../../store/photo-context';
import { createDetailDataRows } from './row/detail-data-row';
import NameValueGrid from './grid/NameValueGrid';

const PhotoDataDetails: React.FC<{ className?: string }> = () => {
  const photoCtx = useContext(PhotoContext);
  const rows = createDetailDataRows(photoCtx.loadedPhotoData);
  return <NameValueGrid rows={rows} />;
};

export default PhotoDataDetails;
