import { act, fireEvent, render, screen, within } from '@testing-library/react';

import { applyLanguage } from '../../i18n/i18n';
import UserSettings from './UserSettings';

// What the page records is checked elsewhere, and sent nowhere.
jest.mock('../../analytics/track-event');

afterEach(async () => {
  localStorage.clear();
  await act(() => applyLanguage('en'));
});

it('names each field of the date and time by the text above it', () => {
  render(<UserSettings />);
  const dateFormat = screen.getByRole('combobox', { name: 'Date Format' });
  const clock = screen.getByRole('combobox', { name: '12- or 24-hour' });

  expect(dateFormat.textContent).toBe('YYYY-MM-DD');
  expect(clock.textContent).toBe('24-hour');
  // The name is a text of the page before its field, where it can take as
  // many lines as a language's name needs; it is not drawn on the field.
  for (const [field, name] of [
    [dateFormat, 'Date Format'],
    [clock, '12- or 24-hour'],
  ] as const) {
    const label = screen.getByText(name);
    expect(label.tagName).not.toBe('LABEL');
    expect(
      label.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
});

it('names the fields and the choices of the clock in the language', async () => {
  await act(() => applyLanguage('ja'));
  render(<UserSettings />);
  const clock = screen.getByRole('combobox', { name: '12/24 時間制' });
  expect(clock.textContent).toBe('24 時間制');

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
