import { useContext, useEffect } from 'react';
import PhotoContext from '../context/photo/photo-context';
import { PHOTO_PATH_PARAM } from '../analytics/ga4-page';
import { AppIntegration } from './app-integration';
import { scrubPhotoName } from '../analytics/record-error';
import { isInBridgeWindow, readPhotoFile, whenPlmBridgeReady } from './plm-bridge';
import { electronRequire, readLocalPhotoFile } from './local-photo-file';

function getPhotoPath(): string {
  const photoPath = new URL(window.location.href).searchParams.get(PHOTO_PATH_PARAM);
  console.log('photoPath passed from Photo Location Map:', photoPath);
  return photoPath as string;
}

/** The photo from the bridge of Photo Location Map's isolated window, which never tells this page the photo's path. */
async function loadPhotoFromBridge(loadPhoto: (file: File) => void) {
  const bridge = await whenPlmBridgeReady();
  // Errors are scrubbed of the photo's name as soon as it is known, as they were when the address had its path.
  loadPhoto(await readPhotoFile(bridge, fetch, scrubPhotoName));
}

function loadPhotoInPlm(loadPhoto: (file: File) => void) {
  if (!AppIntegration.isPlm) {
    return;
  }

  if (isInBridgeWindow()) {
    loadPhotoFromBridge(loadPhoto).catch((error) => {
      console.error('Failed to load the photo from Photo Location Map:', error);
      throw error; // Recorded as an unhandled rejection (src/analytics/record-error.ts).
    });
    return;
  }

  // An earlier Photo Location Map, whose window has Node.js, passes the photo's path in the address.
  const nodeRequire = electronRequire();
  if (!nodeRequire) {
    throw new Error('Photo Location Map\'s window gives neither its bridge nor Node.js, so the photo cannot be read.');
  }
  loadPhoto(readLocalPhotoFile(getPhotoPath(), nodeRequire));
}

const LoadPhotoInPlm: React.FC = () => {
  const { loadPhoto } = useContext(PhotoContext);

  useEffect(
    () => loadPhotoInPlm(loadPhoto),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Run only once when Photo Data Viewer is loaded in Photo Location Map.
  );

  return <></>;
};

export default LoadPhotoInPlm;
