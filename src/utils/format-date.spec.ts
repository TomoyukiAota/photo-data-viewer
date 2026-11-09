import { applyLanguage } from '../i18n/i18n';
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

it('writes the day of the week as the language does: in parentheses in Japanese', () => {
  applyLanguage('ja');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 (月) 14:53:29');
  localStorage.setItem('ClockSystemFormat', '12-hour');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 (月) 02:53:29 午後');
  applyLanguage('en');
  expect(formatDate('2019-11-25T14:53:29')).toBe('2019-11-25 Mon 02:53:29 pm');
});
