import { describeError } from '../../analytics/event-fields';
import { createLoadedPhotoExifData, LoadedPhotoExifData } from './loaded-photo-exif-data';
import { createLoadedPhotoFileData, LoadedPhotoFileData } from './loaded-photo-file-data';

export class LoadedPhotoData {
  public file?: LoadedPhotoFileData | null;
  public exif?: LoadedPhotoExifData | null;
  /** Why the EXIF data could not be read, when reading it threw. */
  public exifError?: string;
  public get isFileLoaded(): boolean { return !!this.file; }
  public get isExifAvailable(): boolean { return !!this.exif; }
  public get isLatLngAvailable(): boolean { return !!this.exif?.isLatLngAvailable }
  /** Whether EXIF data was found, the file has none, or reading it failed. */
  public get exifResult(): 'found' | 'none' | 'error' { return this.exif ? 'found' : this.exifError ? 'error' : 'none'; }
  /** The names of the EXIF fields the file has, never their values. */
  public get exifFields(): string[] { return Object.keys(this.exif?.exifrParseOutput ?? {}); }
}

export async function createLoadedPhotoData(file: File) {
  const data = new LoadedPhotoData();
  data.file = createLoadedPhotoFileData(file);
  try {
    data.exif = await createLoadedPhotoExifData(file);
  } catch (error) {
    console.log('Reading the EXIF data threw an error: ', error);
    data.exif = null;
    data.exifError = describeError(error);
  }
  return data;
}
