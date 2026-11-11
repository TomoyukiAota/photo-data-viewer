import { render } from '@testing-library/react';

import { LoadedPhotoData } from '../../../context/photo/loaded-photo-data';
import i18n from '../../../i18n/i18n';
import { createGeneralDataRows } from './general-data-row';

/** A loaded photo as far as the rows look at it. */
function photo(): LoadedPhotoData {
  return {
    isFileLoaded: true,
    file: { name: 'demo.jpg', size: { displayString: '3.09 MB' } },
    exif: {
      dateTimeOriginal: { displayString: '2019-03-16 Sat 05:29:58 PM' },
      isLatLngAvailable: false,
    },
  } as unknown as LoadedPhotoData;
}

/** The element around a row's value, which says whether the value may take more than one line. */
function valueOf(row: { value: unknown }): HTMLElement {
  const { container } = render(<>{row.value as React.JSX.Element}</>);
  return container.firstElementChild as HTMLElement;
}

it('lets every value but the file name continue on the next line, so that a date longer than its column is not cut', () => {
  const rows = createGeneralDataRows(photo(), {}, i18n.t);
  const [fileName, fileSize, , dateTaken] = rows;

  expect(valueOf(dateTaken).textContent).toBe('2019-03-16 Sat 05:29:58 PM');
  expect(valueOf(dateTaken).classList.contains('wrap')).toBe(true);
  expect(valueOf(fileSize).classList.contains('wrap')).toBe(true);

  // A file's name stays on one line, cut where the column ends.
  expect(valueOf(fileName).textContent).toBe('demo.jpg');
  expect(valueOf(fileName).classList.contains('wrap')).toBe(false);
});

it('has one row for the latitude and the longitude, which lays itself out', () => {
  const rows = createGeneralDataRows(photo(), {}, i18n.t);
  expect(rows).toHaveLength(5);
  expect(rows[4].whole).toBeTruthy();
});
