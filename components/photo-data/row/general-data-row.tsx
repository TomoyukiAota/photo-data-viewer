import { LoadedPhotoData } from '../../../store/loaded-photo-data';
import LatLngRow from './LatLngRow';
import WidthHeightRow from './WidthHeightRow';
import { GridRow } from './grid-row';

interface NameAndValue {
  name: string;
  value: string | JSX.Element;
}

export interface GeneralDataRow extends GridRow, NameAndValue {}

export function createGeneralDataRows(
  loadedPhotoData: LoadedPhotoData | null
): GeneralDataRow[] {
  const nameAndValues: NameAndValue[] = [
    {
      name: 'File Name',
      value: loadedPhotoData?.file?.name ?? '',
    },
    {
      name: 'File Size',
      value: loadedPhotoData?.file?.size?.displayString ?? '',
    },
    {
      name: 'Last Modified',
      value: loadedPhotoData?.file?.lastModified?.localizedFormat ?? '',
    },
    {
      name: 'Date Taken',
      value: loadedPhotoData?.exif?.dateTimeOriginal?.localizedFormat ?? '',
    },
    {
      name: 'Width x Height',
      value: (
        <WidthHeightRow
          width={loadedPhotoData?.exif?.width}
          height={loadedPhotoData?.exif?.height}
        />
      ),
    },
    {
      name: 'Latitude, Longitude',
      value: (
        <LatLngRow
          latitude={loadedPhotoData?.exif?.latitude}
          longitude={loadedPhotoData?.exif?.longitude}
        />
      ),
    },
  ];

  const generalDataRows: GeneralDataRow[] = nameAndValues.map(
    (nameAndValue, index) => {
      return {
        id: index,
        parentId: null,
        ...nameAndValue,
      };
    }
  );

  return generalDataRows;
}
