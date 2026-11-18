import { act, render, screen, within } from '@testing-library/react';

import { applyLanguage } from '../../i18n/i18n';
import Header from './Header';

afterEach(() => act(() => applyLanguage('en')));

it('says what to do, and has the button that selects a photo', () => {
  render(<Header />);
  expect(screen.getByText('Select your photo to display EXIF data.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Select Photo' })).toBeTruthy();
});

it("has the layout's button after its texts, and keeps room for the menu's button after it, as wide as the button is in the language", async () => {
  const { container } = render(<Header />);
  const header = container.firstElementChild as HTMLElement;
  const [texts, layout, room] = Array.from(header.children) as HTMLElement[];
  expect(header.children).toHaveLength(3);

  // The texts first, then the layout's button, right before the menu's
  // button, which lies over the header where the room is.
  expect(texts.textContent).toContain('Select Photo');
  expect(within(layout).getByRole('button', { name: 'layout' })).toBeTruthy();
  // The menu's button's own content, so that the room is as wide as the
  // button; not read aloud, and no button itself.
  expect(room.textContent).toBe('MENU');
  expect(room.getAttribute('aria-hidden')).toBe('true');
  expect(screen.getAllByRole('button')).toHaveLength(2);

  await act(() => applyLanguage('ja'));
  expect(within(layout).getByRole('button', { name: 'レイアウト' })).toBeTruthy();
  expect(room.textContent).toBe('メニュー');
});
