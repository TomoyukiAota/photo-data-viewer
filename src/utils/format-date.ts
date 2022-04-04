import dayjs from 'dayjs';
import { DateTimeFormat } from './date-time-format';
import { UserSettingKey } from './user-settings';

function getDateTimeFormat(): DateTimeFormat.ForUser.DateFormatType {
  const savedStr = localStorage.getItem(UserSettingKey.DateFormat) as DateTimeFormat.ForUser.DateFormatType;
  return savedStr === null ? DateTimeFormat.ForUser.DateFormat_Default : savedStr;
}

function getClockSystemFormat(): DateTimeFormat.ForUser.ClockSystemFormatType {
  const savedStr = localStorage.getItem(UserSettingKey.ClockSystemFormat) as DateTimeFormat.ForUser.ClockSystemFormatType;
  return savedStr === null ? DateTimeFormat.ForUser.ClockSystemFormat_Default : savedStr;
}

export function formatDate(dateTime: Parameters<typeof dayjs>[0]): string {
  const dateFormat = getDateTimeFormat();
  const clockSystemFormat = getClockSystemFormat();
  const dayjsFormatStr = DateTimeFormat.ForUser.getDayjsFormatString(dateFormat, clockSystemFormat);
  return dateTime
    ? dayjs(dateTime).format(dayjsFormatStr)
    : '';
}
