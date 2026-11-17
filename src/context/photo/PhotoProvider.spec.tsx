import { act, render, waitFor } from '@testing-library/react';
import { useContext } from 'react';

import { trackDisplayedPhoto, trackLoadedPhoto } from '../../analytics/track-event';
import PhotoProvider from './PhotoProvider';
import PhotoContext from './photo-context';

jest.mock('../../analytics/track-event');
// The photo's data and its image, which the browser reads, and the wait made on purpose before them.
jest.mock('./loaded-photo-data', () => ({
  createLoadedPhotoData: jest.fn(async (file: File) => ({ file: { file }, isExifAvailable: true })),
}));
jest.mock('../photo-dimensions/set-photo-dimensions', () => ({
  setPhotoDimensions: jest.fn(async () => ({ width: 4032, height: 3024 })),
}));
jest.mock('../../utils/sleep', () => ({ sleep: jest.fn(async () => {}) }));

/** How each photo loaded was recorded: chosen, loaded again, the demo's or dropped. */
function recorded() {
  return {
    loaded: jest.mocked(trackLoadedPhoto).mock.calls.map(([, { isReload, isDemo, isDropped }]) => ({
      isReload,
      isDemo,
      isDropped,
    })),
    displayed: jest.mocked(trackDisplayedPhoto).mock.calls.map(([{ isReload, isDemo, isDropped }]) => ({
      isReload,
      isDemo,
      isDropped,
    })),
  };
}

it('records a dropped photo as dropped, also when it is loaded again after a setting changes', async () => {
  URL.createObjectURL = jest.fn(() => 'blob:photo');
  let photoCtx = undefined as unknown as React.ContextType<typeof PhotoContext>;
  const Reader: React.FC = () => {
    photoCtx = useContext(PhotoContext);
    return null;
  };
  render(
    <PhotoProvider>
      <Reader />
    </PhotoProvider>,
  );
  const file = new File(['x'], 'demo.jpg', { type: 'image/jpeg' });
  const loadedTimes = async (times: number) =>
    waitFor(() => expect(trackDisplayedPhoto).toHaveBeenCalledTimes(times));

  act(() => photoCtx.loadPhoto(file, { isDropped: true }));
  await loadedTimes(1);
  act(() => photoCtx.reloadPhoto());
  await loadedTimes(2);
  // One chosen with the button after it is not.
  act(() => photoCtx.loadPhoto(file));
  await loadedTimes(3);

  const dropped = { isReload: false, isDemo: false, isDropped: true };
  const droppedAgain = { isReload: true, isDemo: false, isDropped: true };
  const chosen = { isReload: false, isDemo: false, isDropped: false };
  expect(recorded()).toEqual({
    loaded: [dropped, droppedAgain, chosen],
    displayed: [dropped, droppedAgain, chosen],
  });
});
