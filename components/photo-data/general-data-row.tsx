import { LoadedPhotoData } from '../../store/loaded-photo-data';
import LatLngRow from './LatLngRow';
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
    // TODO: Add Image Dimensions
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

  const generalDataRows = nameAndValues.map((nameAndValue, index) => {
    return {
      id: index,
      parentId: null,
      ...nameAndValue,
    };
  });

  return generalDataRows;
}
