import DialogProvider from './dialog/DialogProvider';
import GutterPositionProvider from './gutter-position/GutterPositionProvider';
import PageTitleProvider from './page-title/PageTitleProvider';
import PhotoProvider from './photo/PhotoProvider';

const AppProvider: React.FC = (props) => {
  return (
    <PageTitleProvider>
      <DialogProvider>
        <GutterPositionProvider>
          <PhotoProvider>{props.children}</PhotoProvider>
        </GutterPositionProvider>
      </DialogProvider>
    </PageTitleProvider>
  );
};

export default AppProvider;
