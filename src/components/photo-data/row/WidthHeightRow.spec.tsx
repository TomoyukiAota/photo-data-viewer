import { act, render } from '@testing-library/react';

import PhotoDimensionsContext, {
  PhotoDimensionsContextType,
} from '../../../context/photo-dimensions/photo-dimensions-context';
import { applyLanguage } from '../../../i18n/i18n';
import WidthHeightRow from './WidthHeightRow';

afterEach(() => act(() => applyLanguage('en')));

function renderRow(context: Partial<PhotoDimensionsContextType>) {
  return render(
    <PhotoDimensionsContext.Provider
      value={{
        loadStatus: 'Load Success',
        setLoadStatus: () => {},
        dimensions: { width: 4032, height: 3024 },
        setDimensions: () => {},
        ...context,
      }}
    >
      <WidthHeightRow />
    </PhotoDimensionsContext.Provider>,
  );
}

it("writes the photo's width and height as the language does", async () => {
  const { container } = renderRow({});
  expect(container.textContent).toBe('4032 x 3024');

  await act(() => applyLanguage('ja'));
  expect(container.textContent).toBe('4032 × 3024');
});

it('keeps each number together in a language written from right to left', async () => {
  await act(() => applyLanguage('ar'));
  const { container } = renderRow({});
  const start = String.fromCodePoint(0x2068);
  const end = String.fromCodePoint(0x2069);
  expect(container.textContent).toBe(`${start}4032${end} × ${start}3024${end}`);
  // The numbers alone are written from left to right, whatever the page's direction.
  expect(container.firstElementChild?.getAttribute('dir')).toBe('auto');
});

it('says so while the photo is loading, and when it could not be loaded', () => {
  expect(renderRow({ loadStatus: 'Loading' }).container.textContent).toBe(
    'Loading...',
  );
  expect(renderRow({ loadStatus: 'Load Failed' }).container.textContent).toBe(
    'Not Available',
  );
});
