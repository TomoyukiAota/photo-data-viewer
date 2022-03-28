import { useState } from 'react';

import DocumentTitleContext from './document-title-context';

const DocumentTitleProvider: React.FC = (props) => {
  const [documentTitle, setDocumentTitle] = useState('Photo Data Viewer');

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
