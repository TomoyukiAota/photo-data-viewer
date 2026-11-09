import path from 'path';
import {
  electronRequire,
  mimeTypeOfExtension,
  NodeRequire,
  readLocalPhotoFile,
} from './local-photo-file';

type WindowWithRequire = Window & { require?: unknown };

describe('The photo that an earlier Photo Location Map leaves this app to read', () => {
  afterEach(() => {
    delete (window as WindowWithRequire).require;
  });

  it('has the MIME type that mime-types gave its extension, whatever its case', () => {
    expect(
      [
        '.jpg',
        '.JPEG',
        '.jpe',
        '.png',
        '.tif',
        '.TIFF',
        '.heic',
        '.HEIF',
        '.webp',
      ].map(mimeTypeOfExtension),
    ).toEqual([
      'image/jpeg',
      'image/jpeg',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/tiff',
      'image/heic',
      'image/heif',
      'image/webp',
    ]);
    // mime-types knew none of these, though Photo Location Map opens them as JPEG.
    expect(
      ['.jfif', '.jfi', '.jif', '', '.constructor'].map(mimeTypeOfExtension),
    ).toEqual(['', '', '', '', '']);
  });

  it("is read with the fs of Electron's own require, which only a window with Node.js has", () => {
    expect(electronRequire()).toBeNull();
    (window as WindowWithRequire).require = { not: 'a function' };
    expect(electronRequire()).toBeNull();
    const nodeRequire = jest.fn();
    (window as WindowWithRequire).require = nodeRequire;
    expect(electronRequire()).toBe(nodeRequire);
  });

  it('is a File of the bytes, the name and the MIME type of the file at the path', () => {
    const readFileSync = jest.fn(() => new Uint8Array([1, 2, 3, 4]));
    const nodeRequire: NodeRequire = (id) =>
      id === 'fs' ? { readFileSync } : id === 'path' ? path : undefined;
    const file = readLocalPhotoFile('/photos/IMG_0001.HEIC', nodeRequire);
    expect(readFileSync).toHaveBeenCalledWith('/photos/IMG_0001.HEIC');
    expect([file.name, file.type, file.size]).toEqual([
      'IMG_0001.HEIC',
      'image/heic',
      4,
    ]);
  });
});
