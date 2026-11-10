import { applyLanguage } from '../i18n/i18n';
import { languageCodes } from '../i18n/languages';
import { DateTimeFormat } from './date-time-format';
import { formatDate } from './format-date';

beforeEach(() => localStorage.clear());
afterEach(() => applyLanguage('en'));

it('preserves the empty/missing date display', () => {
  expect(formatDate(undefined)).toBe('');
  expect(formatDate(null)).toBe('');
});

it.each([
  ['YYYY-MM-DD', '24-hour', '2019-11-25 Mon 14:53:29'],
  ['YYYY/MM/DD', '24-hour', '2019/11/25 Mon 14:53:29'],
  ['DD/MM/YYYY', '24-hour', '25/11/2019 Mon 14:53:29'],
  ['MM/DD/YYYY', '12-hour', '11/25/2019 Mon 02:53:29 pm'],
])('preserves saved date/clock settings %s %s', (date, clock, expected) => {
  localStorage.setItem('DateFormat', date);
  localStorage.setItem('ClockSystemFormat', clock);
  expect(formatDate('2019-11-25T14:53:29')).toBe(expected);
});

it('writes the day of the week as the language does: in parentheses in Japanese', async () => {
  await applyLanguage('ja');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 (月) 14:53:29');
  localStorage.setItem('ClockSystemFormat', '12-hour');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 (月) 02:53:29 午後');
  await applyLanguage('en');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 Mon 02:53:29 pm');
});

it('writes a date with the digits 0 to 9 in every language, as Photo Location Map does', async () => {
  // TL;DR: A date is written the same way in both applications, and as the
  // other numbers of a photo's data are.
  // Details: dayjs' locale of Arabic can turn the digits into those of its
  // script, but only with a plugin (preParsePostFormat) that this app does not
  // use. This finds out if that changes, or if a locale starts to do it itself.
  const otherDigits: string[] = [];
  for (const code of languageCodes) {
    await applyLanguage(code);
    for (const date of DateTimeFormat.ForUser.DateFormat_List) {
      for (const clock of DateTimeFormat.ForUser.ClockSystemFormat_List) {
        localStorage.setItem('DateFormat', date);
        localStorage.setItem('ClockSystemFormat', clock);
        const text = formatDate('2019-11-25T14:53:29');
        // A digit of any script but 0 to 9, or the date's own digits missing.
        if (/(?![0-9])\p{Nd}/u.test(text) || !/2019.*14:53:29|2019.*02:53:29/.test(text)) {
          otherDigits.push(`${code}: ${text}`);
        }
      }
    }
  }
  expect(otherDigits).toEqual([]);
});

it('writes a date in Arabic with those digits, and the day of the week and the half of the day in Arabic', async () => {
  await applyLanguage('ar');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 إثنين 14:53:29');
  localStorage.setItem('ClockSystemFormat', '12-hour');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 إثنين 02:53:29 م');
});
