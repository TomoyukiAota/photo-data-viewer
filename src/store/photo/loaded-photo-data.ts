import { createLoadedPhotoExifData, LoadedPhotoExifData } from './loaded-photo-exif-data';
import { createLoadedPhotoFileData, LoadedPhotoFileData } from './loaded-photo-file-data';

export class LoadedPhotoData {
  public file?: LoadedPhotoFileData | null;
  public exif?: LoadedPhotoExifData | null;
  public get isFileLoaded(): boolean { return !!this.file; }
  public get isExifAvailable(): boolean { return !!this.exif; }
  public get isLatLngAvailable(): boolean { return !!this.exif?.isLatLngAvailable }
}

export async function createLoadedPhotoData(file: File) {
  const data = new LoadedPhotoData();
  data.file = createLoadedPhotoFileData(file);
  data.exif = await createLoadedPhotoExifData(file);
  return data;
}
