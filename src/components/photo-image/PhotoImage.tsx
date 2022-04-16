// Disabling @next/next/no-img-element to rotate the photo and place the rotate icon
/* eslint-disable @next/next/no-img-element */

import { useContext, useEffect, useRef } from 'react';

import PhotoDimensionsContext from '../../context/photo-dimensions/photo-dimensions-context';
import { IconDataUrl } from '../../icons/icon-data-url';
import classes from './PhotoImage.module.scss';

const PhotoImage: React.FC<{ className?: string; url: string; alt: string }> = (
  props
) => {
  const photoDimensionsCtx = useContext(PhotoDimensionsContext);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const rotateIconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const photoImg = photoImgRef.current;
    if (photoImg) {
      photoImg.style.transform = '';
    }
  }, [props.url]);

  const handleOnMouseEnter = () => {
    const imgElement = rotateIconRef.current;
    if (imgElement) {
      imgElement.style.opacity = '0.5';
    }
  };

  const handleOnMouseLeave = () => {
    const imgElement = rotateIconRef.current;
    if (imgElement) {
      imgElement.style.opacity = '0';
    }
  };

  const handleRotateIconClicked = () => {
    const container = photoContainerRef.current;
    const photoImg = photoImgRef.current;
    if (!container || !photoImg) {
      return;
    }

    const scaleFor90Or270Degree =
      container.clientWidth > container.clientHeight
        ? container.clientHeight / photoImg.width
        : container.clientWidth / photoImg.height;

    const transformString = photoImg.style.transform;
    if (transformString.includes('rotate(')) {
      const currentDegreeInString = transformString
        .split('rotate(')[1]
        .split('deg)')[0];
      const currentDegree = Number(currentDegreeInString);
      const nextDegree = currentDegree + 90;
      if (nextDegree % 180 === 0) {
        photoImg.style.transform = `rotate(${nextDegree}deg) scale(1)`;
      } else {
        photoImg.style.transform = `rotate(${nextDegree}deg) scale(${scaleFor90Or270Degree})`;
      }
    } else {
      photoImg.style.transform = `rotate(90deg) scale(${scaleFor90Or270Degree})`;
    }
  };

  const handlePhotoImgOnLoad = () => {
    const photoImg = photoImgRef.current;
    if (!photoImg) return;

    const width = photoImg.naturalWidth;
    const height = photoImg.naturalHeight;
    console.log(
      `<img /> for the photo is loaded. { width: ${width}, height: ${height} }`
    );
    photoDimensionsCtx.setDimensions({ width, height });
    photoDimensionsCtx.setLoadStatus('Load Success');
  };

  const handlePhotoImgOnError = () => {
    photoDimensionsCtx.setDimensions(null);
    photoDimensionsCtx.setLoadStatus('Load Failed');
  };

  return (
    <div
      className={classes['image-and-control']}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <div className={classes['photo-img-container']} ref={photoContainerRef}>
        <img
          className={classes['photo-img']}
          src={props.url}
          alt={props.alt}
          ref={photoImgRef}
          onLoad={handlePhotoImgOnLoad}
          onError={handlePhotoImgOnError}
        />
      </div>
      <img
        className={classes['rotate-icon']}
        src={IconDataUrl.rotate}
        alt='Rotate photo'
        title='Rotate photo'
        width='40'
        height='40'
        style={{ opacity: 0 }}
        onClick={handleRotateIconClicked}
        ref={rotateIconRef}
      />
    </div>
  );
};

export default PhotoImage;
