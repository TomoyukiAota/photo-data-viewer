import { LoadedPhotoData } from '../../../store/photo/loaded-photo-data';
import classes from './WidthHeightRow.module.scss';

const WidthHeightRow: React.FC<{
  className?: string;
  loadedPhotoData?: LoadedPhotoData | null;
}> = (props) => {
  if (!props?.loadedPhotoData?.isFileLoaded) {
    return <div></div>;
  }
  if (!props?.loadedPhotoData?.exif?.isWidthHeightAvailable) {
    return <div>Not Available</div>;
  }

  const { width, height } = props?.loadedPhotoData?.exif;

  return (
    <div>
      {width} x {height}
    </div>
  );
};

export default WidthHeightRow;
