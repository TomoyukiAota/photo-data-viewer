import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  act,
  fireEvent,
  render as renderWithoutTheme,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';

import { trackChangedUserSetting } from '../../analytics/track-event';
import { applyLanguage } from '../../i18n/i18n';
import AppMenu from './AppMenu';

// What is recorded is checked here, and sent nowhere.
jest.mock('../../analytics/track-event');

// The menu opens pages with the router, and marks the one shown.
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
const push = jest.fn();
beforeEach(() => {
  jest
    .mocked(useRouter)
    .mockImplementation(
      () => ({ pathname: '/', push }) as unknown as NextRouter,
    );
});

afterEach(async () => {
  await act(() => applyLanguage('en'));
  localStorage.clear();
  jest.clearAllMocks();
});

// MUI draws a ripple where the keyboard's focus goes, a moment later, which
// React reports as an update outside act. It is only drawn, so it is left out.
const noRipple = createTheme({
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
});
const render = () =>
  renderWithoutTheme(
    <ThemeProvider theme={noRipple}>
      <AppMenu isVisible />
    </ThemeProvider>,
  );

/** Opens the menu with its button, and returns the menu. */
function openMenu(name = 'menu') {
  fireEvent.click(screen.getByRole('button', { name }));
  return screen.getByRole('menu');
}

/** The menu's entry Layout. */
const layoutEntry = (name = 'Layout') => screen.getByRole('menuitem', { name });

/**
 * Opens the submenu of the layouts from its entry, as the keyboard does, and
 * returns the two. While the submenu is open, the menu under it is hidden from
 * a screen reader, as MUI hides what is under a menu.
 */
function openSubmenu(name = 'Layout') {
  const entry = layoutEntry(name);
  act(() => entry.focus());
  fireEvent.click(entry);
  return { entry, submenu: screen.getByRole('menu', { name }) };
}

it('has the entry Layout after the entry Language, with the icon of the split panes, and says that it opens a menu', () => {
  render();
  const menu = openMenu();
  const names = within(menu)
    .getAllByRole('menuitem')
    .map((item) => item.textContent);
  expect(names).toEqual([
    'Home',
    'Demo',
    'Settings',
    'Language',
    'Layout',
    'About',
    'Credits',
  ]);
  const entry = layoutEntry();
  expect(entry.querySelector('[data-testid="SplitPanesIcon"]')).toBeTruthy();
  expect(entry.getAttribute('aria-haspopup')).toBe('menu');
  expect(entry.getAttribute('aria-expanded')).toBe('false');
});

it('opens the submenu of the three layouts, named by its entry, as radio items with the focus on the chosen one, and without icons', () => {
  render();
  openMenu();
  const { entry, submenu } = openSubmenu();
  expect(entry.getAttribute('aria-expanded')).toBe('true');
  expect(
    document
      .getElementById(entry.getAttribute('aria-controls')!)
      ?.contains(submenu),
  ).toBe(true);

  const items = within(submenu).getAllByRole('menuitemradio');
  expect(items.map((item) => item.getAttribute('aria-checked'))).toEqual([
    'true',
    'false',
    'false',
  ]);
  const auto = within(submenu).getByRole('menuitemradio', {
    name: 'Automatic',
    description: 'Split panes in a wide window, a single pane in a narrow one',
    checked: true,
  });
  expect(auto).toBe(items[0]);
  expect(
    within(submenu).getByRole('menuitemradio', { name: 'Split panes' }),
  ).toBe(items[1]);
  expect(
    within(submenu).getByRole('menuitemradio', { name: 'Single pane' }),
  ).toBe(items[2]);
  expect(document.activeElement).toBe(auto);
  // No icon but the check mark, which only the chosen one shows.
  for (const item of items) {
    const icons = item.querySelectorAll('svg');
    expect(Array.from(icons).map((icon) => icon.dataset.testid)).toEqual([
      'CheckIcon',
    ]);
  }
});

it('stores the layout chosen, records the change, and closes the submenu and the menu', async () => {
  render();
  openMenu();
  const { submenu } = openSubmenu();
  fireEvent.click(
    within(submenu).getByRole('menuitemradio', { name: 'Single pane' }),
  );

  expect(localStorage.getItem('LayoutMode')).toBe('singlePane');
  expect(jest.mocked(trackChangedUserSetting).mock.calls).toEqual([
    ['LayoutMode', 'singlePane'],
  ]);
  await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0));
  expect(push).not.toHaveBeenCalled();

  // Opened again, the submenu has the layout chosen checked.
  openMenu();
  const { submenu: reopened } = openSubmenu();
  expect(
    within(reopened).getByRole('menuitemradio', {
      name: 'Single pane',
      checked: true,
    }),
  ).toBeTruthy();
});

it('records nothing when the layout chosen is the one that was chosen', async () => {
  localStorage.setItem('LayoutMode', 'splitPanes');
  render();
  openMenu();
  const { submenu } = openSubmenu();
  fireEvent.click(
    within(submenu).getByRole('menuitemradio', { name: 'Split panes' }),
  );
  await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0));
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
});

it('opens the submenu with the arrow towards it, and closes it alone with the arrow back', async () => {
  render();
  openMenu();
  const entry = layoutEntry();
  act(() => entry.focus());
  fireEvent.keyDown(entry, { key: 'ArrowRight' });
  const submenu = screen.getByRole('menu', { name: 'Layout' });
  expect(entry.getAttribute('aria-expanded')).toBe('true');

  fireEvent.keyDown(
    within(submenu).getByRole('menuitemradio', { name: 'Automatic' }),
    { key: 'ArrowLeft' },
  );
  await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(1));
  expect(entry.getAttribute('aria-expanded')).toBe('false');
});

it("opens the submenu towards a line's end in a language written from right to left: with the left arrow", async () => {
  await act(() => applyLanguage('ar'));
  render();
  openMenu('القائمة');
  const entry = layoutEntry('التخطيط');
  act(() => entry.focus());
  fireEvent.keyDown(entry, { key: 'ArrowRight' });
  expect(entry.getAttribute('aria-expanded')).toBe('false');
  fireEvent.keyDown(entry, { key: 'ArrowLeft' });
  expect(entry.getAttribute('aria-expanded')).toBe('true');
});

it('is in the language that the app is shown in', async () => {
  await act(() => applyLanguage('ja'));
  render();
  openMenu('メニュー');
  const { submenu } = openSubmenu('レイアウト');
  expect(
    within(submenu)
      .getAllByRole('menuitemradio')
      .map(
        (item) => item.querySelector('.MuiListItemText-primary')?.textContent,
      ),
  ).toEqual(['自動', '表示領域を分割する', '表示領域を分割しない']);
});
