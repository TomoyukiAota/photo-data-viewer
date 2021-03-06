import { useContext, useState } from 'react';

import { getAppName } from '../../app-integration/app-name';
import PhotoImage from '../../components/photo-image/PhotoImage';
import PhotoLoadingText from '../../components/photo-image/PhotoLoadingText';
import PhotoText from '../../components/photo-image/PhotoText';
import { trackLoadedPhotoData } from '../../google-analytics/track-event';
import { isHeif } from '../../utils/filename-extension';
import { sleep } from '../../utils/sleep';
import DialogContext from '../dialog/dialog-context';
import PageTitleContext from '../page-title/page-title-context';
import PhotoDimensionsContext from '../photo-dimensions/photo-dimensions-context';
import { setPhotoDimensions } from '../photo-dimensions/set-photo-dimensions';
import { createLoadedPhotoData, LoadedPhotoData } from './loaded-photo-data';
import PhotoContext from './photo-context';

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

const PhotoProvider: React.FC = (props) => {
  const { setIndexPageTitle } = useContext(PageTitleContext);
  const photoDimensionsCtx = useContext(PhotoDimensionsContext);
  const dialogCtx = useContext(DialogContext);

  const [loadedPhotoData, setLoadedPhotoData] =
    useState<LoadedPhotoData | null>(null);

  const initialLoadedPhotoImage = (
    <PhotoText>The selected photo will be displayed here.</PhotoText>
  );

  const [loadedPhotoImage, setLoadedPhotoImage] = useState(
    () => initialLoadedPhotoImage
  );

  const loadFile = async (
    file: File | undefined,
    option: { isReload: boolean }
  ) => {
    if (!file) return;

    const title = `${file.name} - ${getAppName()}`; // For Photo Location Map, title needs to be the same as browserWindow.title
    setIndexPageTitle(title);

    if (isHeif(file.name)) {
      // Show loading message because it takes time to load HEIF file.
      setLoadedPhotoImage(() => <PhotoLoadingText />);
    } else {
      // Show loading message and wait to avoid showing rotation transition.
      setLoadedPhotoImage(() => <PhotoLoadingText />);
      await sleep(500);
    }

    const data = await createLoadedPhotoData(file);
    console.log('LoadedPhotoData', data);
    trackLoadedPhotoData(data);
    setLoadedPhotoData(data);

    photoDimensionsCtx.setLoadStatus('Loading');
    photoDimensionsCtx.setDimensions(null);

    const isExifAvailable = !!data?.isExifAvailable;
    const isReload = !!option?.isReload;
    if (!isExifAvailable && !isReload) {
      dialogCtx.unsupportedFileSelected.open();
    }

    const url = await getImageUrl(file);
    setLoadedPhotoImage(() => <PhotoImage url={url} alt={file.name} />);
    setPhotoDimensions(photoDimensionsCtx, url);
  };

  const loadPhoto = (file: File) => {
    console.debug('loadPhoto called. file: ', file);
    loadFile(file, { isReload: false });
  };

  const reloadPhoto = () => {
    console.debug('reloadPhoto called.');
    const file = loadedPhotoData?.file?.file;
    loadFile(file, { isReload: true });
  };

  return (
    <PhotoContext.Provider
      value={{
        loadedPhotoData: loadedPhotoData,
        loadedPhotoImage: loadedPhotoImage,
        loadPhoto: loadPhoto,
        reloadPhoto: reloadPhoto,
      }}
    >
      {props.children}
    </PhotoContext.Provider>
  );
};

export default PhotoProvider;
