import { useContext, useRef, useState } from 'react';

import { getAppName } from '../../app-integration/app-name';
import PhotoImage from '../../components/photo-image/PhotoImage';
import PhotoLoadingText from '../../components/photo-image/PhotoLoadingText';
import PhotoPlaceholderText from '../../components/photo-image/PhotoPlaceholderText';
import { describeError } from '../../analytics/event-fields';
import { PhotoDisplayDetails, trackDisplayedPhoto, trackLoadedPhoto } from '../../analytics/track-event';
import { convertHeifToJpeg } from '../../utils/convert-heif-to-jpeg';
import { isHeif } from '../../utils/filename-extension';
import { sleep } from '../../utils/sleep';
import DialogContext from '../dialog/dialog-context';
import PageTitleContext from '../page-title/page-title-context';
import PhotoDimensionsContext from '../photo-dimensions/photo-dimensions-context';
import { setPhotoDimensions } from '../photo-dimensions/set-photo-dimensions';
import { createLoadedPhotoData, LoadedPhotoData } from './loaded-photo-data';
import PhotoContext, { LoadPhotoOptions } from './photo-context';

async function getBlobForHeif(file: File) {
  const startedAt = performance.now();
  let blob: Blob | null = null;
  let heif: PhotoDisplayDetails['heif'];
  try {
    blob = await convertHeifToJpeg(file);
    heif = { result: 'converted', decodeMs: performance.now() - startedAt };
  } catch (error) {
    console.log(
      `An error is thrown when handling the HEIF file ${file.name}. error: `,
      error
    );
    heif = { result: 'failed', error: describeError(error), decodeMs: performance.now() - startedAt };
  }
  return { blob, heif };
}

async function getImageUrl(file: File) {
  let fileOrBlob: File | Blob = file;
  let heif: PhotoDisplayDetails['heif'];
  if (isHeif(file.name)) {
    const converted = await getBlobForHeif(file);
    fileOrBlob = converted.blob ?? file;
    heif = converted.heif;
  }
  const url = URL.createObjectURL(fileOrBlob);
  return { url, heif };
}

const PhotoProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { setIndexPageTitle } = useContext(PageTitleContext);
  const photoDimensionsCtx = useContext(PhotoDimensionsContext);
  const dialogCtx = useContext(DialogContext);

  const [loadedPhotoData, setLoadedPhotoData] =
    useState<LoadedPhotoData | null>(null);

  const initialLoadedPhotoImage = <PhotoPlaceholderText />;

  const [loadedPhotoImage, setLoadedPhotoImage] = useState(
    () => initialLoadedPhotoImage
  );

  // How the photo shown was chosen, the demo's or one dropped, so that loading it again after a setting changes is
  // recorded the same way.
  const photoOptions = useRef<Required<LoadPhotoOptions>>({ isDemo: false, isDropped: false });

  const loadFile = async (
    file: File | undefined,
    option: { isReload: boolean } & Required<LoadPhotoOptions>
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

    // Timed from here, so that the wait above, made on purpose, is not counted.
    const loadStartedAt = performance.now();
    const isReload = !!option?.isReload;
    const isDemo = !!option?.isDemo;
    const isDropped = !!option?.isDropped;
    const data = await createLoadedPhotoData(file);
    console.log('LoadedPhotoData', data);
    trackLoadedPhoto(data, { exifMs: performance.now() - loadStartedAt, isReload, isDemo, isDropped });
    setLoadedPhotoData(data);

    photoDimensionsCtx.setLoadStatus('Loading');
    photoDimensionsCtx.setDimensions(null);

    const isExifAvailable = !!data?.isExifAvailable;
    if (!isExifAvailable && !isReload) {
      dialogCtx.unsupportedFileSelected.open();
    }

    const { url, heif } = await getImageUrl(file);
    setLoadedPhotoImage(() => <PhotoImage url={url} alt={file.name} />);
    const dimensions = await setPhotoDimensions(photoDimensionsCtx, url);
    trackDisplayedPhoto({ dimensions, loadMs: performance.now() - loadStartedAt, heif, isReload, isDemo, isDropped });
  };

  const loadPhoto = (file: File, options?: LoadPhotoOptions) => {
    console.debug('loadPhoto called. file: ', file);
    photoOptions.current = { isDemo: !!options?.isDemo, isDropped: !!options?.isDropped };
    loadFile(file, { isReload: false, ...photoOptions.current });
  };

  const reloadPhoto = () => {
    console.debug('reloadPhoto called.');
    const file = loadedPhotoData?.file?.file;
    loadFile(file, { isReload: true, ...photoOptions.current });
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
