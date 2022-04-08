import React from "react";

import { LoadedPhotoData } from './loaded-photo-data';

type PhotoContextType = {
  loadedPhotoData: LoadedPhotoData | null,
  loadedPhotoImage: JSX.Element,
  loadPhoto: (file: File, option?: { isReload: boolean }) => void,
  reloadPhoto: () => void,
};

const PhotoContext = React.createContext<PhotoContextType>({
  loadedPhotoData: null,
  loadedPhotoImage: React.createElement('div'),
  loadPhoto: (file: File, option?: { isReload: boolean }) => { },
  reloadPhoto: () => { },
});

export default PhotoContext;
