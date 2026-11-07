import { isValidLatLng } from './lat-lng';

describe('isValidLatLng', () => {
  it('takes numbers within the range of latitude and longitude', () => {
    expect(isValidLatLng(35.6586, 139.7454)).toBe(true);
    expect(isValidLatLng(-33.8568, -151.2153)).toBe(true);
    expect(isValidLatLng(90, 180)).toBe(true);
    expect(isValidLatLng(-90, -180)).toBe(true);
  });

  it('takes 0, which is a place, not a missing value', () => {
    expect(isValidLatLng(0, 0)).toBe(true);
    expect(isValidLatLng(51.4779, 0)).toBe(true);
  });

  it('refuses what exifr gives for a GPS block whose values are empty', () => {
    expect(isValidLatLng('NaNNaN', 'NaNNaN')).toBe(false);
    expect(isValidLatLng('NNaNNaN', 'ENaNNaN')).toBe(false);
    expect(isValidLatLng(NaN, NaN)).toBe(false);
  });

  it('refuses numbers in text, infinities, and values out of range', () => {
    expect(isValidLatLng('35.6586', '139.7454')).toBe(false);
    expect(isValidLatLng(Infinity, 0)).toBe(false);
    expect(isValidLatLng(0, -Infinity)).toBe(false);
    expect(isValidLatLng(90.0001, 0)).toBe(false);
    expect(isValidLatLng(0, 180.0001)).toBe(false);
  });

  it('refuses missing values', () => {
    expect(isValidLatLng(undefined, undefined)).toBe(false);
    expect(isValidLatLng(35.6586, undefined)).toBe(false);
    expect(isValidLatLng(null, 139.7454)).toBe(false);
  });
});
