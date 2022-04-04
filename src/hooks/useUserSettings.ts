import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { trackChangedUserSetting, trackLoadedUserSetting } from '../google-analytics/track-event';
import { DateTimeFormat } from '../utils/date-time-format';
import { UserSettingDefaultValue, UserSettingKey, UserSettingKeyType } from '../utils/user-settings';


export const useUserSettings = () => {
  const [dateFormat] = useLocalStorage(UserSettingKey.DateFormat, UserSettingDefaultValue.DateFormat);
  const [clockSystemFormat] = useLocalStorage(UserSettingKey.ClockSystemFormat, UserSettingDefaultValue.ClockSystemFormat);
  const [wideLayoutPhotoDataPaneFlex] = useLocalStorage(UserSettingKey.WideLayoutPhotoDataPaneFlex, UserSettingDefaultValue.WideLayoutPhotoDataPaneFlex);
  const [wideLayoutPhotoImagePaneFlex] = useLocalStorage(UserSettingKey.WideLayoutPhotoImagePaneFlex, UserSettingDefaultValue.WideLayoutPhotoImagePaneFlex);
  const userSettings = {
    dateFormat: dateFormat as DateTimeFormat.ForUser.DateFormatType,
    clockSystemFormat: clockSystemFormat as DateTimeFormat.ForUser.ClockSystemFormatType,
    wideLayoutPhotoDataPaneFlex,
    wideLayoutPhotoImagePaneFlex,
  }
  const setUserSetting = (key: UserSettingKeyType, value: any) => {
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
