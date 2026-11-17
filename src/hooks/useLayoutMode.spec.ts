import { act, renderHook } from '@testing-library/react';

import { AppIntegration } from '../app-integration/app-integration';
import { LayoutMode } from '../utils/user-settings';
import { writeStorage } from './useLocalStorage';
import { isWideLayout, useLayoutMode } from './useLayoutMode';

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('isWideLayout', () => {
  it('splits the panes in a window wider than 1200 pixels in the automatic mode, as before the mode could be chosen', () => {
    expect(isWideLayout(1201, LayoutMode.Auto)).toBe(true);
    expect(isWideLayout(1200, LayoutMode.Auto)).toBe(false);
    expect(isWideLayout(320, LayoutMode.Auto)).toBe(false);
  });

  it('keeps the chosen layout at every width', () => {
    for (const width of [320, 600, 1200, 1201, 1920]) {
      expect(isWideLayout(width, LayoutMode.SplitPanes)).toBe(true);
      expect(isWideLayout(width, LayoutMode.SinglePane)).toBe(false);
    }
  });
});

describe('useLayoutMode', () => {
  it('is the automatic mode when none is stored, which it stores', () => {
    const { result } = renderHook(() => useLayoutMode());
    expect(result.current).toBe('auto');
    expect(localStorage.getItem('LayoutMode')).toBe('auto');
  });

  it('is the stored mode, and follows a change of it', () => {
    localStorage.setItem('LayoutMode', 'singlePane');
    const { result } = renderHook(() => useLayoutMode());
    expect(result.current).toBe('singlePane');

    act(() => writeStorage('LayoutMode', 'splitPanes'));
    expect(result.current).toBe('splitPanes');
  });

  it('reads a stored value that is none of the modes as the automatic one', () => {
    localStorage.setItem('LayoutMode', 'columns');
    const { result } = renderHook(() => useLayoutMode());
    expect(result.current).toBe('auto');
    // The value is left as it is.
    expect(localStorage.getItem('LayoutMode')).toBe('columns');
  });

  // Its window has no header, and so no button to change the mode back with.
  it('is the automatic mode in Photo Location Map, whatever is stored', () => {
    jest.spyOn(AppIntegration, 'isStandalone', 'get').mockReturnValue(false);
    localStorage.setItem('LayoutMode', 'singlePane');
    const { result } = renderHook(() => useLayoutMode());
    expect(result.current).toBe('auto');
  });
});
