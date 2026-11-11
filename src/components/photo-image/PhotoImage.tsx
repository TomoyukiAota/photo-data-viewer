// Disabling @next/next/no-img-element to rotate the photo and place the rotate icon
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IconDataUrl } from '../../icons/icon-data-url';
import classes from './PhotoImage.module.scss';
import PhotoText from './PhotoText';

const PhotoImage: React.FC<{ className?: string; url: string; alt: string }> = (
  props
) => {
  const { t } = useTranslation();
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const rotateIconRef = useRef<HTMLImageElement>(null);

  // The address of the image the browser could not show, if it is the current
  // one: the next photo is given to the same component, and gets an <img> again.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const isUnsupported = failedUrl === props.url;

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

  const handlePhotoImgOnError = () => {
    setFailedUrl(props.url);
  };

  return (
    <div
      className={classes['image-and-control']}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      <div className={classes['photo-img-container']} ref={photoContainerRef}>
        {isUnsupported ? (
          // As the other texts in the photo's place: in the middle, on as
          // many lines as a language needs in a narrow pane.
          <PhotoText>{t('photo.unsupportedFileFormat')}</PhotoText>
        ) : (
          <img
            className={classes['photo-img']}
            src={props.url}
            alt={props.alt}
            ref={photoImgRef}
            onError={handlePhotoImgOnError}
          />
        )}
      </div>
      <img
        className={classes['rotate-icon']}
        src={IconDataUrl.rotate}
        alt={t('photo.rotate')}
        title={t('photo.rotate')}
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
