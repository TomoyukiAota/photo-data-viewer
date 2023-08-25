import classes from './Demo.module.scss';

const Demo: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes['page-title']}>Demo</div>
      <div className={classes['messages']}>
        <div>
          Once &quot;Run Demo&quot; button is clicked, this application behaves as if this photo is selected.
        </div>
      </div>
    </div>
  );
};

export default Demo;
