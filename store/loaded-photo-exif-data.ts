import dayjs from 'dayjs';
import { ExifrParseOutput } from './exifr-parse-output';

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
  public width?: number;
  public height?: number;
  public latitude?: number;
  public longitude?: number;
  public dateTimeOriginal?: DateTimeOriginal;
}

export function createLoadedPhotoExifData(exifrParseOutput: ExifrParseOutput): LoadedPhotoExifData | null {
  if (!exifrParseOutput)
    return null;

  const exifData = new LoadedPhotoExifData();
  exifData.exifrParseOutput = exifrParseOutput;
  exifData.width = exifrParseOutput.ExifImageWidth;
  exifData.height = exifrParseOutput.ExifImageHeight;
  exifData.latitude = exifrParseOutput.latitude;
  exifData.longitude = exifrParseOutput.longitude;
  exifData.dateTimeOriginal = new DateTimeOriginal(exifrParseOutput.DateTimeOriginal);
  return exifData;
}
