import { AppIntegration } from '../app-integration/app-integration';
import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { PhotoDimensions } from '../context/photo-dimensions/photo-dimensions-type';
import { trackEvent } from './analytics';
import { Ga4EventName } from './ga4-event-name';

export interface PhotoLoadDetails {
  /** How long reading the EXIF data took. */
  exifMs: number;
  /** Loaded again after a setting changed, rather than chosen. */
  isReload: boolean;
  /** Loaded by the demo, which is the same photo every time. */
  isDemo: boolean;
}

// One event when a photo's file and EXIF data are read, with the details as fields.
// It replaced one event per detail, a shape that only existed because GA4 cannot
// hold structure.
export function trackLoadedPhoto(data: LoadedPhotoData, details: PhotoLoadDetails) {
  const exifFields = data.exifFields;
  trackEvent({
    category: 'Loaded Photo',
    action: 'Loaded Photo',
    label: {
      extension: data.file?.filenameExtension.toLowerCase() ?? 'N/A (something went wrong)',
      mimeType: data.file?.mimeType,
      fileBytes: data.file?.size?.byte,
      isFileLoaded: data.isFileLoaded,
      isExifAvailable: data.isExifAvailable,
      isLatLngAvailable: data.isLatLngAvailable,
      exifResult: data.exifResult,
      exifError: data.exifError,
      exifFieldCount: exifFields.length,
      exifFields,
      exifMs: Math.round(details.exifMs),
      isReload: details.isReload,
      isDemo: details.isDemo,
    },
    ga4Name: Ga4EventName.LoadedPhoto,
  });
}

export interface PhotoDisplayDetails extends Omit<PhotoLoadDetails, 'exifMs'> {
  dimensions: PhotoDimensions | null;
  /** From reading the file to the image loaded, without the wait the app makes on purpose before it. */
  loadMs: number;
  /** For a HEIF file, which browsers cannot show: how its conversion to JPEG went. */
  heif?: { result: 'converted' | 'failed'; error?: string; decodeMs: number };
}

// One event when the photo is shown, or cannot be.
export function trackDisplayedPhoto(details: PhotoDisplayDetails) {
  trackEvent({
    category: 'Loaded Photo',
    action: 'Displayed Photo',
    label: {
      result: details.dimensions ? 'displayed' : 'failed',
      width: details.dimensions?.width,
      height: details.dimensions?.height,
      isHeif: !!details.heif,
      heifResult: details.heif?.result,
      heifError: details.heif?.error,
      heifDecodeMs: details.heif ? Math.round(details.heif.decodeMs) : undefined,
      loadMs: Math.round(details.loadMs),
      isReload: details.isReload,
      isDemo: details.isDemo,
    },
    ga4Name: Ga4EventName.DisplayedPhoto,
  });
}

export function trackOpenedUnsupportedFileDialog() {
  trackEvent({
    category: 'Dialog',
    action: 'Opened Unsupported File Dialog',
    ga4Name: Ga4EventName.OpenedUnsupportedFileDialog,
  });
}

export function trackRanDemo() {
  trackEvent({ category: 'Demo', action: 'Ran Demo', ga4Name: Ga4EventName.RanDemo });
}

export interface PageHiddenDetails {
  secondsSinceLoad: number;
  /** How long the page was visible since it was loaded, which time in a background tab is not. */
  visibleSeconds: number;
}

// Sent each time the page is hidden: switched away from, minimized or closed. The
// last one of a page load is how long it was used.
export function trackPageHidden(details: PageHiddenDetails) {
  trackEvent({
    category: 'Page',
    action: 'Page Hidden',
    label: {
      secondsSinceLoad: Math.round(details.secondsSinceLoad),
      visibleSeconds: Math.round(details.visibleSeconds),
    },
    ga4Name: Ga4EventName.PageHidden,
  });
}

export function trackOpenUrl(url: string, urlDescription: string, from: string) {
  trackEvent({
    category: 'Opened URL',
    action: `[${from}] Opened URL for ${urlDescription}`,
    label: url,
    ga4Name: Ga4EventName.OpenedUrl,
    ga4Params: { from, url_description: urlDescription },
  });
}

export function trackLoadedUserSetting(key: string, value: string) {
  trackEvent({
    category: 'User Setting',
    action: 'Loaded User Setting',
    label: `${key}: ${value}`,
    ga4Name: Ga4EventName.LoadedUserSetting,
  });
}

export function trackChangedUserSetting(key: string, value: string) {
  trackEvent({
    category: 'User Setting',
    action: 'Changed User Setting',
    label: `${key}: ${value}`,
    ga4Name: Ga4EventName.ChangedUserSetting,
  });
}

export function trackChangedAppLayout(key: string, value: string) {
  trackEvent({ category: 'App Layout', action: 'App Layout', label: `${key}: ${value}`, ga4Name: Ga4EventName.AppLayout });
}

export function trackAppIntegrationMode() {
  trackEvent({
    category: 'Environment',
    action: 'App Integration Mode',
    label: AppIntegration.mode,
    ga4Name: Ga4EventName.AppIntegrationMode,
  });
}
