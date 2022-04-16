import { useState } from 'react';
import PhotoDimensionsContext from './photo-dimensions-context';
import { PhotoDimensions, PhotoImgLoadStatus } from './photo-dimensions-type';

const PhotoDimensionsProvider: React.FC = (props) => {
  const [loadStatus, setLoadStatus] =
    useState<PhotoImgLoadStatus>('Not Loaded');
  const [dimensions, setDimensions] = useState<PhotoDimensions | null>(null);
  return (
    <PhotoDimensionsContext.Provider
      value={{
        loadStatus,
        setLoadStatus,
        dimensions,
        setDimensions,
      }}
    >
      {props.children}
    </PhotoDimensionsContext.Provider>
  );
};

export default PhotoDimensionsProvider;
