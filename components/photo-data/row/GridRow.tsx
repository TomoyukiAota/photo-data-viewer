import { LoadedPhotoData } from '../../../store/photo/loaded-photo-data';
import classes from './WidthHeightRow.module.scss';

const GridRow: React.FC<{
  className?: string;
  loadedPhotoData?: LoadedPhotoData | null;
  data?: string;
}> = (props) => {
  if (!props?.loadedPhotoData?.isFileLoaded) {
    return <div />;
  }
  if (!props?.data) {
    return <div>Not Available</div>;
  }

  return <div>{props.data}</div>;
};

export default GridRow;
