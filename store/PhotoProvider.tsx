import { useState } from 'react';
import PhotoContext from './photo-context';

const PhotoProvider: React.FC = (props) => {
  const [loadedPhotoData, setLoadedPhotoData] = useState('');

  const loadPhoto = (data: FileList | null) => {
    console.log(data);
  };

  return (
    <PhotoContext.Provider
      value={{
        loadedPhotoData: loadedPhotoData,
        loadPhoto: loadPhoto,
      }}
    >
      {props.children}
    </PhotoContext.Provider>
  );
};

export default PhotoProvider;
