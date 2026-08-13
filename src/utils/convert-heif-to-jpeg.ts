// The quality of the JPEG image converted from the HEIF image.
// The converted image is only used to display the photo, so the quality does
// not need to be 1 (i.e. the largest file size).
const jpegQuality = 0.92;

async function createImageDataFromHeif(file: File): Promise<ImageData> {
  // Importing dynamically because libheif-js is large (about 1.5 MB) and is
  // only needed when a HEIF file is loaded.
  const libheif = (await import('libheif-js/wasm-bundle')).default;

  const buffer = new Uint8Array(await file.arrayBuffer());
  const images = new libheif.HeifDecoder().decode(buffer);

  try {
    const image = images[0]; // The primary image is the first one.
    if (!image) {
      throw new Error('The HEIF file does not contain any image.');
    }

    const width = image.get_width();
    const height = image.get_height();
    const imageData = new ImageData(width, height);
    await new Promise<void>((resolve, reject) => {
      image.display(imageData, (displayedImageData) => {
        if (displayedImageData) {
          resolve();
        } else {
          reject(new Error('Failed to decode the image in the HEIF file.'));
        }
      });
    });
    return imageData;
  } finally {
    images.forEach((image) => image.free());
  }
}

// Converts a HEIF file (e.g. the HEIC file taken by iPhone) into a JPEG blob
// because browsers cannot display a HEIF file.
export async function convertHeifToJpeg(file: File): Promise<Blob> {
  const imageData = await createImageDataFromHeif(file);

  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Failed to get the 2d context of the canvas.');
  }
  context.putImageData(imageData, 0, 0);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert the canvas into a JPEG blob.'));
        }
      },
      'image/jpeg',
      jpegQuality
    );
  });
}
