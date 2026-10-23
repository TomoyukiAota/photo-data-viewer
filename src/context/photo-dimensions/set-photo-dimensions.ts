import { PhotoDimensionsContextType } from './photo-dimensions-context';
import { PhotoDimensions } from './photo-dimensions-type';

// Resolves with the dimensions once the image has loaded, or with null when it cannot be.
export function setPhotoDimensions(ctx: PhotoDimensionsContextType, photoSrc: string): Promise<PhotoDimensions | null> {
  return new Promise((resolve) => {
    const photoImg = new Image();
    photoImg.onload = () => {
      const width = photoImg.naturalWidth;
      const height = photoImg.naturalHeight;
      ctx.setDimensions({ width, height });
      ctx.setLoadStatus('Load Success');
      console.log(`Fetched the photo's { width: ${width}, height: ${height} }`);
      resolve({ width, height });
    };
    photoImg.onerror = () => {
      ctx.setDimensions(null);
      ctx.setLoadStatus('Load Failed');
      console.log(`Failed to fetch photo's width and height.`);
      resolve(null);
    }
    photoImg.src = photoSrc;
  });
}
