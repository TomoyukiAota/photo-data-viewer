import { Button } from "@mui/material";

import classes from './Demo.module.scss';

const Demo: React.FC = () => {
  const handleButtonClicked: React.MouseEventHandler<
      HTMLButtonElement
  > = () => {
    console.log('Run Demo button is clicked.');
    // Select the photo, and switch to the home page.
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
