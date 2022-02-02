import DialogProvider from './dialog/DialogProvider';
import PhotoProvider from './PhotoProvider';

const AppProvider: React.FC = (props) => {
  return (
    <DialogProvider>
      <PhotoProvider>{props.children}</PhotoProvider>
    </DialogProvider>
  );
};

export default AppProvider;
