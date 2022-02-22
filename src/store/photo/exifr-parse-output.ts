/**
 * Output of exifr.parse function.
 * The member names are copied from the actual output.
 * The member types are guessed from the output.
 */
export interface ExifrParseOutput {
  ApertureValue: number;
  BlueMatrixColumn: Uint8Array;
  BlueTRC: Uint8Array;
  BrightnessValue: number;
  ChromaticAdaptation: Uint8Array;
  ColorSpace: number;
  ColorSpaceData: string;
  ComponentsConfiguration: Uint8Array;
  CreateDate: Date;
  DateTimeOriginal: Date;
  DeviceManufacturer: string;
  DeviceModel: any; // undefined in an actual file
  ExifImageHeight: number;
  ExifImageWidth: number;
  ExifVersion: string;
  ExposureCompensation: number;
  ExposureMode: string;
  ExposureProgram: string;
  ExposureTime: number;
  FNumber: number;
  Flash: string;
  FlashpixVersion: string;
  FocalLength: number;
  FocalLengthIn35mmFormat: number;
  GPSAltitude: number;
  GPSAltitudeRef: Uint8Array;
  GPSDateStamp: string;
  GPSDestBearing: number;
  GPSDestBearingRef: string;
  GPSHPositioningError: number;
  GPSImgDirection: number;
  GPSImgDirectionRef: string;
  GPSLatitude: number[];
  GPSLatitudeRef: string;
  GPSLongitude: number[];
  GPSLongitudeRef: string;
  GPSSpeed: number;
  GPSSpeedRef: string;
  GPSTimeStamp: string;
  GreenMatrixColumn: Uint8Array;
  GreenTRC: Uint8Array;
  ISO: number;
  LensInfo: number[];
  LensMake: string;
  LensModel: string;
  Make: string;
  MediaWhitePoint: Uint8Array;
  MeteringMode: string;
  Model: string;
  ModifyDate: Date;
  Orientation: string;
  PrimaryPlatform: string;
  ProfileCMMType: string;
  ProfileClass: string;
  ProfileConnectionSpace: string;
  ProfileCopyright: string;
  ProfileCreator: string;
  ProfileDateTime: Date;
  ProfileDescription: string;
  ProfileFileSignature: string;
  ProfileVersion: string;
  RedMatrixColumn: Uint8Array;
  RedTRC: Uint8Array;
  RenderingIntent: string;
  ResolutionUnit: string;
  SceneCaptureType: string;
  SceneType: string;
  SensingMethod: string;
  ShutterSpeedValue: number;
  Software: string;
  SubSecTimeDigitized: string;
  SubSecTimeOriginal: string;
  SubjectArea: Uint16Array;
  WhiteBalance: string;
  XResolution: number;
  YCbCrPositioning: number;
  YResolution: number;
  latitude: number;
  longitude: number;
  makerNote: Uint8Array;
}
