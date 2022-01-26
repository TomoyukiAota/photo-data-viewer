import IconButton from '@mui/material/IconButton';
import GoogleIcon from '../../../icons/google.svg';

import classes from './LatLngRow.module.scss';

const LatLngRow: React.FC<{
  className?: string;
  latitude?: number;
  longitude?: number;
}> = (props) => {
  if (!props?.latitude || !props?.longitude) return <div></div>;

  const handleGoogleButtonClicked = () => {
    const zoom = 14;
    window.open(
      `https://maps.google.com/?q=${props.latitude},${props.longitude}&ll=${props.latitude},${props.longitude}&z=${zoom}`
    );
  };

  return (
    <div className={classes.row}>
      {props?.latitude?.toFixed(4) ?? ''}, {props?.longitude?.toFixed(4) ?? ''}
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
