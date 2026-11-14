import { act, render, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import {
  trackLoadedLanguageInUse,
  trackLoadedUserSetting,
} from '../analytics/track-event';
import { applyLanguage, languageReady } from '../i18n/i18n';
import { useLocalStorage } from './useLocalStorage';
import {
  changeSendUsageData,
  initializeUserSettingsIfNeeded,
  useUserSettings,
  useUserSettingsInitializer,
  useUserSettingsTracker,
} from './useUserSettings';

// What is recorded is checked here, and sent nowhere.
jest.mock('../analytics/track-event');

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

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

describe('useUserSettingsTracker', () => {
  afterEach(() => act(() => applyLanguage('en')));

  it('records each setting as it is loaded', () => {
    localStorage.setItem('DateFormat', 'DD/MM/YYYY');
    localStorage.setItem('Language', 'ja');
    const { result } = renderHook(() => useUserSettingsTracker());
    result.current.trackLoadedUserSettings();
    expect(jest.mocked(trackLoadedUserSetting).mock.calls).toEqual([
      ['DateFormat', 'DD/MM/YYYY'],
      ['ClockSystemFormat', '24-hour'],
      ['WideLayoutPhotoDataPaneFlex', '0.5'],
      ['WideLayoutPhotoImagePaneFlex', '0.5'],
      ['Language', 'ja'],
    ]);
  });

  // The setting follows the browser here, which does not tell the language.
  it('records the language the app is shown in beside the Language setting, once the app shows it', async () => {
    await act(() => applyLanguage('ja'));
    const { result } = renderHook(() => useUserSettingsTracker());
    result.current.trackLoadedUserSettings();
    expect(trackLoadedUserSetting).toHaveBeenCalledWith('Language', 'auto');
    expect(trackLoadedLanguageInUse).not.toHaveBeenCalled();

    await languageReady;
    expect(jest.mocked(trackLoadedLanguageInUse).mock.calls).toEqual([['ja']]);
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
