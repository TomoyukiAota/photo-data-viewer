import { ExifrParseOutput } from './exifr-parse-output';

export class LoadedPhotoFileData {

}

export class LoadedPhotoExifData {
  public latitude?: number;
  public longitude?: number;
}

export class LoadedPhotoData {
  public file?: LoadedPhotoFileData | null;
  public exif?: LoadedPhotoExifData | null;
}

function createLoadedPhotoFileData(file: File): LoadedPhotoFileData | null {
  return null;
}

function createLoadedPhotoExifData(exifrParseOutput: ExifrParseOutput): LoadedPhotoExifData | null {
  if (!exifrParseOutput)
    return null;

  const exifData = new LoadedPhotoExifData();
  exifData.latitude = exifrParseOutput.latitude;
  exifData.longitude = exifrParseOutput.longitude;
  return exifData;
}

export function createLoadedPhotoData(file: File, exifrParseOutput: ExifrParseOutput) {
  const data = new LoadedPhotoData();
  data.file = createLoadedPhotoFileData(file);
  data.exif = createLoadedPhotoExifData(exifrParseOutput);
  return data;
}
