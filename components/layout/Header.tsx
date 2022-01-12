import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import classes from './Header.module.scss';

const Header: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={`${props.className} ${classes.header}`}>
      <div>Select your photo to display the EXIF data:</div>
      <div className={classes['textfield-and-button']}>
        <TextField
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          size='small'
          variant='outlined'
        />
        <Button variant='outlined'>Select</Button>
      </div>
    </div>
  );
};

export default Header;
