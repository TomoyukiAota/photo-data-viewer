import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import DialogContext from '../../context/dialog/dialog-context';

import classes from './UnsupportedFileSelectedDialog.module.scss';

const UnsupportedFileSelectedDialog: React.FC = () => {
  const { t } = useTranslation();
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
          {t('unsupportedFileDialog.title')}
        </DialogTitle>
        <div className={classes.message}>
          {t('unsupportedFileDialog.message')}
        </div>
        <div className={classes['close-button-container']}>
          <Button variant='text' onClick={handleClose}>
            {t('unsupportedFileDialog.close')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default UnsupportedFileSelectedDialog;
