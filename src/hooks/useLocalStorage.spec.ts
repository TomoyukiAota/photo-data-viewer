import { act, renderHook } from '@testing-library/react';
import { readStorage, useLocalStorage, writeStorage } from './useLocalStorage';

afterEach(() => localStorage.clear());

describe('writeStorage and readStorage', () => {
  // The format @rehooks/local-storage used, which saved settings are in.
  it.each([
    ['a string as it is', 'DD/MM/YYYY', 'DD/MM/YYYY'],
    ['a boolean', false, 'false'],
    ['a number', 0.3, '0.3'],
    ['an object as JSON', { a: [1, 'b'] }, '{"a":[1,"b"]}'],
  ])('stores %s and reads it back', (_, value, stored) => {
    writeStorage('key', value);
    expect(localStorage.getItem('key')).toBe(stored);
    expect(readStorage('key')).toEqual(value);
  });

  it('reads a stored string as JSON where it parses', () => {
    localStorage.setItem('key', 'true');
    expect(readStorage('key')).toBe(true);
    localStorage.setItem('key', '12-hour');
    expect(readStorage('key')).toBe('12-hour');
  });

  it('reads null when nothing is stored', () => {
    expect(readStorage('key')).toBeNull();
  });
});

describe('useLocalStorage', () => {
  it('returns the stored value from the first render', () => {
    localStorage.setItem('key', 'DD/MM/YYYY');
    const rendered: string[] = [];
    renderHook(() => {
      rendered.push(useLocalStorage('key', 'YYYY-MM-DD'));
    });
    expect(rendered).toEqual(['DD/MM/YYYY']);
    expect(localStorage.getItem('key')).toBe('DD/MM/YYYY');
  });

  it('returns the default when nothing is stored, and stores it', () => {
    const { result } = renderHook(() => useLocalStorage('key', 0.5));
    expect(result.current).toBe(0.5);
    expect(localStorage.getItem('key')).toBe('0.5');
  });

  it('does not store a null default', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | null>('key', null),
    );
    expect(result.current).toBeNull();
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('follows writeStorage in the same tab, in every hook of the key', () => {
    const first = renderHook(() => useLocalStorage('key', true));
    const second = renderHook(() => useLocalStorage('key', true));
    const other = renderHook(() => useLocalStorage('other', 'value'));
    act(() => writeStorage('key', false));
    expect(first.result.current).toBe(false);
    expect(second.result.current).toBe(false);
    expect(other.result.current).toBe('value');
  });

  it('follows changes made in other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'YYYY-MM-DD'));
    const changeInOtherTab = (key: string, newValue: string | null) =>
      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
      });

    changeInOtherTab('key', 'DD/MM/YYYY');
    expect(result.current).toBe('DD/MM/YYYY');
    changeInOtherTab('other', 'value');
    expect(result.current).toBe('DD/MM/YYYY');
    changeInOtherTab('key', null); // Removed: the default applies.
    expect(result.current).toBe('YYYY-MM-DD');
  });

  it('stops following changes when unmounted', () => {
    const rendered: boolean[] = [];
    const { unmount } = renderHook(() => {
      rendered.push(useLocalStorage('key', true));
    });
    unmount();
    const count = rendered.length;
    act(() => writeStorage('key', false));
    expect(rendered).toHaveLength(count);
  });
});
