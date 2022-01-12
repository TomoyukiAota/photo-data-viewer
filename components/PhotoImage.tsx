import classes from './PhotoData.module.scss';

const PhotoImage: React.FC<{ className?: string }> = (props) => {
  return <div className={`${props.className}`}>Photo Image</div>;
};

export default PhotoImage;
