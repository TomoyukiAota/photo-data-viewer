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
import { useLayoutMode } from '../../hooks/useLayoutMode';
import { writeStorage } from '../../hooks/useLocalStorage';
import { applyLanguage } from '../../i18n/i18n';
import LayoutButton, { LayoutButtonFocus } from './LayoutButton';

// What is recorded is checked here, and sent nowhere.
jest.mock('../../analytics/track-event');

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
const render = (ui: React.ReactNode) =>
  renderWithoutTheme(<ThemeProvider theme={noRipple}>{ui}</ThemeProvider>);

/**
 * The button in one place or another by the layout, as the Home page draws
 * it at the end of the data's tabs beside the split panes, and at the end of
 * the single pane's tabs: in elements of their own, as the two layouts are.
 */
const InTheLayoutsTabs: React.FC<{ focus: LayoutButtonFocus }> = (props) => {
  const layoutMode = useLayoutMode();
  return layoutMode === 'singlePane' ? (
    <div key='single-pane' data-testid='single-pane'>
      <LayoutButton focus={props.focus} />
    </div>
  ) : (
    <div key='split-panes' data-testid='split-panes'>
      <LayoutButton focus={props.focus} />
    </div>
  );
};

/** Opens the menu with the button, as the keyboard does, and returns the two. */
function openMenu(name = 'Layout') {
  const button = screen.getByRole('button', { name });
  act(() => button.focus());
  fireEvent.click(button);
  return { button, menu: screen.getByRole('menu', { name }) };
}

/**
 * Waits until the menu has closed: until it has left the page, after it is
 * hidden from a screen reader as it closes.
 */
async function untilClosed() {
  await waitFor(() =>
    expect(screen.queryAllByRole('menu', { hidden: true })).toHaveLength(0),
  );
}

/** Chooses a layout in the open menu, and waits until the menu has closed. */
async function choose(menu: HTMLElement, name: string) {
  fireEvent.click(within(menu).getByRole('menuitemradio', { name }));
  await untilClosed();
}

it('is a button named Layout, with the icon of the split panes, that says it opens a menu', () => {
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const button = screen.getByRole('button', { name: 'Layout' });
  expect(button.querySelector('[data-testid="SplitPanesIcon"]')).toBeTruthy();
  expect(button.getAttribute('aria-haspopup')).toBe('menu');
  expect(button.getAttribute('aria-expanded')).toBe('false');
});

it('opens the three layouts, named by the button, as radio items with the focus on the chosen one', () => {
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const { button, menu } = openMenu();
  expect(button.getAttribute('aria-expanded')).toBe('true');
  expect(
    document
      .getElementById(button.getAttribute('aria-controls')!)
      ?.contains(menu),
  ).toBe(true);

  const items = within(menu).getAllByRole('menuitemradio');
  expect(items.map((item) => item.getAttribute('aria-checked'))).toEqual([
    'true',
    'false',
    'false',
  ]);
  const auto = within(menu).getByRole('menuitemradio', {
    name: 'Automatic',
    description: 'Split panes in a wide window, a single pane in a narrow one',
    checked: true,
  });
  expect(auto).toBe(items[0]);
  expect(within(menu).getByRole('menuitemradio', { name: 'Split panes' })).toBe(
    items[1],
  );
  expect(within(menu).getByRole('menuitemradio', { name: 'Single pane' })).toBe(
    items[2],
  );
  expect(document.activeElement).toBe(auto);
});

it('keeps the icon of the split panes whichever layout is chosen', () => {
  localStorage.setItem('LayoutMode', 'singlePane');
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const button = screen.getByRole('button', { name: 'Layout' });
  expect(
    Array.from(button.querySelectorAll('svg')).map(
      (icon) => icon.dataset.testid,
    ),
  ).toEqual(['SplitPanesIcon']);
});

it('stores the layout chosen once the menu is closed, records the change, and gives the focus back to the button', async () => {
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const { button, menu } = openMenu();
  fireEvent.click(
    within(menu).getByRole('menuitemradio', { name: 'Single pane' }),
  );
  expect(localStorage.getItem('LayoutMode')).toBe('auto');

  await untilClosed();
  expect(localStorage.getItem('LayoutMode')).toBe('singlePane');
  expect(jest.mocked(trackChangedUserSetting).mock.calls).toEqual([
    ['LayoutMode', 'singlePane'],
  ]);
  expect(document.activeElement).toBe(button);

  // Opened again, the menu has the layout chosen checked.
  const { menu: reopened } = openMenu();
  expect(
    within(reopened).getByRole('menuitemradio', {
      name: 'Single pane',
      checked: true,
    }),
  ).toBeTruthy();
});

it('records nothing when the layout chosen is the one in use', async () => {
  localStorage.setItem('LayoutMode', 'splitPanes');
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const { menu } = openMenu();
  await choose(menu, 'Split panes');
  expect(localStorage.getItem('LayoutMode')).toBe('splitPanes');
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
});

it('closes with Escape, and leaves the layout as it is', async () => {
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const { button, menu } = openMenu();
  fireEvent.keyDown(
    within(menu).getByRole('menuitemradio', { name: 'Automatic' }),
    {
      key: 'Escape',
    },
  );
  await untilClosed();
  expect(localStorage.getItem('LayoutMode')).toBe('auto');
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(button);
});

// TL;DR: A new layout draws the button anew at the end of its own tabs, and
// that one has the focus.
// Details: The focus was on the button that the layout took away, which is
// not the same element.
it('gives the focus to the button that a new layout draws, when a layout is chosen with it', async () => {
  render(<InTheLayoutsTabs focus={new LayoutButtonFocus()} />);
  const { button, menu } = openMenu();
  expect(screen.getByTestId('split-panes').contains(button)).toBe(true);
  await choose(menu, 'Single pane');

  const drawnAnew = within(screen.getByTestId('single-pane')).getByRole(
    'button',
    {
      name: 'Layout',
    },
  );
  expect(drawnAnew).not.toBe(button);
  expect(document.activeElement).toBe(drawnAnew);

  // And back, with the keyboard alone.
  const { menu: reopened } = openMenu();
  await choose(reopened, 'Automatic');
  expect(document.activeElement).toBe(
    within(screen.getByTestId('split-panes')).getByRole('button', {
      name: 'Layout',
    }),
  );
});

it('leaves the focus where it is when the layout changes while the button does not have it', () => {
  render(
    <>
      <input aria-label='elsewhere' />
      <InTheLayoutsTabs focus={new LayoutButtonFocus()} />
    </>,
  );
  const elsewhere = screen.getByRole('textbox', { name: 'elsewhere' });
  act(() => elsewhere.focus());
  // As another window of Photo Location Map's viewer chooses the layout.
  act(() => writeStorage('LayoutMode', 'singlePane'));
  expect(screen.getByTestId('single-pane')).toBeTruthy();
  expect(document.activeElement).toBe(elsewhere);
});

it('is in the language that the app is shown in', async () => {
  await act(() => applyLanguage('ja'));
  render(<LayoutButton focus={new LayoutButtonFocus()} />);
  const { menu } = openMenu('レイアウト');
  expect(
    within(menu)
      .getAllByRole('menuitemradio')
      .map(
        (item) => item.querySelector('.MuiListItemText-primary')?.textContent,
      ),
  ).toEqual(['自動', '表示領域を分割する', '表示領域を分割しない']);
});
