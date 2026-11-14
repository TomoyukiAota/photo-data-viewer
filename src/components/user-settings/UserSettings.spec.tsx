import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { applyLanguage } from '../../i18n/i18n';
import UserSettings from './UserSettings';

// What the page records is checked elsewhere, and sent nowhere.
jest.mock('../../analytics/track-event');

afterEach(async () => {
  localStorage.clear();
  await act(() => applyLanguage('en'));
});

/** The box around a field, which lays out the field's label to be as wide as it needs. */
function boxOf(field: HTMLElement): HTMLElement {
  return field.closest('[data-label]') as HTMLElement;
}

it('has each field of the date and time in a box that knows its label, which the field is then as wide as', () => {
  render(<UserSettings />);
  const dateFormat = screen.getByRole('combobox', { name: 'Date Format' });
  const clock = screen.getByRole('combobox', { name: '12- or 24-hour' });

  expect(dateFormat.textContent).toBe('YYYY-MM-DD');
  expect(clock.textContent).toBe('24-hour');

  // The box has the label, and is never narrower than the field is in
  // English.
  expect(boxOf(dateFormat).dataset.label).toBe('Date Format');
  expect(boxOf(dateFormat).style.minWidth).toBe('150px');
  expect(boxOf(clock).dataset.label).toBe('12- or 24-hour');
  expect(boxOf(clock).style.minWidth).toBe('110px');
});

it('names the fields and the choices of the clock in the language', async () => {
  await act(() => applyLanguage('ja'));
  render(<UserSettings />);
  const clock = screen.getByRole('combobox', { name: '12/24 時間制' });
  expect(clock.textContent).toBe('24 時間制');
  // The box follows the language: it is as wide as this label needs.
  expect(boxOf(clock).dataset.label).toBe('12/24 時間制');

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
