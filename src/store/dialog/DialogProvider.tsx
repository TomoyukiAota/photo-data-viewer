import { useState } from 'react';

import DialogContext from './dialog-context';

const DialogProvider: React.FC = (props) => {
  const [isUnsupportedFileDialogOpened, setIsUnsupportedFileDialogOpened] =
    useState(false);

  const handleUnsupportedFileDialogOpen = () => {
    setIsUnsupportedFileDialogOpened(true);
  };
  const handleUnsupportedFileDialogClose = () => {
    setIsUnsupportedFileDialogOpened(false);
  };

  return (
    <DialogContext.Provider
      value={{
        unsupportedFileSelected: {
          open: handleUnsupportedFileDialogOpen,
          close: handleUnsupportedFileDialogClose,
          isOpened: isUnsupportedFileDialogOpened,
        },
      }}
    >
      {props.children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
