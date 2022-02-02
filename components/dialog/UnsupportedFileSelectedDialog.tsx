import { useContext } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import DialogContext from '../../store/dialog/dialog-context';

import classes from './UnsupportedFileSelectedDialog.module.scss';

function UnsupportedFileSelectedDialog(props) {
  const dialogCtx = useContext(DialogContext);
  const isOpened = dialogCtx.unsupportedFileSelected.isOpened;

  const handleClose = () => {
    dialogCtx.unsupportedFileSelected.close();
  };

  return (
    <Dialog onClose={handleClose} open={isOpened}>
      <div className={classes.dialog}>
        <DialogTitle sx={{ padding: 0 }} className={classes.title}>
          Unsupported File Format
        </DialogTitle>
        <div className={classes.message}>EXIF data is not available.</div>
      </div>
    </Dialog>
  );
}

export default UnsupportedFileSelectedDialog;
