import { useContext } from 'react';
import PhotoDimensionsContext from '../../../context/photo-dimensions/photo-dimensions-context';
import classes from './WidthHeightRow.module.scss';

const WidthHeightRow: React.FC = () => {
  const { dimensions, loadStatus } = useContext(PhotoDimensionsContext);

  if (loadStatus === 'Not Loaded') {
    return <div />; // at app start
  } else if (loadStatus === 'Loading') {
    return <div>Loading...</div>;
  } else if (loadStatus === 'Load Failed') {
    return <div>Not Available</div>;
  }

  if (!dimensions) {
    console.assert(
      "Something went wrong when loadStatus === 'Load Success' and dimensions is falsy."
    );
    return <div />;
  }

  const { width, height } = dimensions;
  return (
    <div>
      {width} x {height}
    </div>
  );
};

export default WidthHeightRow;
