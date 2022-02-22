import { useContext } from 'react';
import PhotoContext from '../../store/photo/photo-context';
import classes from './PhotoDataRawData.module.scss';

const StringifiedData: React.FC<{
  className?: string;
  stringifiedData?: string;
}> = (props) => {
  return (
    <div className={classes['stringified-data-container']}>
      <div className={classes.description}>
        The object returned from{' '}
        <a
          href='https://github.com/MikeKovarik/exifr/'
          target='_blank'
          rel='noopener noreferrer'
        >
          exifr.parse
        </a>{' '}
        function is displayed below:
      </div>
      <hr className={classes.divider} />
      <div className={classes['stringified-data']}>{props.stringifiedData}</div>
    </div>
  );
};

const PhotoDataRawData: React.FC<{ className?: string }> = (props) => {
  const photoCtx = useContext(PhotoContext);
  const stringifiedData = JSON.stringify(
    photoCtx.loadedPhotoData?.exif?.exifrParseOutput,
    null,
    4
  );
  return (
    <div className={classes.container}>
      {!stringifiedData && <div className={classes['no-data']}>No data</div>}
      {stringifiedData && (
        <StringifiedData stringifiedData={stringifiedData} />
      )}
    </div>
  );
};

export default PhotoDataRawData;
