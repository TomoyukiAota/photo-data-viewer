import { Button } from '@mui/material';
import { useContext } from 'react';

import PhotoContext from '../../context/photo/photo-context';
import classes from './Demo.module.scss';

function blobToFile(blob: Blob, fileName:string): File {
  return new File(
    [blob],
    fileName,
    {
      lastModified: new Date().getTime(), // lastModified is the current time, which is the same as the file downloaded to the disk using web browsers.
      type: blob.type
    }
  )
}

const Demo: React.FC = () => {
  const photoCtx = useContext(PhotoContext);

  const handleButtonClicked: React.MouseEventHandler<
      HTMLButtonElement
  > = async () => {
    // Using jsDelivr for 'https://github.com/TomoyukiAota/photo-data-viewer-resources/blob/d803c13d8718d4ac8b3dad8dfb9597d441040f4d/photos/IMG_5769.JPG?raw=true';
    // This is to circumvent the CORS error which occurs when the file in GitHub is directly fetched.
    const photoUrl = 'https://cdn.jsdelivr.net/gh/TomoyukiAota/photo-data-viewer-resources@d803c13d8718d4ac8b3dad8dfb9597d441040f4d/photos/IMG_5769.JPG'

    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const file = blobToFile(blob, 'IMG_5769.JGP');
    photoCtx.loadPhoto(file);
  };

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>Demo</div>
      <div className={classes['messages']}>
        <div>
          Once &quot;Run Demo&quot; button is clicked, this application behaves as if this photo is selected.
        </div>
      </div>
      <div className={classes['run-demo']}>
        <Button
          className={classes['run-demo-button']}
          variant='outlined'
          onClick={handleButtonClicked}
          sx={{ textTransform: 'none' }}
        >
          Run Demo
        </Button>
      </div>
    </div>
  );
};

export default Demo;
