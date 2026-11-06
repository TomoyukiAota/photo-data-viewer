import { renderHook } from '@testing-library/react';
import {
  changeSendUsageData,
  initializeUserSettingsIfNeeded,
  useUserSettings,
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
    });
    expect(stored()).toEqual(saved);
  });

  it('stores the defaults when nothing is saved', () => {
    renderHook(() => useUserSettings());
    expect(stored()).toEqual({
      ClockSystemFormat: '24-hour',
      DateFormat: 'YYYY-MM-DD',
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
      WideLayoutPhotoDataPaneFlex: '0.5',
      WideLayoutPhotoImagePaneFlex: '0.5',
    });
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
