import { ExifrParseOutput } from './exifr-parse-output';
import { createLoadedPhotoExifData, LoadedPhotoExifData } from './loaded-photo-exif-data';
import { createLoadedPhotoFileData, LoadedPhotoFileData } from './loaded-photo-file-data';

export class LoadedPhotoData {
  public file?: LoadedPhotoFileData | null;
  public exif?: LoadedPhotoExifData | null;
}

export function createLoadedPhotoData(file: File, exifrParseOutput: ExifrParseOutput) {
  const data = new LoadedPhotoData();
  data.file = createLoadedPhotoFileData(file);
  data.exif = createLoadedPhotoExifData(exifrParseOutput);
  return data;
}
