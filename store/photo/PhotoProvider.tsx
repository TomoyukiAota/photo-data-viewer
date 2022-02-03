import Image from 'next/image';
import { useContext, useState } from 'react';

import overrideNextImage from '../../styles/override-next-image.module.scss';
import DialogContext from '../dialog/dialog-context';
import { createLoadedPhotoData, LoadedPhotoData } from './loaded-photo-data';
import PhotoContext from './photo-context';
import classes from './PhotoProvider.module.scss';

const PhotoProviderText: React.FC = (props) => {
  return <div className={classes.text}>{props.children}</div>;
};

const PhotoProvider: React.FC = (props) => {
  const dialogCtx = useContext(DialogContext);

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

  const loadPhoto = async (file: File) => {
    console.log('loadPhoto called. file: ', file);

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

    if (!data?.isExifAvailable) {
      dialogCtx.unsupportedFileSelected.open();
    }
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
