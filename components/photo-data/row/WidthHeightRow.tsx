import classes from './WidthHeightRow.module.scss';

const WidthHeightRow: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = (props) => {
  if (!props?.width || !props?.height) return <div></div>;

  return (
    <div>
      {props.width} x {props.height}
    </div>
  );
};

export default WidthHeightRow;
