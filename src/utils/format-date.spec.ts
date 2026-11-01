import { formatDate } from './format-date';

beforeEach(() => localStorage.clear());

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
