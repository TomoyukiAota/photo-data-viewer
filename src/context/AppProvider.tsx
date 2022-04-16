import DialogProvider from './dialog/DialogProvider';
import GutterPositionProvider from './gutter-position/GutterPositionProvider';
import PageTitleProvider from './page-title/PageTitleProvider';
import PhotoDimensionsProvider from './photo-dimensions/PhotoDimensionsProvider';
import PhotoProvider from './photo/PhotoProvider';

const AppProvider: React.FC = (props) => {
  return (
    <PageTitleProvider>
      <DialogProvider>
        <GutterPositionProvider>
          <PhotoDimensionsProvider>
            <PhotoProvider>{props.children}</PhotoProvider>
          </PhotoDimensionsProvider>
        </GutterPositionProvider>
      </DialogProvider>
    </PageTitleProvider>
  );
};

export default AppProvider;
