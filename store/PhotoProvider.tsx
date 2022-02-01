import Image from 'next/image';
import { useState } from 'react';

import overrideNextImage from '../styles/override-next-image.module.scss';
import { createLoadedPhotoData, LoadedPhotoData } from './loaded-photo-data';
import PhotoContext from './photo-context';
import classes from './PhotoProvider.module.scss';

const PhotoProviderText: React.FC = (props) => {
  return <div className={classes.text}>{props.children}</div>;
};

const PhotoProvider: React.FC = (props) => {
  const [loadedPhotoData, setLoadedPhotoData] =
    useState<LoadedPhotoData | null>(null);

  const initialLoadedPhotoImage = (
    <PhotoProviderText>
      The selected photo will be displayed here.
    </PhotoProviderText>
  );

  const [loadedPhotoImage, setLoadedPhotoImage] = useState(
    () => initialLoadedPhotoImage
  );

  const loadPhoto = async (fileList: FileList | null) => {
    console.log('loadPhoto called. fileList', fileList);
    if (!fileList || !fileList.length || fileList.length === 0) {
      console.log(
        'fileList is empty. Possibly selecting a file is cancelled in the file select dialog.'
      );
      return;
    }

    const file = fileList[0]; // Only one file is selected in the file select dialog.
    if (!file) {
      console.log(
        'file is falsy. Something went wrong with the selected file.'
      );
      console.log('file', file);
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

    const data = await createLoadedPhotoData(file);
    console.log('LoadedPhotoData', data);
    setLoadedPhotoData(data);
  };

  return (
    <PhotoContext.Provider
      value={{
        loadedPhotoData: loadedPhotoData,
        loadedPhotoImage: loadedPhotoImage,
        loadPhoto: loadPhoto,
      }}
    >
      {props.children}
    </PhotoContext.Provider>
  );
};

export default PhotoProvider;
