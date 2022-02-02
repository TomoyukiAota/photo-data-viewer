import { Input } from '@mui/material';
import { useContext } from 'react';

import PhotoContext from '../../store/photo/photo-context';
import classes from './Header.module.scss';

const Header: React.FC<{ className?: string }> = (props) => {
  const photoCtx = useContext(PhotoContext);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    photoCtx.loadPhoto(event.target.files);
  };

  return (
    <div className={`${props.className} ${classes.header}`}>
      <div>Select your photo to display the EXIF data:</div>
      <Input
        type='file'
        onChange={handleInputChange}
        className={classes.input}
      ></Input>
    </div>
  );
};

export default Header;
