import React from "react";
import { PhotoDimensions, PhotoImgLoadStatus } from "./photo-dimensions-type";

type PhotoDimensionsContextType = {
  loadStatus: PhotoImgLoadStatus,
  setLoadStatus: (status: PhotoImgLoadStatus) => void,
  dimensions: PhotoDimensions | null,
  setDimensions: (dimensions: PhotoDimensions | null) => void,
};

const PhotoDimensionsContext = React.createContext<PhotoDimensionsContextType>({
  loadStatus: 'Not Loaded',
  setLoadStatus: () => { },
  dimensions: null,
  setDimensions: () => { },
});

export default PhotoDimensionsContext;
