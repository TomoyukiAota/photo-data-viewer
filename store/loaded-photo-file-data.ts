import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import filesize from 'filesize';

dayjs.extend(localizedFormat);

export class LastModified {
  private readonly lastModified: ReturnType<typeof dayjs>;
  public readonly localizedFormat: string;

  constructor(lastModified: number) {
    this.lastModified = dayjs(lastModified);
    this.localizedFormat = this.lastModified.format('LLLL');
  }
}

export class FileSize {
  public readonly displayString: string;

  constructor(public byte: number) {
    this.displayString = filesize(this.byte);
  }
}

export class LoadedPhotoFileData {
  public lastModified?: LastModified;
  public name?: string;
  public size?: FileSize;
  public mimeType?: string; // e.g. "image/jpeg"
}

export function createLoadedPhotoFileData(file: File): LoadedPhotoFileData | null {
  const fileData = new LoadedPhotoFileData();
  fileData.lastModified = new LastModified(file.lastModified);
  fileData.name = file.name;
  fileData.size = new FileSize(file.size);
  fileData.mimeType = file.type;
  return fileData;
}
