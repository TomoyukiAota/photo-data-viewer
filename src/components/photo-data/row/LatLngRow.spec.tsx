import { act, fireEvent, render, screen } from '@testing-library/react';

import { trackOpenUrl } from '../../../analytics/track-event';
import { AppIntegration } from '../../../app-integration/app-integration';
import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { applyLanguage } from '../../../i18n/i18n';
import LatLngRow from './LatLngRow';

// What a button records is checked here, and sent nowhere.
jest.mock('../../../analytics/track-event');

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  return act(() => applyLanguage('en'));
});

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

it('has the three buttons that show the place, named in the language', async () => {
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);
  expect(screen.getAllByRole('button').map((button) => button.title)).toEqual([
    'Show in Google Maps',
    'Show in Google Street View',
    'Show in Google Earth',
  ]);

  await act(() => applyLanguage('ja'));
  expect(screen.getAllByRole('button').map((button) => button.title)).toEqual([
    'Google マップで表示',
    'Google ストリートビューで表示',
    'Google Earth で表示',
  ]);
});

it('opens Google Earth in a new tab at the place, which Google Earth marks, and the tab cannot reach this page', () => {
  const tab = { opener: window } as unknown as Window;
  const open = jest.spyOn(window, 'open').mockReturnValue(tab);
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);

  fireEvent.click(screen.getByRole('button', { name: 'Show in Google Earth' }));
  // A search for the coordinates, which puts a pin on them.
  expect(open.mock.calls).toEqual([['https://earth.google.com/web/search/37.332558,-122.005661', '_blank']]);
  expect(tab.opener).toBeNull();
});

it('records which button was used in the usage data, and not where the photo was taken', () => {
  jest.spyOn(window, 'open').mockReturnValue(null);
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);

  for (const button of screen.getAllByRole('button')) fireEvent.click(button);
  const recorded = jest.mocked(trackOpenUrl).mock.calls;
  expect(recorded).toEqual([
    ['https://maps.google.com/ with query parameters for latitude, longitude, and zoom', 'Show in Google Maps', 'Home Page'],
    ['https://www.google.com/maps/ with query parameters for latitude, longitude, and zoom', 'Show in Google Street View', 'Home Page'],
    ['https://earth.google.com/web/search/ with latitude and longitude', 'Show in Google Earth', 'Home Page'],
  ]);
  expect(JSON.stringify(recorded)).not.toMatch(/37\.33|122\.00/);
});

// Photo Location Map records the address that a button opens, with the
// coordinates of an address that is not Google Maps' (LatLngRow.tsx).
it('has no Google Earth button in Photo Location Map', () => {
  jest.spyOn(AppIntegration, 'isPlm', 'get').mockReturnValue(true);
  render(<LatLngRow loadedPhotoData={photo({ latitude: 37.332558, longitude: -122.005661 })} />);
  expect(screen.getAllByRole('button').map((button) => button.title)).toEqual([
    'Show in Google Maps',
    'Show in Google Street View',
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
