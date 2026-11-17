import { useState } from 'react';

import { trackOpenedDropPhotoDialog, trackOpenedUnsupportedFileDialog } from '../../analytics/track-event';
import DialogContext from './dialog-context';

const DialogProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [isUnsupportedFileDialogOpened, setIsUnsupportedFileDialogOpened] =
    useState(false);
  const [isDropPhotoDialogOpened, setIsDropPhotoDialogOpened] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);

  const handleUnsupportedFileDialogOpen = () => {
    setIsUnsupportedFileDialogOpened(true);
    trackOpenedUnsupportedFileDialog();
  };
  const handleUnsupportedFileDialogClose = () => {
    setIsUnsupportedFileDialogOpened(false);
  };

  const handleDropPhotoDialogOpen = (file: File, fileCount: number) => {
    setDroppedFile(file);
    setIsDropPhotoDialogOpened(true);
    trackOpenedDropPhotoDialog(fileCount);
  };
  const handleDropPhotoDialogClose = () => {
    setIsDropPhotoDialogOpened(false);
  };

  return (
    <DialogContext.Provider
      value={{
        unsupportedFileSelected: {
          open: handleUnsupportedFileDialogOpen,
          close: handleUnsupportedFileDialogClose,
          isOpened: isUnsupportedFileDialogOpened,
        },
        dropPhoto: {
          open: handleDropPhotoDialogOpen,
          close: handleDropPhotoDialogClose,
          isOpened: isDropPhotoDialogOpened,
          file: droppedFile,
        },
      }}
    >
      {props.children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
