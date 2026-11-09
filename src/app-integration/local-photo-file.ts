// An earlier Photo Location Map, whose window has Node.js, passes the photo's path in the address and leaves this app
// to read the photo itself (LoadPhotoInPlm.tsx). This app reads it with Electron's own require, which that window has
// because it enables nodeIntegration. Not the bundler's: this app is built for a browser (next.config.js), where fs is
// not there.

/** Node.js's require, or what stands in for it in a test. */
export type NodeRequire = (id: string) => any;

/**
 * The MIME types that `mime-types` 2.1.35, which this app read the photo with before, gives the extensions of the
 * photos that Photo Location Map opens in this app. Its isolated window gives the same types through its bridge
 * (src-main/photo-data-viewer/photo-delivery.ts of https://github.com/TomoyukiAota/photo-location-map).
 */
const mimeTypes: Readonly<Record<string, string>> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jpe': 'image/jpeg',
  '.png': 'image/png',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.webp': 'image/webp',
};

/** The MIME type of a file with `extension`, such as ".jpg", or "" when it is none of the above. */
export function mimeTypeOfExtension(extension: string): string {
  return Object.hasOwn(mimeTypes, extension.toLowerCase())
    ? mimeTypes[extension.toLowerCase()]
    : '';
}

/** Electron's require in a window with Node.js, or null in any other window. */
export function electronRequire(): NodeRequire | null {
  if (typeof window === 'undefined') return null;
  const nodeRequire = (window as unknown as { require?: unknown }).require;
  return typeof nodeRequire === 'function'
    ? (nodeRequire as NodeRequire)
    : null;
}

/** The photo at `photoPath`, read with the fs of `nodeRequire`. */
export function readLocalPhotoFile(
  photoPath: string,
  nodeRequire: NodeRequire,
): File {
  const fs = nodeRequire('fs');
  const path = nodeRequire('path');
  const content: Uint8Array = fs.readFileSync(photoPath);
  return new File([content as BlobPart], path.basename(photoPath), {
    type: mimeTypeOfExtension(path.extname(photoPath)),
  });
}
