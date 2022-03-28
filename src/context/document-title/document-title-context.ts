import { createContext } from "react";

type DocumentTitleContextType = {
  documentTitle: string,
  setDocumentTitle: (title: string) => void,
};

const DocumentTitleContext = createContext<DocumentTitleContextType>({
  documentTitle: '',
  setDocumentTitle: () => { },
});

export default DocumentTitleContext;
