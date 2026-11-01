import { FileSize, createLoadedPhotoFileData } from './loaded-photo-file-data';

it.each([
  [0, '0 B'], [1, '1 B'], [999, '999 B'], [1000, '1 kB'],
  [1024, '1.02 kB'], [1000000, '1 MB'], [1048576, '1.05 MB'],
  [265318, '265.32 kB'],
])('preserves the displayed file size for %i bytes', (bytes, expected) => {
  expect(new FileSize(bytes as number).displayString).toBe(expected);
});

it('preserves original file metadata and extension case', () => {
  const file = new File(['test'], 'Example.JPG', { type: 'image/jpeg', lastModified: 1600000000000 });
  const data = createLoadedPhotoFileData(file)!;
  expect(data.file).toBe(file);
  expect(data.name).toBe('Example.JPG');
  expect(data.filenameExtension).toBe('JPG');
  expect(data.size?.displayString).toBe('4 B');
  expect(data.mimeType).toBe('image/jpeg');
});
