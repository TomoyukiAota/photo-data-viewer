import type { TFunction } from 'i18next';

import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import { NameAndValue, NameValueGridRow } from '../grid/NameValueGrid';
import GridRow from './GridRow';
import LatLngRow from './LatLngRow';
import WidthHeightRow from './WidthHeightRow';
import classes from './general-data-row.module.scss';

type TempNameAndValue =
  | ((NameAndValue | { name: string; value: undefined }) & {
      /**
       * The value stays on one line and is cut where the column ends, as a
       * file's name is. Any other value continues on the next line.
       */
      onOneLine?: boolean;
    })
  | { whole: React.JSX.Element };

/** The rows of the General tab. `t` translates their names (from useTranslation). */
export function createGeneralDataRows(
  loadedPhotoData: LoadedPhotoData | null,
  fontSize: React.CSSProperties,
  t: TFunction
): NameValueGridRow[] {
  const nameAndValues: TempNameAndValue[] = [
    {
      name: t('photoData.general.fileName'),
      onOneLine: true,
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
      // One row for the two, which lays out its own names and numbers.
      whole: <LatLngRow loadedPhotoData={loadedPhotoData} style={fontSize} />,
    },
  ];

  const generalDataRows: NameValueGridRow[] = nameAndValues.map(
    (nameAndValue, index) => {
      if ('whole' in nameAndValue) {
        return {
          id: index,
          parentId: null,
          name: '',
          value: '',
          whole: nameAndValue.whole,
        };
      }
      return {
        id: index,
        parentId: null,
        name: <div style={fontSize}>{nameAndValue.name}</div>,
        value: (
          <div
            style={fontSize}
            className={nameAndValue.onOneLine ? undefined : classes.wrap}
          >
            {nameAndValue.value ?? ''}
          </div>
        ),
      };
    }
  );

  return generalDataRows;
}
