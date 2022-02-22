import IconButton from '@mui/material/IconButton';
import GoogleIcon from '../../../icons/google.svg';
import { LoadedPhotoData } from '../../../store/photo/loaded-photo-data';

import classes from './LatLngRow.module.scss';

const LatLngRow: React.FC<{
  className?: string;
  loadedPhotoData?: LoadedPhotoData | null;
}> = (props) => {
  if (!props?.loadedPhotoData?.isFileLoaded) {
    return <div />;
  }
  if (!props?.loadedPhotoData?.exif?.isLatLngAvailable) {
    return <div>Not Available</div>;
  }

  const { latitude, longitude } = props?.loadedPhotoData?.exif;

  const handleGoogleButtonClicked = () => {
    const zoom = 14;
    window.open(
      `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=${zoom}`
    );
  };

  return (
    <div className={classes.row}>
      {latitude?.toFixed(4) ?? ''}, {longitude?.toFixed(4) ?? ''}
      <IconButton
        onClick={handleGoogleButtonClicked}
        title='Show in Google Maps'
      >
        <GoogleIcon height={'25px'} />
      </IconButton>
    </div>
  );
};

export default LatLngRow;
