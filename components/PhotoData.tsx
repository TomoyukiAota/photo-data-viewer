import classes from './PhotoData.module.scss';

const PhotoData: React.FC<{ className?: string }> = (props) => {
  return <div className={`${props.className}`}>Photo Data</div>;
};

export default PhotoData;
