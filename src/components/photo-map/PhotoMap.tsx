import { useDebounce } from '@react-hook/debounce';
import useSize from '@react-hook/size';
import { useContext, useRef } from 'react';

import { useThrottledAppLayout } from '../../hooks/useAppLayout';
import PhotoContext from '../../context/photo/photo-context';
import LeafletLoader from '../leaflet/LeafletLoader';

import classes from './PhotoMap.module.scss';

const LatLngNotAvailableOverlay: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={classes.overlay}>
      <div className={classes['overlay-content']}>
        Location data (latitude and longitude) is not available.
      </div>
    </div>
  );
};

const PhotoMap: React.FC<{ className?: string }> = (props) => {
  const mapSizeTarget = useRef(null);
  const mapSize = useSize(mapSizeTarget);
  const [debouncedMapSize, setDebouncedMapSize] = useDebounce(mapSize, 300);
  const { isWideLayout } = useThrottledAppLayout();
  if (isWideLayout) {
    setDebouncedMapSize(mapSize);
  } else {
    // Do nothing for narrow layout case because
    // 1) the map size cannot be changed, and
    // 2) calling setDebouncedMapSize results in flickering after switching to Map tab.
  }

  const photoCtx = useContext(PhotoContext);
  const isFileLoaded = !!photoCtx.loadedPhotoData?.isFileLoaded;
  const isLatLngAvailable = !!photoCtx.loadedPhotoData?.isLatLngAvailable;

  return (
    <div className={classes.container} ref={mapSizeTarget}>
      {isFileLoaded && !isLatLngAvailable && <LatLngNotAvailableOverlay />}
      <LeafletLoader mapSize={debouncedMapSize} />
    </div>
  );
};

export default PhotoMap;
