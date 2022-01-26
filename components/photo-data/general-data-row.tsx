import LatLngRow from './LatLngRow';
import { LoadedPhotoData } from '../../store/loaded-photo-data';
import { GridRow } from './grid-row';

interface GeneralDataRow extends GridRow {
  name: string;
  value: string | JSX.Element;
}

export function createGeneralDataRows(
  loadedPhotoData: LoadedPhotoData | null
): GeneralDataRow[] {
  return [
    {
      id: 0,
      parentId: null,
      name: 'File Name',
      value: loadedPhotoData?.file?.name ?? '',
    },
    {
      id: 1,
      parentId: null,
      name: 'File Size',
      value: loadedPhotoData?.file?.size?.displayString ?? '',
    },
    {
      id: 2,
      parentId: null,
      name: 'Last Modified',
      value: loadedPhotoData?.file?.lastModified?.localizedFormat ?? '',
    },
    {
      id: 3,
      parentId: null,
      name: 'Date Taken',
      value: loadedPhotoData?.exif?.dateTimeOriginal?.localizedFormat ?? '',
    },
    // TODO: Add Image Dimensions
    {
      id: 4,
      parentId: null,
      name: 'Latitude, Longitude',
      value: (
        <LatLngRow
          latitude={loadedPhotoData?.exif?.latitude}
          longitude={loadedPhotoData?.exif?.longitude}
        />
      ),
    },
  ];
}
