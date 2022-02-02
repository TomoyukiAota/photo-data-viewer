import { createContext } from "react";

type DialogContextType = {
  unsupportedFileSelected: {
    open: () => void,
    close: () => void,
    isOpened: boolean,
  }
};

const DialogContext = createContext<DialogContextType>({
  unsupportedFileSelected: {
    open: () => { },
    close: () => { },
    isOpened: false,
  }
});

export default DialogContext;