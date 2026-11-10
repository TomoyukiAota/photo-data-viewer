import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import PhotoContext from '../../context/photo/photo-context';
import classes from './PhotoDataRawData.module.scss';

const StringifiedData: React.FC<{
  className?: string;
  stringifiedData?: string;
}> = (props) => {
  return (
    <div className={classes['stringified-data-container']}>
      <div className={classes.description}>
        <Trans
          i18nKey='photoData.rawData.description'
          components={{
            exifrLink: (
              <a
                href='https://github.com/MikeKovarik/exifr/'
                target='_blank'
                rel='noopener'
              />
            ),
          }}
        />
      </div>
      <hr className={classes.divider} />
      {/* JSON, which is written from left to right in every language. */}
      <div className={classes['stringified-data']} dir='ltr'>
        {props.stringifiedData}
      </div>
    </div>
  );
};

const PhotoDataRawData: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  const photoCtx = useContext(PhotoContext);
  const stringifiedData = JSON.stringify(
    photoCtx.loadedPhotoData?.exif?.exifrParseOutput,
    null,
    4
  );
  return (
    <div className={classes.container}>
      {!stringifiedData && (
        <div className={classes['no-data']}>{t('photoData.noData')}</div>
      )}
      {stringifiedData && <StringifiedData stringifiedData={stringifiedData} />}
    </div>
  );
};

export default PhotoDataRawData;
