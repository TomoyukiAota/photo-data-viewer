import sortKeys from 'sort-keys';
import isNumber from 'is-number';
import { formatDate } from '../utils/format-date';
import { ExifrParseOutput } from './exifr-parse-output';

export class DateTimeOriginal {
  public readonly displayString: string;

  constructor(date: Date) {
    this.displayString = formatDate(date);
  }
}

export class LoadedPhotoExifData {
  public exifrParseOutput?: ExifrParseOutput;
  public width?: number;
  public height?: number;
  public latitude?: number;
  public longitude?: number;
  public dateTimeOriginal?: DateTimeOriginal;
  public get isLatLngAvailable(): boolean { return isNumber(this.latitude) && isNumber(this.longitude); }
}

export function createLoadedPhotoExifData(exifrParseOutput: ExifrParseOutput): LoadedPhotoExifData | null {
  if (!exifrParseOutput)
    return null;

  const exifData = new LoadedPhotoExifData();
  exifData.exifrParseOutput = sortKeys(exifrParseOutput);
  exifData.width = exifrParseOutput.ExifImageWidth;
  exifData.height = exifrParseOutput.ExifImageHeight;
  exifData.latitude = exifrParseOutput.latitude;
  exifData.longitude = exifrParseOutput.longitude;
  exifData.dateTimeOriginal = new DateTimeOriginal(exifrParseOutput.DateTimeOriginal);
  return exifData;
}
