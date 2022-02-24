import filesize from 'filesize';
import isNumber from 'is-number';
import { getExtension } from '../../utils/filename-extension';
import { formatDate } from '../../utils/format-date';

export class LastModified {
  public readonly displayString: string;

  constructor(lastModified: number) {
    this.displayString = formatDate(lastModified);
  }
}

export class FileSize {
  public readonly displayString: string;

  constructor(public byte: number) {
    this.displayString = isNumber(byte) ? filesize(byte) : '';
  }
}

export class LoadedPhotoFileData {
  public lastModified?: LastModified;
  public name?: string;
  public size?: FileSize;
  public mimeType?: string; // e.g. "image/jpeg"
  public get filenameExtension(): string { return getExtension(this.name); }
}

export function createLoadedPhotoFileData(file: File): LoadedPhotoFileData | null {
  if (!file) { return null; }

  const fileData = new LoadedPhotoFileData();
  const { lastModified, name, size, type } = file;
  fileData.lastModified = new LastModified(lastModified);
  fileData.name = name;
  fileData.size = new FileSize(size);
  fileData.mimeType = type;
  return fileData;
}
