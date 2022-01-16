import Image from 'next/image';
import { useState } from 'react';

import overrideNextImage from '../styles/override-next-image.module.scss';
import PhotoContext from './photo-context';
import classes from './PhotoProvider.module.scss';

const PhotoProviderText: React.FC = (props) => {
  return <div className={classes.text}>{props.children}</div>;
};

const PhotoProvider: React.FC = (props) => {
  const initialLoadedPhotoImage = (
    <PhotoProviderText>
      The selected photo will be displayed here.
    </PhotoProviderText>
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
        <PhotoProviderText>
          Something went wrong. The selected file cannot be displayed.
        </PhotoProviderText>
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
