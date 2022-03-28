import { createContext } from "react";

import { documentTitleDefaultValue } from "./document-title-default-value";

type DocumentTitleContextType = {
  documentTitle: string,
  setDocumentTitle: (title: string) => void,
};

const DocumentTitleContext = createContext<DocumentTitleContextType>({
  documentTitle: documentTitleDefaultValue,
  setDocumentTitle: () => { },
});

export default DocumentTitleContext;
