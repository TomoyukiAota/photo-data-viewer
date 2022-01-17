import React from "react";

import { LoadedPhotoData } from './loaded-photo-data';

type PhotoContextType = {
  loadedPhotoData: LoadedPhotoData | null,
  loadedPhotoImage: JSX.Element,
  loadPhoto: (data: FileList | null) => void,
};

const PhotoContext = React.createContext<PhotoContextType>({
  loadedPhotoData: null,
  loadedPhotoImage: React.createElement('div'),
  loadPhoto: (data: FileList | null) => { },
});

export default PhotoContext;
