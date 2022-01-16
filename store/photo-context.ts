import React from "react";

type PhotoContextType = {
  loadedPhotoImage: JSX.Element,
  loadPhoto: (data: FileList | null) => void,
};

const PhotoContext = React.createContext<PhotoContextType>({
  loadedPhotoImage: React.createElement('div'),
  loadPhoto: (data: FileList | null) => { },
});

export default PhotoContext;
