import { useRouter } from 'next/router';
import { useContext, useId } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import DialogContext from '../../context/dialog/dialog-context';
import PhotoContext from '../../context/photo/photo-context';

import classes from './DropPhotoDialog.module.scss';

/**
 * Asks before a photo dropped on the page (src/components/drop-photo/DropPhoto.tsx) is selected, so that a photo
 * dropped by accident does not replace the one shown. Select has the focus, so Enter selects; Escape, or a click
 * outside the dialog, cancels.
 */
const DropPhotoDialog: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dialogCtx = useContext(DialogContext);
  const photoCtx = useContext(PhotoContext);
  const { isOpened, file } = dialogCtx.dropPhoto;
  const fileNameId = useId();

  const handleCancel = () => {
    dialogCtx.dropPhoto.close();
  };

  const handleSelect = async () => {
    // A second click, while the dialog fades out, selects nothing more.
    if (!isOpened || !file) return;
    dialogCtx.dropPhoto.close();
    // The photo is shown on the Home page, which is opened first, as the Demo page does.
    if (router.pathname !== '/') {
      await router.push('/');
    }
    photoCtx.loadPhoto(file, { isDropped: true });
  };

  return (
    <Dialog open={isOpened} onClose={handleCancel} aria-describedby={fileNameId}>
      <div className={classes.dialog}>
        <DialogTitle
          sx={{ padding: 0, fontSize: '1.1rem' }}
          className={classes.title}
        >
          {t('dropPhoto.title')}
        </DialogTitle>
        {/* A file's name keeps its own direction, as in the table of the Home page. */}
        <div className={classes.message} id={fileNameId} dir='auto'>
          {file?.name}
        </div>
        <div className={classes.buttons}>
          <Button variant='text' onClick={handleCancel}>
            {t('dropPhoto.cancel')}
          </Button>
          <Button variant='text' onClick={handleSelect} autoFocus>
            {t('dropPhoto.select')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DropPhotoDialog;
