import exifr from 'exifr';
import { createLoadedPhotoData } from './loaded-photo-data';

jest.mock('exifr', () => ({ __esModule: true, default: { parse: jest.fn() } }));
// sort-keys is ES modules only, which Jest here cannot load; this does what the app uses it for.
jest.mock('sort-keys', () => ({
  __esModule: true,
  default: (object: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(object).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))),
}));

const mockedParse = exifr.parse as jest.MockedFunction<typeof exifr.parse>;

function file() {
  return new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
}

describe('createLoadedPhotoData', () => {
  afterEach(() => jest.clearAllMocks());

  it('reports the EXIF data found, with the names of its fields', async () => {
    mockedParse.mockResolvedValue({ Make: 'Apple', ApertureValue: 1.8, latitude: 34.7, longitude: 135.2 });
    const data = await createLoadedPhotoData(file());
    expect(data.exifResult).toBe('found');
    expect(data.exifFields).toEqual(['ApertureValue', 'Make', 'latitude', 'longitude']);
    expect(data.isLatLngAvailable).toBe(true);
  });

  it('reports a file without EXIF data', async () => {
    mockedParse.mockResolvedValue(undefined);
    const data = await createLoadedPhotoData(file());
    expect(data.exifResult).toBe('none');
    expect(data.exifFields).toEqual([]);
    expect(data.isExifAvailable).toBe(false);
  });

  it('reports why reading the EXIF data failed, and goes on as for a file without it', async () => {
    mockedParse.mockRejectedValue(new Error('Unknown file format'));
    const data = await createLoadedPhotoData(file());
    expect(data.exifResult).toBe('error');
    expect(data.exifError).toBe('Error: Unknown file format');
    expect(data.isExifAvailable).toBe(false);
    expect(data.isFileLoaded).toBe(true);
  });
});
