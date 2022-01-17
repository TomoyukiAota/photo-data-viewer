import { ExifrParseOutput } from './exifr-parse-output';

export class LoadedPhotoData {
  public latitude: number = 0;
  public longitude: number = 0;
}

export function createLoadedPhotoData(exifrParseOutput: ExifrParseOutput) {
  if (!exifrParseOutput)
    return null;

  const data = new LoadedPhotoData();
  data.latitude = exifrParseOutput.latitude;
  data.longitude = exifrParseOutput.longitude;
  return data;
}
