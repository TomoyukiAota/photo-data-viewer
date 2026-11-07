import { useDebounce } from '@react-hook/debounce';
import { useElementSize } from '../../hooks/useElementSize';
import { useContext, useRef } from 'react';

import { useThrottledAppLayout } from '../../hooks/useAppLayout';
import PhotoContext from '../../context/photo/photo-context';
import ErrorBoundary from '../error-boundary/ErrorBoundary';
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

/** Shown in the map's place when rendering the map threw (the error boundary below). */
const MapNotShownOverlay: React.FC = () => {
  return (
    <div className={classes.overlay}>
      <div className={classes['overlay-content']}>
        The map cannot be shown.
      </div>
    </div>
  );
};

/** The map pane: the loaded photo's place, with a message over the map when it has none, or in its place when the map cannot be shown. */
const PhotoMap: React.FC<{ className?: string }> = (props) => {
  const mapSizeTarget = useRef<HTMLDivElement>(null);
  const mapSize = useElementSize(mapSizeTarget);
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

  // An error in the map leaves the photo and its data on the page, and the map is
  // tried again for the next photo.
  return (
    <div className={classes.container} ref={mapSizeTarget}>
      <ErrorBoundary
        name='map'
        fallback={<MapNotShownOverlay />}
        resetKey={photoCtx.loadedPhotoData}
      >
        {isFileLoaded && !isLatLngAvailable && <LatLngNotAvailableOverlay />}
        <LeafletLoader mapSize={debouncedMapSize} />
      </ErrorBoundary>
    </div>
  );
};

export default PhotoMap;
