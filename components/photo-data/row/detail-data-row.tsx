import { LoadedPhotoData } from '../../../store/loaded-photo-data';
import { formatDate } from '../../../utils/format-date';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';

type TempNameAndValue = NameAndValue | { name: string; value: undefined };

export function createDetailDataRows(
  loadedPhotoData: LoadedPhotoData | null
): NameValueGridRow[] {
  const exifrOutput = loadedPhotoData?.exif?.exifrParseOutput;

  const nameAndValues: TempNameAndValue[] = [
    {
      name: 'ApertureValue',
      value: exifrOutput?.ApertureValue,
    },
    {
      name: 'BrightnessValue',
      value: exifrOutput?.BrightnessValue,
    },
    {
      name: 'ColorSpace',
      value: exifrOutput?.ColorSpace,
    },
    {
      name: 'ColorSpaceData',
      value: exifrOutput?.ColorSpaceData,
    },
    {
      name: 'CreateDate',
      value: formatDate(exifrOutput?.CreateDate),
    },
    {
      name: 'DateTimeOriginal',
      value: formatDate(exifrOutput?.DateTimeOriginal),
    },
    {
      name: 'DeviceManufacturer',
      value: exifrOutput?.DeviceManufacturer,
    },
    {
      name: 'ExifImageHeight',
      value: exifrOutput?.ExifImageHeight,
    },
    {
      name: 'ExifImageWidth',
      value: exifrOutput?.ExifImageWidth,
    },
    {
      name: 'ExifVersion',
      value: exifrOutput?.ExifVersion,
    },
    {
      name: 'ExposureCompensation',
      value: exifrOutput?.ExposureCompensation,
    },
    {
      name: 'ExposureMode',
      value: exifrOutput?.ExposureMode,
    },
    {
      name: 'ExposureProgram',
      value: exifrOutput?.ExposureProgram,
    },
    {
      name: 'ExposureTime',
      value: exifrOutput?.ExposureTime,
    },
    {
      name: 'FNumber',
      value: exifrOutput?.FNumber,
    },
    {
      name: 'Flash',
      value: exifrOutput?.Flash,
    },
    {
      name: 'FlashpixVersion',
      value: exifrOutput?.FlashpixVersion,
    },
    {
      name: 'FocalLength',
      value: exifrOutput?.FocalLength,
    },
    {
      name: 'FocalLengthIn35mmFormat',
      value: exifrOutput?.FocalLengthIn35mmFormat,
    },
    {
      name: 'GPSAltitude',
      value: exifrOutput?.GPSAltitude,
    },
    {
      name: 'GPSDateStamp',
      value: exifrOutput?.GPSDateStamp,
    },
  ];

  const detailDataRows: NameValueGridRow[] = nameAndValues.map(
    (nameAndValue, index) => {
      return {
        id: index,
        parentId: null,
        name: nameAndValue.name,
        value: nameAndValue.value ?? '',
      };
    }
  );

  return detailDataRows;
}
