import classes from './PhotoMap.module.scss';

const PhotoMap: React.FC<{ className?: string }> = (props) => {
  return <div className={`${props.className}`}>Photo Map</div>;
};

export default PhotoMap;
