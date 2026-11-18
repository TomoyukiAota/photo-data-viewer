import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { AppIntegration } from '../../app-integration/app-integration';
import DropHintButton from './DropHintButton';

const LABEL = 'About drag and drop';
const FROM_FINDER = 'You can also drag and drop a file from Finder to select it.';
const FROM_FILE_EXPLORER = 'You can also drag and drop a file from File Explorer to select it.';

/** A main pointer that is a mouse or a trackpad (`fine`), or a finger. jsdom has no matchMedia of its own. */
function setPointer(fine: boolean) {
  window.matchMedia = jest.fn((query: string) => ({
    matches: fine && query.includes('pointer: fine'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

/** What the browser says that it runs on. */
function setPlatform(platform: string, userAgent = 'Mozilla/5.0') {
  jest.spyOn(Navigator.prototype, 'platform', 'get').mockReturnValue(platform);
  jest.spyOn(Navigator.prototype, 'userAgent', 'get').mockReturnValue(userAgent);
}

const button = () => screen.queryByRole('button', { name: LABEL });

afterEach(() => {
  jest.restoreAllMocks();
  delete (window as Partial<Window>).matchMedia;
});

it('says, in a box under it, that a file can be dragged from File Explorer, on Windows', () => {
  setPointer(true);
  setPlatform('Win32');
  render(<DropHintButton />);
  // Kept: while the box is open, MUI hides what is outside it from screen readers, the button too.
  const opener = button() as HTMLElement;
  expect(opener.getAttribute('aria-expanded')).toBe('false');

  fireEvent.click(opener);
  const box = screen.getByRole('dialog', { name: FROM_FILE_EXPLORER });
  expect(opener.getAttribute('aria-expanded')).toBe('true');
  const controlled = document.getElementById(opener.getAttribute('aria-controls') as string);
  expect(controlled?.contains(box)).toBe(true);
});

it('says Finder on a Mac', () => {
  setPointer(true);
  // jsdom has touch events, which an iPad that says it is a Mac is told by, with the user agent's "Mac" (isIos).
  setPlatform('MacIntel');
  render(<DropHintButton />);
  fireEvent.click(button() as HTMLElement);
  expect(screen.getByRole('dialog', { name: FROM_FINDER })).toBeTruthy();
});

it('says File Explorer on any other system, which has no Finder', () => {
  setPointer(true);
  setPlatform('Linux x86_64');
  render(<DropHintButton />);
  fireEvent.click(button() as HTMLElement);
  expect(screen.getByRole('dialog', { name: FROM_FILE_EXPLORER })).toBeTruthy();
});

it('closes with Escape, which gives the focus back to the button, and when a file is dragged into the window', async () => {
  setPointer(true);
  setPlatform('Win32');
  render(<DropHintButton />);
  const opened = button() as HTMLElement;
  opened.focus();

  fireEvent.click(opened);
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(document.activeElement).toBe(opened);
  expect(opened.getAttribute('aria-expanded')).toBe('false');

  // The box is a dialog, over which the page would refuse a dropped file (DropPhoto.tsx).
  fireEvent.click(opened);
  expect(screen.getByRole('dialog')).toBeTruthy();
  act(() => {
    window.dispatchEvent(new Event('dragenter'));
  });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('is not there where the main pointer is a finger, or where the browser cannot tell', () => {
  setPlatform('Win32');
  const { unmount } = render(<DropHintButton />);
  expect(button()).toBeNull(); // No matchMedia.
  unmount();

  setPointer(false);
  render(<DropHintButton />);
  expect(button()).toBeNull();
});

it('is not there on an iPad, which says that it is a Mac, with a trackpad too', () => {
  setPointer(true);
  setPlatform('MacIntel', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
  expect('ontouchend' in document).toBe(true); // As an iPad has, and jsdom.
  render(<DropHintButton />);
  expect(button()).toBeNull();
});

it('is not there in Photo Location Map, which takes no dropped file', () => {
  setPointer(true);
  setPlatform('Win32');
  jest.spyOn(AppIntegration, 'isStandalone', 'get').mockReturnValue(false);
  render(<DropHintButton />);
  expect(button()).toBeNull();
});
