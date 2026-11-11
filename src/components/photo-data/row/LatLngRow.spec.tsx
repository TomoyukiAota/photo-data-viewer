import { act, render, screen } from '@testing-library/react';

import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { applyLanguage } from '../../../i18n/i18n';
import LatLngRow from './LatLngRow';

afterEach(() => act(() => applyLanguage('en')));

/** A photo as far as this row looks at it: whether a file is loaded, and its location if it has one. */
function photo(location?: { latitude: number; longitude: number }): LoadedPhotoData {
  return {
    isFileLoaded: true,
    exif: location ? { ...location, isLatLngAvailable: true } : null,
  } as unknown as LoadedPhotoData;
}

/** The line of the row's grid that an element is on, by its class: `latitude` or `longitude`. */
function line(element: Element): string | undefined {
  return ['latitude', 'longitude'].find((name) => element.classList.contains(name));
}

it('has each name on the line of its number, so that the two stay side by side however the name wraps', () => {
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);

  expect(line(screen.getByText('Latitude'))).toBe('latitude');
  expect(line(screen.getByText('37.332558'))).toBe('latitude');
  expect(line(screen.getByText('Longitude'))).toBe('longitude');
  expect(line(screen.getByText('-122.005661'))).toBe('longitude');
});

it('writes the numbers from left to right in every language, so that a minus sign stays before its number', () => {
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);
  expect(screen.getByText('37.332558').getAttribute('dir')).toBe('ltr');
  expect(screen.getByText('-122.005661').getAttribute('dir')).toBe('ltr');
});

it('has the two buttons that show the place, named in the language', async () => {
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);
  expect(screen.getAllByRole('button').map((button) => button.title)).toEqual([
    'Show in Google Maps',
    'Show in Google Street View',
  ]);

  await act(() => applyLanguage('ja'));
  expect(screen.getAllByRole('button').map((button) => button.title)).toEqual([
    'Google マップで表示',
    'Google ストリートビューで表示',
  ]);
});

it('says once that the location is not available for a photo without one, and has no buttons then', () => {
  render(<LatLngRow loadedPhotoData={photo()} />);
  expect(screen.getByText('Latitude')).toBeTruthy();
  expect(screen.getByText('Longitude')).toBeTruthy();
  expect(screen.getAllByText('Not Available')).toHaveLength(1);
  expect(screen.queryAllByRole('button')).toEqual([]);
});

it('has the two names alone until a photo is loaded', () => {
  const { container } = render(<LatLngRow loadedPhotoData={null} />);
  expect(container.textContent).toBe('LatitudeLongitude');
  expect(screen.queryAllByRole('button')).toEqual([]);
});

it('takes the size of its text from the table, as the other rows do', () => {
  const { container } = render(<LatLngRow loadedPhotoData={null} style={{ fontSize: '0.82rem' }} />);
  expect((container.firstElementChild as HTMLElement).style.fontSize).toBe('0.82rem');
});
