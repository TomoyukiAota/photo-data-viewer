import { getExtension } from '../utils/filename-extension';
import * as gtag from './gtag';

export function trackPhotoSelectedEvent(file: File) {
  const extension = getExtension(file.name)?.toLowerCase() ?? 'No_Extension';
  gtag.event('Selected Photo', 'Selected Photo', `Filename Extension: ${extension}`);
}

export function trackOpenUrl(url: string, urlDescription: string, from: string) {
  gtag.event(`Opened URL`, `[${from}] Opened URL for ${urlDescription}`, url);
}

export function trackLoadedUserSetting(key: string, value: string) {
  gtag.event('Loaded User Settings', 'Loaded User Settings', `${key}: ${value}`);
}
