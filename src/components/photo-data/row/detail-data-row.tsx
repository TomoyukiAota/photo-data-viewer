import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { formatArray } from '../../../utils/format-array';
import { formatDate } from '../../../utils/format-date';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';

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
  } else {
    // For any other types (notably Uint8Array, Uint16Array and object),
    // they are converted to string by calling toString().
    // This is to ensure that string is returned, otherwise the app crashes (e.g. Regions object from IMG_2273.JPG causes crash.)
    formattedValue = input?.toString?.() ?? '';
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

  const nameAndValues: NameAndValue[] = Object.entries(exifrOutput).map(
    ([key, value]) => {
      return {
        name: key,
        value: formatValue(value),
      };
    }
  );

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
