import { createContext } from "react";

type DialogContextType = {
  unsupportedFileSelected: {
    open: () => void,
    close: () => void,
    isOpened: boolean,
  },
  /** The dialog that asks before a photo dropped on the page is selected (DropPhotoDialog). */
  dropPhoto: {
    /** Asks about `file`, the first of the `fileCount` files dropped together. */
    open: (file: File, fileCount: number) => void,
    close: () => void,
    isOpened: boolean,
    /** The file asked about. It stays after the dialog is closed, so that its name is shown while the dialog fades out. */
    file: File | null,
  },
};

const DialogContext = createContext<DialogContextType>({
  unsupportedFileSelected: {
    open: () => { },
    close: () => { },
    isOpened: false,
  },
  dropPhoto: {
    open: () => { },
    close: () => { },
    isOpened: false,
    file: null,
  },
});

export default DialogContext;
