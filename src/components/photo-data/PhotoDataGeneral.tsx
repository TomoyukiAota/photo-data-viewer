import React, { useContext } from 'react';
import { useThrottledAppLayout } from '../../hooks/useAppLayout';
import PhotoContext from '../../context/photo/photo-context';
import { isIos } from '../../utils/os';
import { createGeneralDataRows } from './row/general-data-row';
import NameValueGrid from './grid/NameValueGrid';
import classes from './PhotoDataGeneral.module.scss';

function getNameColumnWidth(windowWidth: number): number {
  if (windowWidth > 600) {
    return 200;
  } else {
    return 130;
  }
}

const PhotoDataGeneral: React.FC<{ className?: string }> = () => {
  const appLayout = useThrottledAppLayout();
  const nameColumnWidth = getNameColumnWidth(appLayout.windowWidth);
  const photoCtx = useContext(PhotoContext);
  const rows = createGeneralDataRows(photoCtx.loadedPhotoData);
  const isIosMessageVisible =
    isIos() && photoCtx.loadedPhotoData?.isExifAvailable;

  return (
    <div className={classes.container}>
      <div className={classes.table}>
        <NameValueGrid
          rows={rows}
          columnExtensions={[{ columnName: 'name', width: nameColumnWidth }]}
        />
      </div>
      {isIosMessageVisible && (
        <div className={classes.message}>
          For iOS users, iOS removes some EXIF data (e.g. latitude and
          longitude) in some cases. Please read{' '}
          <a
            href='https://stackoverflow.com/questions/57942150/file-upload-and-exif-in-mobile-safari'
            target='_blank'
            rel='noreferrer'
          >
            this page
          </a>{' '}
          for details.
        </div>
      )}
    </div>
  );
};

export default PhotoDataGeneral;
