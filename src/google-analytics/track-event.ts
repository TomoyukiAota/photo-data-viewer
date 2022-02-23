import * as gtag from './gtag';
import { LoadedPhotoData } from '../store/photo/loaded-photo-data';

export function trackLoadedPhotoData(data: LoadedPhotoData) {
  const extension = data.filenameExtension?.toLowerCase() ?? 'No_Extension';
  gtag.event('Loaded Photo', 'Loaded Photo', `Filename Extension: ${extension}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `isFileLoaded: ${data.isFileLoaded}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `isExifAvailable: ${data.isExifAvailable}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `isLatLngAvailable: ${data.isLatLngAvailable}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `File Size: ${data.file?.size?.displayString}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `MIME Type: ${data.file?.mimeType}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `Image Width: ${data.exif?.width}`);
  gtag.event('Loaded Photo', 'Loaded Photo', `Image Height: ${data.exif?.height}`);
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