import classes from './Header.module.scss';

const Header: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={`${props.className} ${classes.header}`}>
      <div>Select your photo to display the EXIF data:</div>
      <input></input>
      <button>Select</button>
    </div>
  );
};

export default Header;
