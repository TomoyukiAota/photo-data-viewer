import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { DateTimeFormat } from '../utils/date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
  WideLayoutPhotoDataPaneFlex: 'WideLayoutPhotoDataPaneFlex',
  WideLayoutPhotoImagePaneFlex: 'WideLayoutPhotoImagePaneFlex',
} as const;

export const UserSettingDefaultValue = {
  DateFormat: DateTimeFormat.ForUser.DateFormat_Default,
  ClockSystemFormat: DateTimeFormat.ForUser.ClockSystemFormat_Default,
  WideLayoutPhotoDataPaneFlex: 0.5,
  WideLayoutPhotoImagePaneFlex: 0.5,
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

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
  const setUserSetting = (key: UserSettingKeyType, value: any) => writeStorage(key, value);
  return { userSettings, setUserSetting };
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
