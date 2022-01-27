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
