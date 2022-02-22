import React, { useContext } from 'react';
import { useAppLayout } from '../../hooks/useAppLayout';
import PhotoContext from '../../store/photo/photo-context';
import { createGeneralDataRows } from './row/general-data-row';
import NameValueGrid from './grid/NameValueGrid';

function getNameColumnWidth(windowWidth: number): number {
  if (windowWidth > 600) {
    return 200;
  } else {
    return 170;
  }
}

const PhotoDataGeneral: React.FC<{ className?: string }> = () => {
  const appLayout = useAppLayout();
  const nameColumnWidth = getNameColumnWidth(appLayout.windowWidth);
  const photoCtx = useContext(PhotoContext);
  const rows = createGeneralDataRows(photoCtx.loadedPhotoData);
  return (
    <NameValueGrid
      rows={rows}
      columnExtensions={[{ columnName: 'name', width: nameColumnWidth }]}
    />
  );
};

export default PhotoDataGeneral;