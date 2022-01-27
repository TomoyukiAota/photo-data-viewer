import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

const localizedFormatStr = 'LLLL';

export function formatDate(dateTime: Parameters<typeof dayjs>[0]): string {
  return dateTime
    ? dayjs(dateTime).format(localizedFormatStr)
    : '';
}
