import sortKeys from 'sort-keys';
import { LoadedPhotoData } from '../../../store/loaded-photo-data';
import { formatArray } from '../../../utils/format-array';
import { formatDate } from '../../../utils/format-date';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';

export function createDetailDataRows(
  loadedPhotoData: LoadedPhotoData | null
): NameValueGridRow[] {
  const exifrOutput = loadedPhotoData?.exif?.exifrParseOutput;

  if (!exifrOutput) {
    return [];
  }

  const sortedExifrOutput = sortKeys(exifrOutput);
  const nameAndValues: NameAndValue[] = Object.entries(sortedExifrOutput)
    .filter(([key, value]) => {
      if (value instanceof Uint8Array) {
        return false;
      }
      return true;
    })
    .map(([key, value]) => {
      let processedValue = '';

      if (typeof value === 'string') {
        processedValue = value;
      } else if (typeof value === 'number') {
        processedValue = value.toString();
      } else if (value instanceof Date) {
        processedValue = formatDate(value);
      } else if (value instanceof Array) {
        processedValue = formatArray(value);
      } else if (value instanceof Uint8Array) {
        processedValue = '';
      } else {
        processedValue = value;
      }

      return {
        name: key,
        value: processedValue,
      };
    });

  const detailDataRows: NameValueGridRow[] = nameAndValues.map(
    (nameAndValue, index) => {
      return {
        id: index,
        parentId: null,
        name: nameAndValue.name,
        value: nameAndValue.value,
      };
    }
  );

  return detailDataRows;
}
