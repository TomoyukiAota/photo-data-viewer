import { Button } from '@mui/material';
import { useContext, useRef } from 'react';

import PhotoContext from '../../store/photo/photo-context';
import classes from './Header.module.scss';

const Header: React.FC<{ className?: string }> = (props) => {
  const inputElementRef = useRef<HTMLInputElement>(null);
  const photoCtx = useContext(PhotoContext);

  const handleButtonClicked: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    inputElementRef?.current?.click?.();
  };

  const handleInputClicked: React.MouseEventHandler<HTMLInputElement> = (
    event
  ) => {
    const element = event.target as HTMLInputElement;
    element.value = ''; // To call handleInputChange when the same file is selected.
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const fileList = event.target.files;

    // especially if fileList.length === 0
    if (!fileList?.length) {
      console.log(
        'fileList is empty. Possibly selecting a file is cancelled in the file select dialog.'
      );
      return;
    }

    const file = fileList[0]; // Only one file is selected in the file select dialog.
    if (!file) {
      console.log(
        'file is falsy. Something went wrong with the selected file.'
      );
      return;
    }

    photoCtx.loadPhoto(file);
  };

  return (
    <div className={`${props.className} ${classes.header}`}>
      <div>
        <div className={classes.text}>
          Select your photo to display the EXIF data.
        </div>
        <Button variant='outlined' onClick={handleButtonClicked}>
          Select Photo...
        </Button>
        <input
          type='file'
          onClick={handleInputClicked}
          onChange={handleInputChange}
          ref={inputElementRef}
          className={classes.input}
        ></input>
      </div>
    </div>
  );
};

export default Header;
