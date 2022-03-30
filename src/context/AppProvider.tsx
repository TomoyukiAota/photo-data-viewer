import DialogProvider from './dialog/DialogProvider';
import PageTitleProvider from './page-title/PageTitleProvider';
import PhotoProvider from './photo/PhotoProvider';

const AppProvider: React.FC = (props) => {
  return (
    <PageTitleProvider>
      <DialogProvider>
        <PhotoProvider>{props.children}</PhotoProvider>
      </DialogProvider>
    </PageTitleProvider>
  );
};

export default AppProvider;
