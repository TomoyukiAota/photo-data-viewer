import { Button } from '@mui/material';
import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import PhotoContext from '../../context/photo/photo-context';
import { AppMenuRoom } from '../app-menu/AppMenu';
import classes from './Header.module.scss';

const Header: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
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
    <div className={`${props.className ?? ''} ${classes.header}`}>
      <div className={classes.content}>
        <div className={classes.text}>{t('home.selectYourPhoto')}</div>
        <Button
          variant='outlined'
          onClick={handleButtonClicked}
          sx={{ textTransform: 'none' }}
        >
          {t('home.selectPhoto')}
        </Button>
        <input
          type='file'
          onClick={handleInputClicked}
          onChange={handleInputChange}
          ref={inputElementRef}
          className={classes.input}
        />
      </div>
      {/* The menu's button lies over this end of the header. */}
      <AppMenuRoom className={classes['menu-room']} />
    </div>
  );
};

export default Header;
