import Image from 'next/image';
import { useState } from 'react';

import overrideNextImage from '../styles/override-next-image.module.scss';
import PhotoContext from './photo-context';

const PhotoProvider: React.FC = (props) => {
  const initialLoadedPhotoImage = (
    <div>Selected photo will be displayed here.</div>
  );
  const [loadedPhotoImage, setLoadedPhotoImage] = useState(
    () => initialLoadedPhotoImage
  );

  const loadPhoto = (fileList: FileList | null) => {
    console.log(fileList);
    if (!fileList) {
      setLoadedPhotoImage(() => initialLoadedPhotoImage);
      return;
    }

    const file = fileList[0]; // Only one file is selected in the file select dialog.
    if (!file) {
      setLoadedPhotoImage(() => (
        <div>Something went wrong. The selected file cannot be displayed.</div>
      ));
      return;
    }

    setLoadedPhotoImage(() => (
      <div className={overrideNextImage.imageContainer}>
        <Image
          className={overrideNextImage.image}
          src={URL.createObjectURL(file)}
          alt={file.name}
          layout='fill'
        ></Image>
      </div>
    ));
  };

  return (
    <PhotoContext.Provider
      value={{
        loadedPhotoImage: loadedPhotoImage,
        loadPhoto: loadPhoto,
      }}
    >
      {props.children}
    </PhotoContext.Provider>
  );
};

export default PhotoProvider;
