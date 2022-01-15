import React from "react";

const PhotoContext = React.createContext({
  loadedPhotoData: '',
  loadPhoto: (data: FileList | null) => { },
});

export default PhotoContext;
