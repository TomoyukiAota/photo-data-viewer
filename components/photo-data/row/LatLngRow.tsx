import classes from './LatLngRow.module.scss';

const LatLngRow: React.FC<{
  className?: string;
  latitude?: number;
  longitude?: number;
}> = (props) => {
  if (!props?.latitude || !props?.longitude) return <div></div>;

  return (
    <div>
      {props?.latitude?.toFixed(4) ?? ''}, {props?.longitude?.toFixed(4) ?? ''}
    </div>
  );
};

export default LatLngRow;
