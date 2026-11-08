/* eslint-disable @next/next/no-img-element */

import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { trackOpenUrl } from '../../../analytics/track-event';
import { IconDataUrl } from '../../../icons/icon-data-url';
import { openTabWithoutOpener } from '../../../utils/open-url';

import classes from './LatLngRow.module.scss';

const LatLngRow: React.FC<{
  className?: string;
  loadedPhotoData?: LoadedPhotoData | null;
}> = (props) => {
  const { t } = useTranslation();
  if (!props?.loadedPhotoData?.isFileLoaded) {
    return <div />;
  }
  if (!props?.loadedPhotoData?.exif?.isLatLngAvailable) {
    return <div>{t('photoData.notAvailable')}</div>;
  }

  const { latitude, longitude } = props?.loadedPhotoData?.exif;

  // The descriptions given to the analytics stay English, whatever the language.
  const handleGoogleMapsButtonClicked = () => {
    const zoom = 14;
    openTabWithoutOpener(
      `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=${zoom}`
    );
    trackOpenUrl(
      'https://maps.google.com/ with query parameters for latitude, longitude, and zoom',
      'Show in Google Maps',
      'Home Page'
    );
  };

  const handleGoogleStreetViewButtonClicked = () => {
    openTabWithoutOpener(
      `https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=${latitude},${longitude}`
    );
    trackOpenUrl(
      'https://www.google.com/maps/ with query parameters for latitude, longitude, and zoom',
      'Show in Google Street View',
      'Home Page'
    );
  };

  return (
    <div className={classes.row}>
      <div className={classes['lat-lng-text']}>
        {latitude?.toFixed(6) ?? ''}
        <br />
        {longitude?.toFixed(6) ?? ''}
      </div>
      <div>
        <IconButton
          className={classes['google-maps-button']}
          onClick={handleGoogleMapsButtonClicked}
          title={t('photoData.general.showInGoogleMaps')}
        >
          <img
            className={classes['google-maps-icon']}
            src={IconDataUrl.googleMapsIcon}
            alt={t('photoData.general.showInGoogleMaps')}
          />
        </IconButton>
        <IconButton
          className={classes['google-street-view-button']}
          onClick={handleGoogleStreetViewButtonClicked}
          title={t('photoData.general.showInGoogleStreetView')}
        >
          <img
            className={classes['google-street-view-icon']}
            src={IconDataUrl.googleStreetViewIcon}
            alt={t('photoData.general.showInGoogleStreetView')}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default LatLngRow;
