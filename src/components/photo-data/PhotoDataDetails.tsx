import React, { useContext } from 'react';
import { useThrottledAppLayout } from '../../hooks/useAppLayout';
import PhotoContext from '../../context/photo/photo-context';
import { createDetailDataRows } from './row/detail-data-row';
import NameValueGrid from './grid/NameValueGrid';

function getNameColumnWidth(windowWidth: number): number {
  if (windowWidth > 600) {
    return 300;
  } else {
    return 170;
  }
}

const PhotoDataDetails: React.FC<{ className?: string }> = () => {
  const appLayout = useThrottledAppLayout();
  const nameColumnWidth = getNameColumnWidth(appLayout.windowWidth);
  const photoCtx = useContext(PhotoContext);
  const rows = createDetailDataRows(photoCtx.loadedPhotoData);
  return (
    <NameValueGrid
      rows={rows}
      columnExtensions={[{ columnName: 'name', width: nameColumnWidth }]}
    />
  );
};

export default PhotoDataDetails;
