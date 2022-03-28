import { useContext, useEffect } from 'react';
import DocumentTitleContext from '../context/document-title/document-title-context';
import PhotoContext from '../context/photo/photo-context';
import { AppIntegration } from './app-integration';

function getPhotoPath(): string {
  const photoPath = new URL(window.location.href).searchParams.get('photoPath');
  console.log('photoPath passed from Photo Location Map:', photoPath);
  return photoPath as string;
}

function loadPhotoInPlm(
  loadPhoto: (file: File) => void,
  setDocumentTitle: (title: string) => void
) {
  if (!AppIntegration.isPlm) {
    return;
  }

  const {
    LocalFileData,
    constructFileFromLocalFileData,
  } = require('get-file-object-from-local-path'); // require here to make debugging easier.
  const fileData = new LocalFileData(getPhotoPath());
  const file: File = constructFileFromLocalFileData(fileData);
  setDocumentTitle(`${file.name} - Photo Location Map`); // Needs to be the same as browserWindow.title in Photo Location Map.
  loadPhoto(file);
}

const LoadPhotoInPlm: React.FC = () => {
  const { loadPhoto } = useContext(PhotoContext);
  const { setDocumentTitle } = useContext(DocumentTitleContext);

  useEffect(
    () => loadPhotoInPlm(loadPhoto, setDocumentTitle),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Run only once when Photo Data Viewer is loaded in Photo Location Map.
  );

  return <></>;
};

export default LoadPhotoInPlm;
