import { useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import DialogContext from '../../context/dialog/dialog-context';

import classes from './UnsupportedFileSelectedDialog.module.scss';

const UnsupportedFileSelectedDialog: React.FC = () => {
  const dialogCtx = useContext(DialogContext);
  const isOpened = dialogCtx.unsupportedFileSelected.isOpened;

  const handleClose = () => {
    dialogCtx.unsupportedFileSelected.close();
  };

  return (
    <Dialog open={isOpened}>
      <div className={classes.dialog}>
        <DialogTitle
          sx={{ padding: 0, fontSize: '1.1rem' }}
          className={classes.title}
        >
          Unsupported File Format
        </DialogTitle>
        <div className={classes.message}>EXIF data is not available.</div>
        <div className={classes['close-button-container']}>
          <Button variant='text' onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default UnsupportedFileSelectedDialog;
