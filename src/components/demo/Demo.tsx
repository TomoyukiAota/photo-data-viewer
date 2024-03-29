import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import PhotoContext from '../../context/photo/photo-context';
import { sleep } from '../../utils/sleep';
import { blobToFile } from './blob-to-file';
import classes from './Demo.module.scss';

// Using jsDelivr for 'https://github.com/TomoyukiAota/photo-data-viewer-resources/blob/2ba9ef57fd580cdabc4b26102098064e0b3c8505/photos/Demo%20(Apple%20Park).jpg?raw=true';
// This is to circumvent the CORS error which occurs when the file in GitHub is directly fetched.
const photoUrlForDemo =
  'https://cdn.jsdelivr.net/gh/TomoyukiAota/photo-data-viewer-resources@2ba9ef57fd580cdabc4b26102098064e0b3c8505/photos/Demo%20(Apple%20Park).jpg';

const Demo: React.FC = () => {
  const photoCtx = useContext(PhotoContext);
  const router = useRouter();

  const handleButtonClicked: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    await router.push('/');
    await sleep(1000); // After navigating to Home page, wait for some time. This makes the demo look better.
    const response = await fetch(photoUrlForDemo);
    const blob = await response.blob();
    const file = blobToFile(blob, 'Demo (Apple Park).jpg');
    photoCtx.loadPhoto(file);
  };

  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>Demo</div>
      <div className={classes['messages']}>
        <div>
          Once &quot;Run Demo&quot; button is clicked, this application behaves
          as if{' '}
          <a href={photoUrlForDemo} target='_blank' rel='noopener'>
            this photo
          </a>{' '}
          is selected.
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
