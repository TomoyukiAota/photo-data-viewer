import exifr from 'exifr';
import { ExifrParseOutput } from './exifr-parse-output';
import { createLoadedPhotoExifData, LoadedPhotoExifData } from './loaded-photo-exif-data';
import { createLoadedPhotoFileData, LoadedPhotoFileData } from './loaded-photo-file-data';

export class LoadedPhotoData {
  public file?: LoadedPhotoFileData | null;
  public exif?: LoadedPhotoExifData | null;
  public get isFileLoaded(): boolean { return !!this.file; }
  public get isLatLngAvailable(): boolean { return !!this.exif?.isLatLngAvailable }
}

export async function createLoadedPhotoData(file: File) {
  const data = new LoadedPhotoData();
  data.file = createLoadedPhotoFileData(file);

  let exifrParseOutput: ExifrParseOutput | null = null;
  try {
    exifrParseOutput = await exifr.parse(file, true);
  } catch (error) {
    console.log('Error occured during exifr.parse: ', error);
  }

  console.log(`exifrParseOutput`, exifrParseOutput);
  data.exif = createLoadedPhotoExifData(exifrParseOutput);
  return data;
}
