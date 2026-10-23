import { AppIntegration } from '../app-integration/app-integration';
import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { PhotoDimensions } from '../context/photo-dimensions/photo-dimensions-type';
import { trackEvent } from './analytics';

export function trackLoadedPhotoData(data: LoadedPhotoData) {
  const extension = data.file?.filenameExtension.toLowerCase() ?? 'N/A (something went wrong)';
  trackEvent('Loaded Photo', 'Loaded Photo', `Filename Extension: ${extension}`);
  trackEvent('Loaded Photo', 'Loaded Photo', `isFileLoaded: ${data.isFileLoaded}`);
  trackEvent('Loaded Photo', 'Loaded Photo', `isExifAvailable: ${data.isExifAvailable}`);
  trackEvent('Loaded Photo', 'Loaded Photo', `isLatLngAvailable: ${data.isLatLngAvailable}`);
  trackEvent('Loaded Photo', 'Loaded Photo', `File Size: ${data.file?.size?.displayString}`);
  trackEvent('Loaded Photo', 'Loaded Photo', `MIME Type: ${data.file?.mimeType}`);
}

export function trackPhotoDimensions(dimensions: PhotoDimensions | null) {
  if (!dimensions) return;
  trackEvent('Loaded Photo', 'Loaded Photo', `Image Width: ${dimensions?.width}`);
  trackEvent('Loaded Photo', 'Loaded Photo', `Image Height: ${dimensions?.height}`);
}

export function trackOpenUrl(url: string, urlDescription: string, from: string) {
  trackEvent(`Opened URL`, `[${from}] Opened URL for ${urlDescription}`, url);
}

export function trackLoadedUserSetting(key: string, value: string) {
  trackEvent('User Setting', 'Loaded User Setting', `${key}: ${value}`);
}

export function trackChangedUserSetting(key: string, value: string) {
  trackEvent('User Setting', 'Changed User Setting', `${key}: ${value}`);
}

export function trackChangedAppLayout(key: string, value: string) {
  trackEvent('App Layout', 'App Layout', `${key}: ${value}`);
}

export function trackAppIntegrationMode() {
  trackEvent('Environment', 'App Integration Mode', AppIntegration.mode);
}
