/* eslint-disable @next/next/no-img-element */

import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

import { AppIntegration } from '../../../app-integration/app-integration';
import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { trackOpenUrl } from '../../../analytics/track-event';
import { IconDataUrl } from '../../../icons/icon-data-url';
import { openTabWithoutOpener } from '../../../utils/open-url';

import classes from './LatLngRow.module.scss';

/**
 * The latitude and the longitude of the photo, as one row of the General
 * tab's table, with the buttons that show the place in Google Maps, in
 * Google Street View and in Google Earth.
 *
 * TL;DR: Each of the two names is beside its number, however many lines the
 * name takes.
 * Details: The row had the two names in one cell and the two numbers in the
 * next, each on two lines. Where a language writes a name on two lines
 * ("Szerokość geograficzna" in a phone's column), the names took four lines
 * and the numbers two, so a number was no longer beside its name. The row is
 * a grid of its own instead (`whole` in NameValueGrid): a name and its number
 * share a line of the grid, which is as high as the taller of the two.
 */
const LatLngRow: React.FC<{
  loadedPhotoData?: LoadedPhotoData | null;
  /** The size of the text, as the other rows of the table have it. */
  style?: React.CSSProperties;
}> = (props) => {
  const { t } = useTranslation();
  const isFileLoaded = Boolean(props.loadedPhotoData?.isFileLoaded);
  const exif = props.loadedPhotoData?.exif;
  const isLatLngAvailable = isFileLoaded && Boolean(exif?.isLatLngAvailable);
  const latitude = exif?.latitude;
  const longitude = exif?.longitude;

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

  // Google Earth searches for the coordinates: it goes to the place and marks
  // it with a pin. An address with only the view (/web/@latitude,longitude,...)
  // goes there without a pin.
  const handleGoogleEarthButtonClicked = () => {
    openTabWithoutOpener(
      `https://earth.google.com/web/search/${latitude},${longitude}`
    );
    trackOpenUrl(
      'https://earth.google.com/web/search/ with latitude and longitude',
      'Show in Google Earth',
      'Home Page'
    );
  };

  // TL;DR: Not in Photo Location Map, which would record the photo's
  // coordinates in its usage data.
  // Details: Photo Location Map opens the address of a button in the browser
  // and records the address with it, without the coordinates only for an
  // address of Google Maps (modifyUrlForAnalyticsIfNeeded in
  // src-main/photo-data-viewer/launch-photo-data-viewer.ts of
  // https://github.com/TomoyukiAota/photo-location-map). This app is served to
  // every version of it, and cannot tell which version it is in.
  const isGoogleEarthButtonShown = !AppIntegration.isPlm;

  return (
    <div className={classes.row} style={props.style}>
      <div className={`${classes.name} ${classes.latitude}`}>
        {t('photoData.general.latitude')}
      </div>
      <div className={`${classes.name} ${classes.longitude}`}>
        {t('photoData.general.longitude')}
      </div>
      {isLatLngAvailable && (
        <>
          {/* From left to right in every language, so that a minus sign stays before its number. */}
          <div className={`${classes.number} ${classes.latitude}`} dir='ltr'>
            {latitude?.toFixed(6) ?? ''}
          </div>
          <div className={`${classes.number} ${classes.longitude}`} dir='ltr'>
            {longitude?.toFixed(6) ?? ''}
          </div>
          <div className={classes.buttons}>
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
            {isGoogleEarthButtonShown && (
              <IconButton
                className={classes['google-earth-button']}
                onClick={handleGoogleEarthButtonClicked}
                title={t('photoData.general.showInGoogleEarth')}
              >
                <img
                  className={classes['google-earth-icon']}
                  src={IconDataUrl.googleEarthIcon}
                  alt={t('photoData.general.showInGoogleEarth')}
                />
              </IconButton>
            )}
          </div>
        </>
      )}
      {isFileLoaded && !isLatLngAvailable && (
        <div className={classes['not-available']}>
          {t('photoData.notAvailable')}
        </div>
      )}
    </div>
  );
};

export default LatLngRow;
