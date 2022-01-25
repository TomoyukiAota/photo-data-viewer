import dayjs from 'dayjs';
import { ExifrParseOutput } from './exifr-parse-output';
import localizedFormat from 'dayjs/plugin/localizedFormat';

export class DateTimeOriginal {
  private readonly dateTimeOriginal: ReturnType<typeof dayjs>;
  public readonly localizedFormat: string;

  constructor(date: Date) {
    this.dateTimeOriginal = dayjs(date);
    this.localizedFormat = this.dateTimeOriginal.format('LLLL');
  }
}

export class LoadedPhotoExifData {
  public exifrParseOutput?: ExifrParseOutput;
  public latitude?: number;
  public longitude?: number;
  public dateTimeOriginal?: DateTimeOriginal;
}

export function createLoadedPhotoExifData(exifrParseOutput: ExifrParseOutput): LoadedPhotoExifData | null {
  if (!exifrParseOutput)
    return null;

  const exifData = new LoadedPhotoExifData();
  exifData.exifrParseOutput = exifrParseOutput;
  exifData.latitude = exifrParseOutput.latitude;
  exifData.longitude = exifrParseOutput.longitude;
  exifData.dateTimeOriginal = new DateTimeOriginal(exifrParseOutput.DateTimeOriginal);
  return exifData;
}
