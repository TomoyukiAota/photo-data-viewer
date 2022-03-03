import { getExtension, isHeif } from './filename-extension';

describe('FilenameExtension', () => {
  it('getExtension', () => {
    expect(getExtension('file.jpg')).toBe('jpg');
    expect(getExtension('file.JPG')).toBe('JPG');
    expect(getExtension('file.heic')).toBe('heic');
    expect(getExtension('file.HEIC')).toBe('HEIC');
    expect(getExtension('file.heif')).toBe('heif');
    expect(getExtension('file.HEIF')).toBe('HEIF');
    expect(getExtension('file.randomExtension')).toBe('randomExtension');
    expect(getExtension('file.notExtension.randomExtension')).toBe('randomExtension');
    expect(getExtension('noExtension')).toBe('');
  })

  it('isHeif', () => {
    expect(isHeif('file.heic')).toBeTruthy();
    expect(isHeif('file.HEIC')).toBeTruthy();
    expect(isHeif('file.heif')).toBeTruthy();
    expect(isHeif('file.HEIF')).toBeTruthy();
    expect(isHeif('file.notExtension.heic')).toBeTruthy();
    expect(isHeif('file.notExtension.HEIC')).toBeTruthy();
    expect(isHeif('file.notExtension.heif')).toBeTruthy();
    expect(isHeif('file.notExtension.HEIF')).toBeTruthy();

    expect(isHeif('file.jpg')).toBeFalsy();
    expect(isHeif('file.JPG')).toBeFalsy();
    expect(isHeif('file.randomExtension')).toBeFalsy();
    expect(isHeif('file.notExtension.randomExtension')).toBeFalsy();
    expect(isHeif('noExtension')).toBeFalsy();
  });
});
