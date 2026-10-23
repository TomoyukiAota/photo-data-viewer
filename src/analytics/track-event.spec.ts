import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { AnalyticsEvent, trackEvent } from './analytics';
import { Ga4EventName } from './ga4-event-name';
import {
  trackAppIntegrationMode,
  trackChangedAppLayout,
  trackChangedUserSetting,
  trackLoadedPhotoData,
  trackLoadedUserSetting,
  trackOpenUrl,
  trackPhotoDimensions,
} from './track-event';

jest.mock('./analytics');

const mockedTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

function sent(): AnalyticsEvent[] {
  return mockedTrackEvent.mock.calls.map(([event]) => event);
}

describe('track-event', () => {
  beforeEach(() => {
    const data = {
      file: { filenameExtension: 'JPG', size: { displayString: '4.57 MB' }, mimeType: 'image/jpeg' },
      isFileLoaded: true,
      isExifAvailable: true,
      isLatLngAvailable: true,
    } as unknown as LoadedPhotoData;
    trackLoadedPhotoData(data);
    trackPhotoDimensions({ width: 4032, height: 3024 });
    trackOpenUrl('https://maps.google.com/ with query parameters', 'Show in Google Maps', 'Home Page');
    trackLoadedUserSetting('DateFormat', 'YYYY/MM/DD');
    trackChangedUserSetting('SendUsageData', 'false');
    trackChangedAppLayout('isWideLayout', 'True');
    trackAppIntegrationMode();
  });

  afterEach(() => jest.clearAllMocks());

  it('gives every event one of the names GA4 is sent', () => {
    const names: string[] = Object.values(Ga4EventName);
    for (const event of sent()) {
      expect(names).toContain(event.ga4Name);
    }
  });

  // These are what Photo Location Map's dataset receives, with the category replaced
  // and the action prefixed (plm-backend.ts). Changing one changes what is recorded
  // there, so it is a decision, not a refactoring.
  it('keeps the actions this app has always recorded', () => {
    expect(Array.from(new Set(sent().map((event) => `${event.category} / ${event.action}`)))).toEqual([
      'Loaded Photo / Loaded Photo',
      'Opened URL / [Home Page] Opened URL for Show in Google Maps',
      'User Setting / Loaded User Setting',
      'User Setting / Changed User Setting',
      'App Layout / App Layout',
      'Environment / App Integration Mode',
    ]);
  });

  it('sends a photo load as eight events, one label each', () => {
    expect(sent().filter((event) => event.action === 'Loaded Photo').map((event) => event.label)).toEqual([
      'Filename Extension: jpg',
      'isFileLoaded: true',
      'isExifAvailable: true',
      'isLatLngAvailable: true',
      'File Size: 4.57 MB',
      'MIME Type: image/jpeg',
      'Image Width: 4032',
      'Image Height: 3024',
    ]);
  });

  it('sends GA4 where a URL was opened from, and what for, as parameters', () => {
    const opened = sent().find((event) => event.category === 'Opened URL');
    expect(opened?.ga4Params).toEqual({ from: 'Home Page', url_description: 'Show in Google Maps' });
  });
});
