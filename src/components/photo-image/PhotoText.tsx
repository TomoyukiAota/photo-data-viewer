import classNames from 'classnames';

import classes from './PhotoText.module.scss';

const PhotoText: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={classNames(classes.text, props.className)}>
      {props.children}
    </div>
  );
};

export default PhotoText;
