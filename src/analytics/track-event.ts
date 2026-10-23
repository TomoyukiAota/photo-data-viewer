import { AppIntegration } from '../app-integration/app-integration';
import { LoadedPhotoData } from '../context/photo/loaded-photo-data';
import { PhotoDimensions } from '../context/photo-dimensions/photo-dimensions-type';
import * as ga4 from './ga4';

export function trackLoadedPhotoData(data: LoadedPhotoData) {
  const extension = data.file?.filenameExtension.toLowerCase() ?? 'N/A (something went wrong)';
  ga4.event('Loaded Photo', 'Loaded Photo', `Filename Extension: ${extension}`);
  ga4.event('Loaded Photo', 'Loaded Photo', `isFileLoaded: ${data.isFileLoaded}`);
  ga4.event('Loaded Photo', 'Loaded Photo', `isExifAvailable: ${data.isExifAvailable}`);
  ga4.event('Loaded Photo', 'Loaded Photo', `isLatLngAvailable: ${data.isLatLngAvailable}`);
  ga4.event('Loaded Photo', 'Loaded Photo', `File Size: ${data.file?.size?.displayString}`);
  ga4.event('Loaded Photo', 'Loaded Photo', `MIME Type: ${data.file?.mimeType}`);
}

export function trackPhotoDimensions(dimensions: PhotoDimensions | null) {
  if (!dimensions) return;
  ga4.event('Loaded Photo', 'Loaded Photo', `Image Width: ${dimensions?.width}`);
  ga4.event('Loaded Photo', 'Loaded Photo', `Image Height: ${dimensions?.height}`);
}

export function trackOpenUrl(url: string, urlDescription: string, from: string) {
  ga4.event(`Opened URL`, `[${from}] Opened URL for ${urlDescription}`, url);
}

export function trackLoadedUserSetting(key: string, value: string) {
  ga4.event('User Setting', 'Loaded User Setting', `${key}: ${value}`);
}

export function trackChangedUserSetting(key: string, value: string) {
  ga4.event('User Setting', 'Changed User Setting', `${key}: ${value}`);
}

export function trackChangedAppLayout(key: string, value: string) {
  ga4.event('App Layout', 'App Layout', `${key}: ${value}`);
}

export function trackAppIntegrationMode() {
  ga4.event('Environment', 'App Integration Mode', AppIntegration.mode);
}
