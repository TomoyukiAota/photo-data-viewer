// Whether a latitude and a longitude are coordinates a map can show: numbers, not
// NaN or infinite, within -90 to 90 and -180 to 180. Truthiness is not enough:
// for a GPS block whose values are empty, exifr gives text such as "NaNNaN",
// which is truthy, and Leaflet throws on it.
export function isValidLatLng(latitude: unknown, longitude: unknown): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  );
}
