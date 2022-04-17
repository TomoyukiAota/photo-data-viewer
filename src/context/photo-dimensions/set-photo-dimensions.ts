import { PhotoDimensionsContextType } from './photo-dimensions-context';

export function setPhotoDimensions(ctx: PhotoDimensionsContextType, photoSrc: string): void {
  const photoImg = new Image();
  photoImg.onload = () => {
    const width = photoImg.naturalWidth;
    const height = photoImg.naturalHeight;
    ctx.setDimensions({ width, height });
    ctx.setLoadStatus('Load Success');
    console.log(`Fetched the photo's { width: ${width}, height: ${height} }`);
  };
  photoImg.onerror = () => {
    ctx.setDimensions(null);
    ctx.setLoadStatus('Load Failed');
    console.log(`Failed to fetch photo's width and height.`);
  }
  photoImg.src = photoSrc;
}
