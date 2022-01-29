import sortKeys from 'sort-keys';
import { LoadedPhotoData } from '../../../store/loaded-photo-data';
import { formatArray } from '../../../utils/format-array';
import { formatDate } from '../../../utils/format-date';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';

function shouldIncludeProperty(key: string, value: any): boolean {
  if (value instanceof Uint8Array) {
    return false;
  }
  return true;
}

function formatValue(input: any): string {
  let formattedValue = '';

  if (typeof input === 'string') {
    formattedValue = input;
  } else if (typeof input === 'number') {
    formattedValue = input.toString();
  } else if (input instanceof Date) {
    formattedValue = formatDate(input);
  } else if (input instanceof Array) {
    formattedValue = formatArray(input);
  } else if (input instanceof Uint8Array) {
    formattedValue = '';
  } else {
    formattedValue = input;
  }

  return formattedValue;
}

export function createDetailDataRows(
  loadedPhotoData: LoadedPhotoData | null
): NameValueGridRow[] {
  const exifrOutput = loadedPhotoData?.exif?.exifrParseOutput;

  if (!exifrOutput) {
    return [];
  }

  const sortedExifrOutput = sortKeys(exifrOutput);
  const nameAndValues: NameAndValue[] = Object.entries(sortedExifrOutput)
    .filter(([key, value]) => shouldIncludeProperty(key, value))
    .map(([key, value]) => {
      return {
        name: key,
        value: formatValue(value),
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
