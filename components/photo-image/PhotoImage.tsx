import Image from 'next/image';

import overrideNextImage from '../../styles/override-next-image.module.scss';
import classes from './PhotoImage.module.scss';

const PhotoImage: React.FC<{ className?: string; url: string; alt: string }> = (
  props
) => {
  return (
    <div className={overrideNextImage['next-image-container']}>
      <Image
        className={overrideNextImage['next-image']}
        src={props.url}
        alt={props.alt}
        layout='fill'
      ></Image>
    </div>
  );
};

export default PhotoImage;
