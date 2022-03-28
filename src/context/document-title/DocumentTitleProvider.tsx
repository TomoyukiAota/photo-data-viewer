import { useState } from 'react';

import DocumentTitleContext from './document-title-context';
import { documentTitleDefaultValue } from './document-title-default-value';

const DocumentTitleProvider: React.FC = (props) => {
  const [documentTitle, setDocumentTitle] = useState(documentTitleDefaultValue);

  return (
    <DocumentTitleContext.Provider
      value={{
        documentTitle,
        setDocumentTitle,
      }}
    >
      {props.children}
    </DocumentTitleContext.Provider>
  );
};

export default DocumentTitleProvider;
