import { useContext, useEffect } from 'react';
import PhotoContext from '../context/photo/photo-context';
import { AppIntegration } from './app-integration';

function getPhotoPath(): string {
  const photoPath = new URL(window.location.href).searchParams.get('photoPath');
  console.log('photoPath passed from Photo Location Map:', photoPath);
  return photoPath as string;
}

function loadPhotoInPlm(loadPhoto: (file: File) => void) {
  if (!AppIntegration.isPlm) {
    return;
  }

  const {
    LocalFileData,
    constructFileFromLocalFileData,
  } = require('get-file-object-from-local-path'); // require here to make debugging easier.
  const fileData = new LocalFileData(getPhotoPath());
  const file = constructFileFromLocalFileData(fileData);
  loadPhoto(file);
}

const LoadPhotoInPlm: React.FC = () => {
  const photoCtx = useContext(PhotoContext);

  useEffect(
    () => loadPhotoInPlm(photoCtx.loadPhoto),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Run only once when Photo Data Viewer is loaded in Photo Location Map.
  );

  return <></>;
};

export default LoadPhotoInPlm;
