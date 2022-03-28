import DialogProvider from './dialog/DialogProvider';
import DocumentTitleProvider from './document-title/DocumentTitleProvider';
import PhotoProvider from './photo/PhotoProvider';

const AppProvider: React.FC = (props) => {
  return (
    <DocumentTitleProvider>
      <DialogProvider>
        <PhotoProvider>{props.children}</PhotoProvider>
      </DialogProvider>
    </DocumentTitleProvider>
  );
};

export default AppProvider;
