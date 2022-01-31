import { useContext } from 'react';
import PhotoContext from '../store/photo-context';
import LeafletLoader from './leaflet/LeafletLoader';
import classes from './PhotoMap.module.scss';

const LatLngNotAvailableOverlay: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={classes.overlay}>
      <div className={classes['overlay-content']}>
        The location data (latitude and longitude) is not available.
      </div>
    </div>
  );
};

const PhotoMap: React.FC<{ className?: string }> = (props) => {
  const photoCtx = useContext(PhotoContext);
  const isFileLoaded = !!photoCtx.loadedPhotoData?.isFileLoaded;
  const isLatLngAvailable = !!photoCtx.loadedPhotoData?.isLatLngAvailable;

  return (
    <div className={classes.container}>
      {isFileLoaded && !isLatLngAvailable && <LatLngNotAvailableOverlay />}
      <LeafletLoader />
    </div>
  );
};

export default PhotoMap;
