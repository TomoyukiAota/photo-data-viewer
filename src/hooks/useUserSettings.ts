import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { applyUsageDataSetting } from '../analytics/analytics';
import { trackChangedUserSetting, trackLoadedUserSetting } from '../analytics/track-event';
import { DateTimeFormat } from '../utils/date-time-format';
import { UserSettingDefaultValue, UserSettingKey, UserSettingKeyType } from '../utils/user-settings';


export const useUserSettings = () => {
  const [dateFormat] = useLocalStorage(UserSettingKey.DateFormat, UserSettingDefaultValue.DateFormat);
  const [clockSystemFormat] = useLocalStorage(UserSettingKey.ClockSystemFormat, UserSettingDefaultValue.ClockSystemFormat);
  const [wideLayoutPhotoDataPaneFlex] = useLocalStorage(UserSettingKey.WideLayoutPhotoDataPaneFlex, UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex);
  const [wideLayoutPhotoImagePaneFlex] = useLocalStorage(UserSettingKey.WideLayoutPhotoImagePaneFlex, UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex);
  const [sendUsageData] = useLocalStorage<boolean>(UserSettingKey.SendUsageData, UserSettingDefaultValue.SendUsageData);
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

export const useUserSettingsInitializer = () => {
  function setIfUninitialized(key: string, value: any) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [savedValue] = useLocalStorage(key);
    const uninitialized = savedValue === null;
    if (uninitialized) {
      writeStorage(key, value);
    }
  }

  return {
    initilizeUserSettingsIfNeeded: () => {
      setIfUninitialized(UserSettingKey.DateFormat, UserSettingDefaultValue.DateFormat);
      setIfUninitialized(UserSettingKey.ClockSystemFormat, UserSettingDefaultValue.ClockSystemFormat);
      setIfUninitialized(UserSettingKey.WideLayoutPhotoDataPaneFlex, UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex);
      setIfUninitialized(UserSettingKey.WideLayoutPhotoImagePaneFlex, UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex);
    }
  };
}

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
