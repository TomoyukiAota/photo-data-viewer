import type { TFunction } from 'i18next';

import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';
import GridRow from './GridRow';
import LatLngRow from './LatLngRow';
import WidthHeightRow from './WidthHeightRow';

type TempNameAndValue = NameAndValue | { name: string; value: undefined };

/** The rows of the General tab. `t` translates their names (from useTranslation). */
export function createGeneralDataRows(
  loadedPhotoData: LoadedPhotoData | null,
  fontSize: React.CSSProperties,
  t: TFunction
): NameValueGridRow[] {
  const nameAndValues: TempNameAndValue[] = [
    {
      name: t('photoData.general.fileName'),
      value: (
        <GridRow
          loadedPhotoData={loadedPhotoData}
          data={loadedPhotoData?.file?.name}
        />
      ),
    },
    {
      name: t('photoData.general.fileSize'),
      value: (
        <GridRow
          loadedPhotoData={loadedPhotoData}
          data={loadedPhotoData?.file?.size?.displayString}
        />
      ),
    },
    {
      name: t('photoData.general.widthHeight'),
      value: <WidthHeightRow />,
    },
    {
      name: t('photoData.general.dateTaken'),
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
          {t('photoData.general.latitude')}
          <br />
          {t('photoData.general.longitude')}
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
