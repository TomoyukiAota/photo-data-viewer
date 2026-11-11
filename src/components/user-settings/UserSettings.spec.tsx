import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { applyLanguage } from '../../i18n/i18n';
import { DateTimeFormat } from '../../utils/date-time-format';
import UserSettings from './UserSettings';

// What the page records is checked elsewhere, and sent nowhere.
jest.mock('../../analytics/track-event');

afterEach(async () => {
  localStorage.clear();
  await act(() => applyLanguage('en'));
});

/** The box around a field, which lays out the field's label and choices to be as wide as they need. */
function boxOf(field: HTMLElement): HTMLElement {
  return field.closest('[data-label]') as HTMLElement;
}

it('has each field of the date and time in a box that knows its label and its choices, which give the field its width', () => {
  render(<UserSettings />);
  const dateFormat = screen.getByRole('combobox', { name: 'Date Format' });
  const clock = screen.getByRole('combobox', { name: '12- or 24-hour' });

  expect(dateFormat.textContent).toBe('YYYY-MM-DD');
  expect(clock.textContent).toBe('24-hour');

  // The box has the label and every choice, not the chosen one alone, so
  // that the field is as wide for one choice as for another. It is never
  // narrower than the field is in English.
  expect(boxOf(dateFormat).dataset.label).toBe('Date Format');
  expect(boxOf(dateFormat).dataset.choices?.split('\n')).toEqual([
    ...DateTimeFormat.ForUser.DateFormat_List,
  ]);
  expect(boxOf(dateFormat).style.minWidth).toBe('150px');
  expect(boxOf(clock).dataset.label).toBe('12- or 24-hour');
  expect(boxOf(clock).dataset.choices?.split('\n')).toEqual([
    '12-hour',
    '24-hour',
  ]);
  expect(boxOf(clock).style.minWidth).toBe('110px');
});

it('names the fields and the choices of the clock in the language', async () => {
  await act(() => applyLanguage('ja'));
  render(<UserSettings />);
  const clock = screen.getByRole('combobox', { name: '12/24 時間制' });
  expect(clock.textContent).toBe('24 時間制');
  // The box follows the language: it is as wide as these texts need.
  expect(boxOf(clock).dataset.label).toBe('12/24 時間制');
  expect(boxOf(clock).dataset.choices).toBe('12 時間制\n24 時間制');

  fireEvent.mouseDown(clock);
  expect(
    within(screen.getByRole('listbox'))
      .getAllByRole('option')
      .map((option) => option.textContent),
  ).toEqual(['12 時間制', '24 時間制']);
});

it('saves the choice of the clock, and shows a date with it', () => {
  render(<UserSettings />);
  // The example's hour depends on where the test runs; its form does not.
  expect(screen.getByText(/^2019-11-2\d \w+ \d\d:53:29$/)).toBeTruthy();

  fireEvent.mouseDown(screen.getByRole('combobox', { name: '12- or 24-hour' }));
  fireEvent.click(screen.getByRole('option', { name: '12-hour' }));

  expect(localStorage.getItem('ClockSystemFormat')).toContain('12-hour');
  expect(screen.getByText(/^2019-11-2\d \w+ \d\d:53:29 [ap]m$/)).toBeTruthy();
});
