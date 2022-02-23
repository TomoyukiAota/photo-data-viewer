import { getExtension } from '../utils/filename-extension';
import * as gtag from './gtag';

export function trackPhotoSelectedEvent(file: File) {
  const extension = getExtension(file.name)?.toLowerCase() ?? 'No_Extension';
  gtag.event('Selected Photo', 'Selected Photo', `Filename Extension: ${extension}`);
}
