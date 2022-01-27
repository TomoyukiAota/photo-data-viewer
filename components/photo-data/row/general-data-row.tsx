import { LoadedPhotoData } from '../../../store/loaded-photo-data';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';
import LatLngRow from './LatLngRow';
import WidthHeightRow from './WidthHeightRow';

type TempNameAndValue = NameAndValue | { name: string; value: undefined };

export function createGeneralDataRows(
  loadedPhotoData: LoadedPhotoData | null
): NameValueGridRow[] {
  const nameAndValues: TempNameAndValue[] = [
    {
      name: 'File Name',
      value: loadedPhotoData?.file?.name,
    },
    {
      name: 'File Size',
      value: loadedPhotoData?.file?.size?.displayString,
    },
    {
      name: 'Last Modified',
      value: loadedPhotoData?.file?.lastModified?.displayString,
    },
    {
      name: 'Date Taken',
      value: loadedPhotoData?.exif?.dateTimeOriginal?.displayString,
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

  const generalDataRows: NameValueGridRow[] = nameAndValues.map(
    (nameAndValue, index) => {
      return {
        id: index,
        parentId: null,
        name: nameAndValue.name,
        value: nameAndValue.value ?? '',
      };
    }
  );

  return generalDataRows;
}
