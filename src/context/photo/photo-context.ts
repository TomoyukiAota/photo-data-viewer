import React from 'react';
import { LoadedPhotoData } from './loaded-photo-data';

/** How a photo came to be chosen, which the usage data records. A photo chosen with the button has neither. */
export interface LoadPhotoOptions {
  /** Loaded by the demo. */
  isDemo?: boolean;
  /** Dropped on the page (src/components/drop-photo/DropPhoto.tsx). */
  isDropped?: boolean;
}

type PhotoContextType = {
  loadedPhotoData: LoadedPhotoData | null;
  loadedPhotoImage: React.JSX.Element;
  loadPhoto: (file: File, options?: LoadPhotoOptions) => void;
  reloadPhoto: () => void;
};

const PhotoContext = React.createContext<PhotoContextType>({
  loadedPhotoData: null,
  loadedPhotoImage: React.createElement('div'),
  loadPhoto: (file: File, options?: LoadPhotoOptions) => {},
  reloadPhoto: () => {},
});

export default PhotoContext;
