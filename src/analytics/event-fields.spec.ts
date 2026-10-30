import { describeError, toGa4Params } from './event-fields';

describe('toGa4Params', () => {
  it('names the fields in snake_case, as GA4 names its own', () => {
    expect(toGa4Params({ isLatLngAvailable: true, exifMs: 35, mimeType: 'image/jpeg' })).toEqual({
      is_lat_lng_available: true,
      exif_ms: 35,
      mime_type: 'image/jpeg',
    });
  });

  it('leaves out lists, and fields without a value', () => {
    expect(toGa4Params({ exifFields: ['Make'], exifError: undefined, width: null, exifFieldCount: 1 })).toEqual({
      exif_field_count: 1,
    });
  });

  it('cuts text at the 100 characters GA4 keeps', () => {
    expect(toGa4Params({ heifError: 'x'.repeat(150) }).heif_error).toBe('x'.repeat(100));
  });
});

describe('describeError', () => {
  it('gives the name and the message, without the stack', () => {
    const error = new TypeError('Unknown file format');
    expect(describeError(error)).toBe('TypeError: Unknown file format');
  });

  it('takes anything thrown', () => {
    expect(describeError('not an Error')).toBe('not an Error');
  });

  it('cuts a long message', () => {
    expect(describeError(new Error('y'.repeat(500))).length).toBe(200);
  });
});
