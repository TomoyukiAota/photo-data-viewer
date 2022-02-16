import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { DateTimeFormat } from '../utils/date-time-format';

export const UserSettingKey = {
  DateFormat: 'DateFormat',
  ClockSystemFormat: 'ClockSystemFormat',
} as const;

export type UserSettingKeyType = typeof UserSettingKey[keyof typeof UserSettingKey];

export const useUserSettings = () => {
  const [dateFormat] = useLocalStorage(UserSettingKey.DateFormat, DateTimeFormat.ForUser.DateFormat_Default);
  const [clockSystemFormat] = useLocalStorage(UserSettingKey.ClockSystemFormat, DateTimeFormat.ForUser.ClockSystemFormat_Default);
  const userSettings = {
    dateFormat: dateFormat as DateTimeFormat.ForUser.DateFormatType,
    clockSystemFormat: clockSystemFormat as DateTimeFormat.ForUser.ClockSystemFormatType,
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
      setIfUninitialized(UserSettingKey.DateFormat, DateTimeFormat.ForUser.DateFormat_Default);
      setIfUninitialized(UserSettingKey.ClockSystemFormat, DateTimeFormat.ForUser.ClockSystemFormat_Default);
    }
  };
}
