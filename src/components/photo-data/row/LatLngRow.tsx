/* eslint-disable @next/next/no-img-element */

import IconButton from '@mui/material/IconButton';
import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { trackOpenUrl } from '../../../google-analytics/track-event';
import { IconDataUrl } from '../../../icons/icon-data-url';
import { openTabWithoutOpener } from '../../../utils/open-url';

import classes from './LatLngRow.module.scss';

const LatLngRow: React.FC<{
  className?: string;
  loadedPhotoData?: LoadedPhotoData | null;
}> = (props) => {
  if (!props?.loadedPhotoData?.isFileLoaded) {
    return <div />;
  }
  if (!props?.loadedPhotoData?.exif?.isLatLngAvailable) {
    return <div>Not Available</div>;
  }

  const { latitude, longitude } = props?.loadedPhotoData?.exif;

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
          title='Show in Google Maps'
        >
          <img
            className={classes['google-maps-icon']}
            src={IconDataUrl.googleMapsIcon}
            alt='Show in Google Maps'
          />
        </IconButton>
        <IconButton
          className={classes['google-street-view-button']}
          onClick={handleGoogleStreetViewButtonClicked}
          title='Show in Google Street View'
        >
          <img
            className={classes['google-street-view-icon']}
            src={IconDataUrl.googleStreetViewIcon}
            alt='Show in Google Street View'
          />
        </IconButton>
      </div>
    </div>
  );
};

export default LatLngRow;
