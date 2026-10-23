import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { AnalyticsEvent, trackEvent } from './analytics';
import { toGa4Params } from './event-fields';
import { Ga4EventName, isValidGa4Name } from './ga4-event-name';
import {
  trackAppIntegrationMode,
  trackChangedAppLayout,
  trackChangedUserSetting,
  trackDisplayedPhoto,
  trackLoadedPhoto,
  trackLoadedUserSetting,
  trackOpenedUnsupportedFileDialog,
  trackOpenUrl,
  trackPageHidden,
  trackPageLoaded,
  trackRanDemo,
} from './track-event';

jest.mock('./analytics');

const mockedTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

function sent(): AnalyticsEvent[] {
  return mockedTrackEvent.mock.calls.map(([event]) => event);
}

function photo(): LoadedPhotoData {
  return {
    file: { filenameExtension: 'JPG', size: { byte: 4790000, displayString: '4.57 MB' }, mimeType: 'image/jpeg' },
    isFileLoaded: true,
    isExifAvailable: true,
    isLatLngAvailable: true,
    exifResult: 'found',
    exifFields: ['ApertureValue', 'Make', 'latitude', 'longitude'],
  } as unknown as LoadedPhotoData;
}

describe('track-event', () => {
  beforeEach(() => {
    trackLoadedPhoto(photo(), { exifMs: 34.6, isReload: false, isDemo: false });
    trackDisplayedPhoto({
      dimensions: { width: 4032, height: 3024 },
      loadMs: 812.4,
      heif: { result: 'converted', decodeMs: 650.2 },
      isReload: false,
      isDemo: true,
    });
    trackOpenedUnsupportedFileDialog();
    trackRanDemo();
    trackPageHidden({ secondsSinceLoad: 95.4, visibleSeconds: 80.6 });
    trackOpenUrl('https://maps.google.com/ with query parameters', 'Show in Google Maps', 'Home Page');
    trackLoadedUserSetting('DateFormat', 'YYYY/MM/DD');
    trackChangedUserSetting('SendUsageData', 'false');
    trackChangedAppLayout('isWideLayout', 'True');
    trackAppIntegrationMode();
    trackPageLoaded();
  });

  afterEach(() => jest.clearAllMocks());

  it('gives every event one of the names GA4 is sent', () => {
    const names: string[] = Object.values(Ga4EventName);
    for (const event of sent()) {
      expect(names).toContain(event.ga4Name);
    }
  });

  it('gives GA4 only parameter names it accepts', () => {
    for (const event of sent()) {
      const params = {
        ...(typeof event.label === 'object' ? toGa4Params(event.label) : {}),
        ...event.ga4Params,
      };
      for (const name of Object.keys(params)) {
        expect(isValidGa4Name(name)).toBe(true);
      }
    }
  });

  // These are what Photo Location Map's dataset receives, with the category replaced
  // and the action prefixed (plm-backend.ts). Changing one changes what is recorded
  // there, so it is a decision, not a refactoring.
  it('records these actions', () => {
    expect(sent().map((event) => `${event.category} / ${event.action}`)).toEqual([
      'Loaded Photo / Loaded Photo',
      'Loaded Photo / Displayed Photo',
      'Dialog / Opened Unsupported File Dialog',
      'Demo / Ran Demo',
      'Page / Page Hidden',
      'Opened URL / [Home Page] Opened URL for Show in Google Maps',
      'User Setting / Loaded User Setting',
      'User Setting / Changed User Setting',
      'App Layout / App Layout',
      'Environment / App Integration Mode',
      'Page / Page Loaded',
    ]);
  });

  it('sends where the visitor came from and what they view the app with, once per page load', () => {
    const loaded = sent().find((event) => event.action === 'Page Loaded');
    expect(loaded?.label).toMatchObject({
      language: navigator.language,
      screen: expect.stringMatching(/^\d+x\d+$/),
      viewport: expect.stringMatching(/^\d+x\d+$/),
    });
  });

  it('sends a photo load as one event, with the names of its EXIF fields and not their values', () => {
    expect(sent()[0].label).toEqual({
      extension: 'jpg',
      mimeType: 'image/jpeg',
      fileBytes: 4790000,
      isFileLoaded: true,
      isExifAvailable: true,
      isLatLngAvailable: true,
      exifResult: 'found',
      exifError: undefined,
      exifFieldCount: 4,
      exifFields: ['ApertureValue', 'Make', 'latitude', 'longitude'],
      exifMs: 35,
      isReload: false,
      isDemo: false,
    });
  });

  it('sends how the photo was shown, with the HEIF conversion apart', () => {
    expect(sent()[1].label).toEqual({
      result: 'displayed',
      width: 4032,
      height: 3024,
      isHeif: true,
      heifResult: 'converted',
      heifError: undefined,
      heifDecodeMs: 650,
      loadMs: 812,
      isReload: false,
      isDemo: true,
    });
  });

  it('sends a photo that could not be shown as failed', () => {
    jest.clearAllMocks();
    trackDisplayedPhoto({ dimensions: null, loadMs: 100, isReload: false, isDemo: false });
    expect(sent()[0].label).toMatchObject({ result: 'failed', isHeif: false, width: undefined });
  });

  it('sends where a URL was opened from, and what for, as GA4 parameters', () => {
    const opened = sent().find((event) => event.category === 'Opened URL');
    expect(opened?.ga4Params).toEqual({ from: 'Home Page', url_description: 'Show in Google Maps' });
  });
});
