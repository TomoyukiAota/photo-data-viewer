import { act, render, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  changeSendUsageData,
  initializeUserSettingsIfNeeded,
  useUserSettings,
  useUserSettingsInitializer,
} from './useUserSettings';

afterEach(() => localStorage.clear());

const stored = () =>
  Object.fromEntries(
    Object.keys(localStorage)
      .sort()
      .map((key) => [key, localStorage.getItem(key)]),
  );

describe('useUserSettings', () => {
  it('reads the settings users have saved, unchanged', () => {
    const saved = {
      ClockSystemFormat: '12-hour',
      DateFormat: 'DD/MM/YYYY',
      Language: 'ja',
      SendUsageData: 'false',
      WideLayoutPhotoDataPaneFlex: '0.3',
      WideLayoutPhotoImagePaneFlex: '0.7',
    };
    for (const [key, value] of Object.entries(saved)) {
      localStorage.setItem(key, value);
    }
    const { result } = renderHook(() => useUserSettings());
    expect(result.current.userSettings).toEqual({
      dateFormat: 'DD/MM/YYYY',
      clockSystemFormat: '12-hour',
      wideLayoutPhotoDataPaneFlex: 0.3,
      wideLayoutPhotoImagePaneFlex: 0.7,
      sendUsageData: false,
      language: 'ja',
    });
    expect(stored()).toEqual(saved);
  });

  it('stores the defaults when nothing is saved', () => {
    renderHook(() => useUserSettings());
    expect(stored()).toEqual({
      ClockSystemFormat: '24-hour',
      DateFormat: 'YYYY-MM-DD',
      Language: 'auto',
      SendUsageData: 'true',
      WideLayoutPhotoDataPaneFlex: '0.5',
      WideLayoutPhotoImagePaneFlex: '0.5',
    });
  });
});

describe('initializeUserSettingsIfNeeded', () => {
  it('stores the default of each setting that has none, and keeps saved ones', () => {
    localStorage.setItem('DateFormat', 'DD/MM/YYYY');
    initializeUserSettingsIfNeeded();
    expect(stored()).toEqual({
      ClockSystemFormat: '24-hour',
      DateFormat: 'DD/MM/YYYY',
      Language: 'auto',
      WideLayoutPhotoDataPaneFlex: '0.5',
      WideLayoutPhotoImagePaneFlex: '0.5',
    });
  });
});

describe('useUserSettingsInitializer', () => {
  it('stores the defaults after the first render, not while rendering', () => {
    const storedWhileRendering: (string | null)[] = [];
    renderHook(() => {
      useUserSettingsInitializer();
      storedWhileRendering.push(localStorage.getItem('DateFormat'));
    });
    expect(storedWhileRendering[0]).toBeNull();
    expect(stored()).toEqual({
      ClockSystemFormat: '24-hour',
      DateFormat: 'YYYY-MM-DD',
      Language: 'auto',
      WideLayoutPhotoDataPaneFlex: '0.5',
      WideLayoutPhotoImagePaneFlex: '0.5',
    });
  });

  // As in the app, the component that runs it also uses a setting, and so does a
  // component inside it.
  it('stores a default again after another tab removes it, outside of rendering', () => {
    function DateFormat() {
      return useLocalStorage('DateFormat', 'YYYY-MM-DD');
    }
    function Root() {
      useUserSettingsInitializer();
      useLocalStorage('DateFormat', 'YYYY-MM-DD');
      return createElement(DateFormat);
    }
    const errors = jest.spyOn(console, 'error');
    try {
      localStorage.setItem('DateFormat', 'DD/MM/YYYY');
      const { container } = render(createElement(Root));
      expect(container.textContent).toBe('DD/MM/YYYY');

      localStorage.removeItem('DateFormat');
      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', { key: 'DateFormat', newValue: null }),
        );
      });
      expect(localStorage.getItem('DateFormat')).toBe('YYYY-MM-DD');
      expect(container.textContent).toBe('YYYY-MM-DD');
      expect(errors).not.toHaveBeenCalled();
    } finally {
      errors.mockRestore();
    }
  });
});

describe('changeSendUsageData', () => {
  function run(send: boolean): string[] {
    const steps: string[] = [];
    changeSendUsageData(send, {
      track: (value) => steps.push(`track ${value}`),
      save: (value) => steps.push(`save ${value}`),
    });
    return steps;
  }

  it('records turning it off before it takes effect, so that the change is sent', () => {
    expect(run(false)).toEqual(['track false', 'save false']);
  });

  it('records turning it on after it takes effect, so that the change is sent', () => {
    expect(run(true)).toEqual(['save true', 'track true']);
  });
});
