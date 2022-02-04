import classNames from 'classnames';
import Image from 'next/image';
import { useContext, useState } from 'react';

import overrideNextImage from '../../styles/override-next-image.module.scss';
import { isHeif } from '../../utils/filename-extension';
import DialogContext from '../dialog/dialog-context';
import { createLoadedPhotoData, LoadedPhotoData } from './loaded-photo-data';
import PhotoContext from './photo-context';
import classes from './PhotoProvider.module.scss';

async function getBlobForHeif(file: File) {
  let blob: Blob | null = null;
  try {
    const heic2any = require('heic2any'); // requre here to make debugging easier
    blob = await heic2any({ blob: file });
  } catch (error) {
    console.log(
      `An error is thrown when handling the HEIF file ${file.name}. error: `,
      error
    );
  }
  return blob;
}

async function getImageUrl(file: File) {
  let fileOrBlob: File | Blob = file;
  if (isHeif(file.name)) {
    fileOrBlob = (await getBlobForHeif(file)) ?? file;
  }
  const url = URL.createObjectURL(fileOrBlob);
  return url;
}

const PhotoProviderText: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={classNames(classes.text, props.className)}>
      {props.children}
    </div>
  );
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

    // Show loading message because it takes time to load HEIF file.
    if (isHeif(file.name)) {
      setLoadedPhotoImage(() => (
        <PhotoProviderText className={classes['loading-text']}>
          Loading the selected photo...
        </PhotoProviderText>
      ));
    }

    const data = await createLoadedPhotoData(file);
    console.log('LoadedPhotoData', data);
    setLoadedPhotoData(data);
    if (!data?.isExifAvailable) {
      dialogCtx.unsupportedFileSelected.open();
    }

    const url = await getImageUrl(file);

    setLoadedPhotoImage(() => (
      <div className={overrideNextImage.imageContainer}>
        <Image
          className={overrideNextImage.image}
          src={url}
          alt={file.name}
          layout='fill'
        ></Image>
      </div>
    ));
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
