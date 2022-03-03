export class FilenameExtension {
  private static readonly jpegExtensions: ReadonlyArray<string> = ['jpeg', 'jpg', 'jpe', 'jfif', 'jfi', 'jif'];
  private static readonly tiffExtensions: ReadonlyArray<string> = ['tiff', 'tif'];
  private static readonly pngExtensions: ReadonlyArray<string> = ['png'];
  private static readonly heifExtensions: ReadonlyArray<string> = ['heif', 'heic'];
  private static readonly webpExtensions: ReadonlyArray<string> = ['webp'];
  private static readonly movExtensions: ReadonlyArray<string> = ['mov'];

  public static isJpeg(extension: string) { return this.jpegExtensions.includes(extension.toLowerCase()); }
  public static isTiff(extension: string) { return this.tiffExtensions.includes(extension.toLowerCase()); }
  public static isPng(extension: string) { return this.pngExtensions.includes(extension.toLowerCase()); }
  public static isHeif(extension: string) { return this.heifExtensions.includes(extension.toLowerCase()); }
  public static isWebp(extension: string) { return this.webpExtensions.includes(extension.toLowerCase()); }
  public static isMov(extension: string) { return this.movExtensions.includes(extension.toLowerCase()); }
}

export function getExtension(filename?: string): string {
  if (filename?.includes?.('.')) {
    const extension = filename.split?.('.')?.pop?.();
    return extension ?? '';
  } else {
    return '';
  }
}

export function isHeif(filename: string) {
  const extension = getExtension(filename);
  return FilenameExtension.isHeif(extension);
}
