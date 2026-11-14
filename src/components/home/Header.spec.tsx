import { act, render, screen } from '@testing-library/react';

import { applyLanguage } from '../../i18n/i18n';
import Header from './Header';

afterEach(() => act(() => applyLanguage('en')));

it('says what to do, and has the button that selects a photo', () => {
  render(<Header />);
  expect(screen.getByText('Select your photo to display EXIF data.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Select Photo' })).toBeTruthy();
});

it("keeps room for the menu's button after its texts, as wide as the button is in the language", async () => {
  const { container } = render(<Header />);
  const header = container.firstElementChild as HTMLElement;
  const room = header.lastElementChild as HTMLElement;

  // The button's own content, so that it is as wide as the button; not read aloud, and no button itself.
  expect(room.textContent).toBe('MENU');
  expect(room.getAttribute('aria-hidden')).toBe('true');
  expect(screen.getAllByRole('button')).toHaveLength(1);
  // After the texts, where the menu's button lies over the header.
  expect(header.firstElementChild?.textContent).toContain('Select Photo');

  await act(() => applyLanguage('ja'));
  expect(room.textContent).toBe('メニュー');
});
