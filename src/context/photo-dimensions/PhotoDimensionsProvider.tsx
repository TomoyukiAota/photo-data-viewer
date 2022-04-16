import { useState } from 'react';
import { trackPhotoDimensions } from '../../google-analytics/track-event';
import PhotoDimensionsContext from './photo-dimensions-context';
import { PhotoDimensions, PhotoImgLoadStatus } from './photo-dimensions-type';

const PhotoDimensionsProvider: React.FC = (props) => {
  const [loadStatus, setLoadStatus] =
    useState<PhotoImgLoadStatus>('Not Loaded');
  const [dimensions, setDimensions] = useState<PhotoDimensions | null>(null);

  const handleSetDimensions = (dimensions: PhotoDimensions | null) => {
    setDimensions(dimensions);
    trackPhotoDimensions(dimensions);
  };

  return (
    <PhotoDimensionsContext.Provider
      value={{
        loadStatus,
        setLoadStatus,
        dimensions,
        setDimensions: handleSetDimensions,
      }}
    >
      {props.children}
    </PhotoDimensionsContext.Provider>
  );
};

export default PhotoDimensionsProvider;
