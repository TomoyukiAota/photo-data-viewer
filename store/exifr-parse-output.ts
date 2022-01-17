/**
 * Output of exifr.parse function.
 * The member names are copied from the actual output.
 * The member types are guessed from the output.
 */
export interface ExifrParseOutput {
  ApertureValue: number;
  BrightnessValue: number;
  ColorSpace: number;
  ComponentsConfiguration: Uint8Array;
  CreateDate: Date,
  DateTimeOriginal: Date,
  ExifImageHeight: number;
  ExifImageWidth: number;
  ExifVersion: string;
  ExposureCompensation: number;
  ExposureMode: string;
  ExposureProgram: string;
  ExposureTime: number
  FNumber: number
  Flash: string;
  FlashpixVersion: number;
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
  GPSLongitude: number[]
  GPSLongitudeRef: string;
  GPSSpeed: number;
  GPSSpeedRef: string;
  GPSTimeStamp: string;
  ISO: number;
  LensInfo: number[];
  LensMake: string;
  LensModel: string;
  Make: string;
  MeteringMode: string;
  Model: string;
  ModifyDate: Date;
  Orientation: string;
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
}
