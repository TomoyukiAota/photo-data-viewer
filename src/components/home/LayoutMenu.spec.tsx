import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  act,
  fireEvent,
  render as renderWithoutTheme,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import { trackChangedUserSetting } from '../../analytics/track-event';
import { applyLanguage } from '../../i18n/i18n';
import LayoutMenu from './LayoutMenu';

// What is recorded is checked here, and sent nowhere.
jest.mock('../../analytics/track-event');

afterEach(async () => {
  await act(() => applyLanguage('en'));
  localStorage.clear();
  jest.clearAllMocks();
});

/** The icon on the button, by MUI's test id of the icon: the chosen mode's. */
const iconOf = (button: HTMLElement) =>
  button.querySelector('svg')?.getAttribute('data-testid');

// MUI draws a ripple where the keyboard's focus goes, a moment later, which
// React reports as an update outside act. It is only drawn, so it is left out.
const noRipple = createTheme({
  components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
});
const render = (ui: React.ReactElement) =>
  renderWithoutTheme(<ThemeProvider theme={noRipple}>{ui}</ThemeProvider>);

/** Opens the menu as the keyboard does, with the focus on the button first. */
function openMenu(button: HTMLElement) {
  act(() => button.focus());
  fireEvent.click(button);
  return screen.getByRole('menu');
}

it('is a button with the word for a layout under the chosen mode’s icon, which says that it opens a menu', () => {
  render(<LayoutMenu />);
  const button = screen.getByRole('button', { name: 'layout' });
  expect(button.textContent).toBe('LAYOUT');
  expect(iconOf(button)).toBe('AutoModeIcon');
  expect(button.getAttribute('aria-haspopup')).toBe('true');
  expect(button.getAttribute('aria-expanded')).toBeNull();
  expect(button.getAttribute('aria-controls')).toBeNull();
});

it('opens a menu named by the button, of the three modes as radio items, with the focus on the chosen one', () => {
  render(<LayoutMenu />);
  const button = screen.getByRole('button', { name: 'layout' });
  const menu = openMenu(button);
  expect(screen.getByRole('menu', { name: 'layout' })).toBe(menu);
  expect(button.getAttribute('aria-expanded')).toBe('true');
  const controlled = document.getElementById(
    button.getAttribute('aria-controls')!,
  );
  expect(controlled?.contains(menu)).toBe(true);

  const items = within(menu).getAllByRole('menuitemradio');
  expect(items.map((item) => item.getAttribute('aria-checked'))).toEqual([
    'true',
    'false',
    'false',
  ]);
  // Each is named by its name alone; the automatic one says what it does.
  const auto = within(menu).getByRole('menuitemradio', {
    name: 'Automatic',
    description: 'Split panes in a wide window, a single pane in a narrow one',
    checked: true,
  });
  expect(
    within(menu).getByRole('menuitemradio', {
      name: 'Split panes',
      checked: false,
    }),
  ).toBe(items[1]);
  expect(
    within(menu).getByRole('menuitemradio', {
      name: 'Single pane',
      checked: false,
    }),
  ).toBe(items[2]);
  expect(auto).toBe(items[0]);
  expect(document.activeElement).toBe(auto);
});

it('stores the mode chosen, records the change, closes the menu and leaves the focus on the button, which shows the mode', async () => {
  render(<LayoutMenu />);
  const button = screen.getByRole('button', { name: 'layout' });
  const menu = openMenu(button);
  fireEvent.click(
    within(menu).getByRole('menuitemradio', { name: 'Single pane' }),
  );

  expect(localStorage.getItem('LayoutMode')).toBe('singlePane');
  expect(jest.mocked(trackChangedUserSetting).mock.calls).toEqual([
    ['LayoutMode', 'singlePane'],
  ]);
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  expect(document.activeElement).toBe(button);
  expect(iconOf(button)).toBe('TabIcon');

  // Opened again, the menu has the mode chosen checked. That the focus is on
  // it then is checked in the browser suite: MUI's menu, which registers its
  // entries one by one, finds the checked one later in jsdom than in a
  // browser.
  const reopened = openMenu(button);
  expect(
    within(reopened).getByRole('menuitemradio', {
      name: 'Single pane',
      checked: true,
    }),
  ).toBeTruthy();
  fireEvent.click(
    within(reopened).getByRole('menuitemradio', { name: 'Split panes' }),
  );
  expect(localStorage.getItem('LayoutMode')).toBe('splitPanes');
  expect(iconOf(button)).toBe('SplitPanesIcon');
});

it('records nothing when the mode chosen is the one that was chosen', async () => {
  localStorage.setItem('LayoutMode', 'splitPanes');
  render(<LayoutMenu />);
  const menu = openMenu(screen.getByRole('button', { name: 'layout' }));
  fireEvent.click(
    within(menu).getByRole('menuitemradio', { name: 'Split panes' }),
  );
  await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
  expect(localStorage.getItem('LayoutMode')).toBe('splitPanes');
});

it('is in the language that the app is shown in', async () => {
  await act(() => applyLanguage('ja'));
  render(<LayoutMenu />);
  const button = screen.getByRole('button', { name: 'レイアウト' });
  expect(button.textContent).toBe('レイアウト');
  const menu = openMenu(button);
  expect(screen.getByRole('menu', { name: 'レイアウト' })).toBe(menu);
  expect(
    within(menu)
      .getAllByRole('menuitemradio')
      .map(
        (item) => item.querySelector('.MuiListItemText-primary')?.textContent,
      ),
  ).toEqual(['自動', '表示領域を分割する', '表示領域を分割しない']);
});
