import { useEffect } from 'react';
import { applyUsageDataSetting } from '../analytics/analytics';
import { trackChangedUserSetting, trackLoadedUserSetting } from '../analytics/track-event';
import { DateTimeFormat } from '../utils/date-time-format';
import { UserSettingDefaultValue, UserSettingKey, UserSettingKeyType } from '../utils/user-settings';
import { readStorage, useLocalStorage, writeStorage } from './useLocalStorage';


export const useUserSettings = () => {
  const dateFormat = useLocalStorage<string>(UserSettingKey.DateFormat, UserSettingDefaultValue.DateFormat);
  const clockSystemFormat = useLocalStorage<string>(UserSettingKey.ClockSystemFormat, UserSettingDefaultValue.ClockSystemFormat);
  const wideLayoutPhotoDataPaneFlex = useLocalStorage<number>(UserSettingKey.WideLayoutPhotoDataPaneFlex, UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex);
  const wideLayoutPhotoImagePaneFlex = useLocalStorage<number>(UserSettingKey.WideLayoutPhotoImagePaneFlex, UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex);
  const sendUsageData = useLocalStorage<boolean>(UserSettingKey.SendUsageData, UserSettingDefaultValue.SendUsageData);
  const userSettings = {
    dateFormat: dateFormat as DateTimeFormat.ForUser.DateFormatType,
    clockSystemFormat: clockSystemFormat as DateTimeFormat.ForUser.ClockSystemFormatType,
    wideLayoutPhotoDataPaneFlex,
    wideLayoutPhotoImagePaneFlex,
    sendUsageData,
  }
  const setUserSetting = (key: UserSettingKeyType, value: any) => {
    if (key === UserSettingKey.SendUsageData) {
      changeSendUsageData(value, {
        track: (send) => trackChangedUserSetting(key, String(send)),
        save: (send) => {
          writeStorage(key, send);
          applyUsageDataSetting(send);
        },
      });
      return;
    }
    writeStorage(key, value);
    trackChangedUserSetting(key, value);
  };
  return { userSettings, setUserSetting };
};

export const useUserSettingsTracker = () => {
  const { userSettings } = useUserSettings();

  const trackLoadedUserSettings = () => {
    trackLoadedUserSetting(UserSettingKey.DateFormat, userSettings.dateFormat);
    trackLoadedUserSetting(UserSettingKey.ClockSystemFormat, userSettings.clockSystemFormat);
    trackLoadedUserSetting(UserSettingKey.WideLayoutPhotoDataPaneFlex, userSettings.wideLayoutPhotoDataPaneFlex.toString());
    trackLoadedUserSetting(UserSettingKey.WideLayoutPhotoImagePaneFlex, userSettings.wideLayoutPhotoImagePaneFlex.toString());
  }

  return { trackLoadedUserSettings };
};

// Stores the default of each of these settings that has no saved value. A saved value
// that reads as null counts as none. On the server, it does nothing.
export function initializeUserSettingsIfNeeded() {
  function setIfUninitialized(key: string, value: unknown) {
    if (readStorage(key) === null) {
      writeStorage(key, value);
    }
  }

  setIfUninitialized(UserSettingKey.DateFormat, UserSettingDefaultValue.DateFormat);
  setIfUninitialized(UserSettingKey.ClockSystemFormat, UserSettingDefaultValue.ClockSystemFormat);
  setIfUninitialized(UserSettingKey.WideLayoutPhotoDataPaneFlex, UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex);
  setIfUninitialized(UserSettingKey.WideLayoutPhotoImagePaneFlex, UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex);
}

// Runs initializeUserSettingsIfNeeded after every commit. Not during render: storing a
// value updates the other components using the setting, which React does not allow
// while this one renders. After every commit, not once: a setting removed later, in
// another tab, gets its default again.
export const useUserSettingsInitializer = () => {
  useEffect(() => initializeUserSettingsIfNeeded());
};

// Turning the sending of usage data off is recorded before it takes effect, and turning
// it on after, so that both are recorded. The one event sent on turning it off is how
// the rate of opting out is known; nothing is sent after it.
export function changeSendUsageData(
  send: boolean,
  steps: { track: (send: boolean) => void; save: (send: boolean) => void }
) {
  if (!send) steps.track(send);
  steps.save(send);
  if (send) steps.track(send);
}
