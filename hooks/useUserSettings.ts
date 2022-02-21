import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { DateTimeFormat } from '../utils/date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
  WideLayoutPhotoDataPaneSize: 'WideLayoutPhotoDataPaneSize',
  WideLayoutPhotoImagePaneSize: 'WideLayoutPhotoImagePaneSize',
} as const;

export const UserSettingDefaultValue = {
  DateFormat: DateTimeFormat.ForUser.DateFormat_Default,
  ClockSystemFormat: DateTimeFormat.ForUser.ClockSystemFormat_Default,
  WideLayoutPhotoDataPaneSize: 0.5,
  WideLayoutPhotoImagePaneSize: 0.5,
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

export const useUserSettings = () => {
  const [dateFormat] = useLocalStorage(UserSettingKey.DateFormat, UserSettingDefaultValue.DateFormat);
  const [clockSystemFormat] = useLocalStorage(UserSettingKey.ClockSystemFormat, UserSettingDefaultValue.ClockSystemFormat);
  const [wideLayoutPhotoDataPaneSize] = useLocalStorage(UserSettingKey.WideLayoutPhotoDataPaneSize, UserSettingDefaultValue.WideLayoutPhotoDataPaneSize);
  const [wideLayoutPhotoImagePaneSize] = useLocalStorage(UserSettingKey.WideLayoutPhotoImagePaneSize, UserSettingDefaultValue.WideLayoutPhotoImagePaneSize);
  const userSettings = {
    dateFormat: dateFormat as DateTimeFormat.ForUser.DateFormatType,
    clockSystemFormat: clockSystemFormat as DateTimeFormat.ForUser.ClockSystemFormatType,
    wideLayoutPhotoDataPaneSize,
    wideLayoutPhotoImagePaneSize,
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
      setIfUninitialized(UserSettingKey.WideLayoutPhotoDataPaneSize, UserSettingDefaultValue.WideLayoutPhotoDataPaneSize);
      setIfUninitialized(UserSettingKey.WideLayoutPhotoImagePaneSize, UserSettingDefaultValue.WideLayoutPhotoImagePaneSize);
    }
  };
}
