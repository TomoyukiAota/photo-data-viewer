import exifr from 'exifr';
import isNumber from 'is-number';
import sortKeys from 'sort-keys';
import { formatDate } from '../../utils/format-date';
import { ExifrParseOutput } from './exifr-parse-output';

export class DateTimeOriginal {
  public readonly displayString: string;

  constructor(date: Date) {
    this.displayString = formatDate(date);
  }
}

export class LoadedPhotoExifData {
  public exifrParseOutput?: ExifrParseOutput;
  public latitude?: number;
  public longitude?: number;
  public dateTimeOriginal?: DateTimeOriginal;
  public get isLatLngAvailable(): boolean { return isNumber(this.latitude) && isNumber(this.longitude); }
}

// Throws what exifr.parse throws, so that createLoadedPhotoData records why the
// EXIF data could not be read.
export async function createLoadedPhotoExifData(file: File): Promise<LoadedPhotoExifData | null> {
  if (!file) { return null; }

  const exifrParseOutput: ExifrParseOutput | null = await exifr.parse(file, true);
  console.log(`exifr.parse returned exifrParseOutput: `, exifrParseOutput);

  if (!exifrParseOutput) { return null; }

  const exifData = new LoadedPhotoExifData();
  exifData.exifrParseOutput = sortKeys(exifrParseOutput);
  exifData.latitude = exifrParseOutput.latitude;
  exifData.longitude = exifrParseOutput.longitude;
  exifData.dateTimeOriginal = new DateTimeOriginal(exifrParseOutput.DateTimeOriginal);
  return exifData;
}
