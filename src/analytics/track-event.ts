import { AppIntegration } from '../app-integration/app-integration';
import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { PhotoDimensions } from '../context/photo-dimensions/photo-dimensions-type';
import { trackEvent } from './analytics';
import { Ga4EventName } from './ga4-event-name';

function trackLoadedPhoto(label: string) {
  trackEvent({ category: 'Loaded Photo', action: 'Loaded Photo', label, ga4Name: Ga4EventName.LoadedPhoto });
}

export function trackLoadedPhotoData(data: LoadedPhotoData) {
  const extension = data.file?.filenameExtension.toLowerCase() ?? 'N/A (something went wrong)';
  trackLoadedPhoto(`Filename Extension: ${extension}`);
  trackLoadedPhoto(`isFileLoaded: ${data.isFileLoaded}`);
  trackLoadedPhoto(`isExifAvailable: ${data.isExifAvailable}`);
  trackLoadedPhoto(`isLatLngAvailable: ${data.isLatLngAvailable}`);
  trackLoadedPhoto(`File Size: ${data.file?.size?.displayString}`);
  trackLoadedPhoto(`MIME Type: ${data.file?.mimeType}`);
}

export function trackPhotoDimensions(dimensions: PhotoDimensions | null) {
  if (!dimensions) return;
  trackLoadedPhoto(`Image Width: ${dimensions?.width}`);
  trackLoadedPhoto(`Image Height: ${dimensions?.height}`);
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
