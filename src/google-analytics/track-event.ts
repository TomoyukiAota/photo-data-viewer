import { AppIntegration } from '../app-integration/app-integration';
import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { PhotoDimensions } from '../context/photo-dimensions/photo-dimensions-type';
import * as gtag from './gtag';

export function trackLoadedPhotoData(data: LoadedPhotoData) {
  const extension = data.file?.filenameExtension.toLowerCase() ?? 'N/A (something went wrong)';
  gtag.event('Loaded Photo', 'Loaded Photo', `Filename Extension: ${extension}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `isFileLoaded: ${data.isFileLoaded}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `isExifAvailable: ${data.isExifAvailable}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `isLatLngAvailable: ${data.isLatLngAvailable}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `File Size: ${data.file?.size?.displayString}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `MIME Type: ${data.file?.mimeType}`);
}

export function trackPhotoDimensions(dimensions: PhotoDimensions | null) {
  if (!dimensions) return;
  gtag.event('Loaded Photo', 'Loaded Photo', `Image Width: ${dimensions?.width}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `Image Height: ${dimensions?.height}`);
}

export function trackOpenUrl(url: string, urlDescription: string, from: string) {
  gtag.event(`Opened URL`, `[${from}] Opened URL for ${urlDescription}`, url);
}

export function trackLoadedUserSetting(key: string, value: string) {
  gtag.event('User Setting', 'Loaded User Setting', `${key}: ${value}`);
}

export function trackChangedUserSetting(key: string, value: string) {
  gtag.event('User Setting', 'Changed User Setting', `${key}: ${value}`);
}

export function trackChangedAppLayout(key: string, value: string) {
  gtag.event('App Layout', 'App Layout', `${key}: ${value}`);
}

export function trackAppIntegrationMode() {
  gtag.event('Environment', 'App Integration Mode', AppIntegration.mode);
}
