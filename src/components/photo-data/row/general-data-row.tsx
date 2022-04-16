import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';
import GridRow from './GridRow';
import LatLngRow from './LatLngRow';
import WidthHeightRow from './WidthHeightRow';

type TempNameAndValue = NameAndValue | { name: string; value: undefined };

export function createGeneralDataRows(
  loadedPhotoData: LoadedPhotoData | null,
  fontSize: React.CSSProperties
): NameValueGridRow[] {
  const nameAndValues: TempNameAndValue[] = [
    {
      name: 'File Name',
      value: (
        <GridRow
          loadedPhotoData={loadedPhotoData}
          data={loadedPhotoData?.file?.name}
        />
      ),
    },
    {
      name: 'File Size',
      value: (
        <GridRow
          loadedPhotoData={loadedPhotoData}
          data={loadedPhotoData?.file?.size?.displayString}
        />
      ),
    },
    {
      name: 'Width x Height',
      value: <WidthHeightRow />,
    },
    {
      name: 'Date Taken',
      value: (
        <GridRow
          loadedPhotoData={loadedPhotoData}
          data={loadedPhotoData?.exif?.dateTimeOriginal?.displayString}
        />
      ),
    },
    {
      name: (
        <div>
          Latitude
          <br />
          Longitude
        </div>
      ),
      value: <LatLngRow loadedPhotoData={loadedPhotoData} />,
    },
  ];

  const generalDataRows: NameValueGridRow[] = nameAndValues.map(
    (nameAndValue, index) => {
      return {
        id: index,
        parentId: null,
        name: <div style={fontSize}>{nameAndValue.name}</div>,
        value: <div style={fontSize}>{nameAndValue.value ?? ''}</div>,
      };
    }
  );

  return generalDataRows;
}
