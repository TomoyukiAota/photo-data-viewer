import { menuClasses } from '@mui/material/Menu';
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
import { restToClose, restToOpen } from './useSubmenuHover';

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

it('has the entry Layout after Demo, before Language and Settings, with the icon of the split panes, and says that it opens a menu', () => {
  render();
  const menu = openMenu();
  const names = within(menu)
    .getAllByRole('menuitem')
    .map((item) => item.textContent);
  expect(names).toEqual([
    'Home',
    'Demo',
    'Layout',
    'Language',
    'Settings',
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

// TL;DR: With a mouse, the submenu opens when the pointer rests on its entry,
// and closes when the pointer goes on to another entry, unless it is on its
// way to the submenu (useSubmenuHover.ts).
// Details: jsdom lays nothing out, so the submenu is given the box that it has
// at 1280 pixels in English, on the left of the menu, from the top of its
// entry down. The entry is 36 pixels high, and Language is under it.
describe('with a mouse', () => {
  /**
   * jsdom has no PointerEvent: a mouse's event that has the pointer's type
   * stands in for it, which React reads as it reads a pointer's event.
   */
  class PointerEventInJsdom extends MouseEvent {
    readonly pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? '';
    }
  }
  const hasPointerEvent = 'PointerEvent' in window;

  beforeAll(() => {
    if (!hasPointerEvent) {
      Object.assign(window, { PointerEvent: PointerEventInJsdom });
    }
  });

  afterAll(() => {
    if (!hasPointerEvent) {
      delete (window as { PointerEvent?: unknown }).PointerEvent;
    }
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  /** The pointer of a mouse, moved to the point over the element. */
  const moveMouse = (element: Element, clientX = 0, clientY = 0) =>
    fireEvent.pointerMove(element, { pointerType: 'mouse', clientX, clientY });

  /** The pointer of a mouse, moved off the element at the point. */
  const leaveWithMouse = (element: Element, clientX: number, clientY: number) =>
    fireEvent.pointerLeave(element, {
      pointerType: 'mouse',
      clientX,
      clientY,
    });

  /** The pointer rests, or goes on, for the time given. */
  const rest = (milliseconds: number) =>
    act(() => jest.advanceTimersByTime(milliseconds));

  /**
   * The menu's entry Language, under the entry Layout. A mouse reaches it
   * while the submenu is open, though the submenu hides the menu from a
   * screen reader then.
   */
  const language = () =>
    screen.getByRole('menuitem', { name: 'Language', hidden: true });

  /** Opens the submenu with the pointer resting on its entry, and returns the two. */
  function openByHover() {
    const entry = layoutEntry();
    moveMouse(entry);
    rest(restToOpen);
    const submenu = screen.getByRole('menu', { name: 'Layout' });
    // Laid out as at 1280 pixels in English.
    const paper = submenu.closest<HTMLElement>(`.${menuClasses.paper}`)!;
    Object.defineProperties(paper, {
      offsetLeft: { value: 629 },
      offsetTop: { value: 174 },
      offsetWidth: { value: 442 },
      offsetHeight: { value: 144 },
    });
    return { entry, submenu };
  }

  it('opens the submenu once the pointer has rested on its entry, with the focus on the chosen layout, and the arrow back gives the focus to the entry', async () => {
    render();
    openMenu();
    const entry = layoutEntry();
    moveMouse(entry);
    rest(restToOpen - 1);
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    rest(1);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
    const submenu = screen.getByRole('menu', { name: 'Layout' });
    const auto = within(submenu).getByRole('menuitemradio', {
      name: 'Automatic',
    });
    expect(document.activeElement).toBe(auto);

    fireEvent.keyDown(auto, { key: 'ArrowLeft' });
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(1));
    expect(document.activeElement).toBe(entry);
  });

  it('does not open the submenu for a pointer that passes over its entry', () => {
    render();
    openMenu();
    const entry = layoutEntry();
    moveMouse(entry);
    rest(restToOpen - 10);
    moveMouse(entry);
    rest(restToOpen - 10);
    // On the entry for longer than a rest, without resting.
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    leaveWithMouse(entry, 1180, 210);
    moveMouse(language(), 1180, 228);
    rest(1000);
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it('leaves a touch, which has no hover, to open the submenu with a tap', () => {
    render();
    openMenu();
    const entry = layoutEntry();
    fireEvent.pointerMove(entry, { pointerType: 'touch' });
    rest(1000);
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(entry);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the submenu at once when the pointer goes on to another entry, away from the submenu, and gives the focus back to its entry', async () => {
    render();
    openMenu();
    const { entry } = openByHover();
    // Straight down, to Language.
    leaveWithMouse(entry, 1180, 210);
    moveMouse(language(), 1180, 228);
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(1));
    expect(document.activeElement).toBe(entry);
  });

  it('keeps the submenu open while the pointer crosses another entry on its way to the submenu, or is beside the menus', () => {
    render();
    openMenu();
    const { entry, submenu } = openByHover();
    // Down and to the left, over Language.
    leaveWithMouse(entry, 1180, 210);
    moveMouse(language(), 1150, 228);
    rest(restToClose - 1);
    moveMouse(language(), 1100, 240);
    rest(restToClose - 1);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
    // In the submenu.
    moveMouse(
      within(submenu).getByRole('menuitemradio', { name: 'Single pane' }),
      1000,
      288,
    );
    rest(1000);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
    // Beside the menus, on the menu's backdrop.
    const backdrop = document.querySelector(
      '#menu-appbar > .MuiBackdrop-root',
    )!;
    moveMouse(backdrop, 1000, 600);
    rest(1000);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the submenu when the pointer rests over another entry, though on its way to the submenu', () => {
    render();
    openMenu();
    const { entry } = openByHover();
    leaveWithMouse(entry, 1180, 210);
    moveMouse(language(), 1150, 228);
    rest(restToClose - 1);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
    rest(1);
    expect(entry.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the submenu open, with the focus in it, at a click on its entry', () => {
    render();
    openMenu();
    const { entry, submenu } = openByHover();
    // The press leaves the focus where it is.
    expect(fireEvent.mouseDown(entry)).toBe(false);
    fireEvent.click(entry);
    expect(entry.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(
      within(submenu).getByRole('menuitemradio', { name: 'Automatic' }),
    );
  });

  it('closes the submenu at a press on another entry, whose click opens its page and closes the menu', async () => {
    render();
    openMenu();
    const { entry } = openByHover();
    fireEvent.pointerDown(language(), { pointerType: 'mouse' });
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(language());
    expect(push.mock.calls).toEqual([['/language']]);
    await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0));
  });

  it('closes the submenu alone at a click beside the menus, which reaches the menu’s backdrop', async () => {
    render();
    openMenu();
    const { entry } = openByHover();
    fireEvent.click(
      document.querySelector('#menu-appbar > .MuiBackdrop-root')!,
    );
    expect(entry.getAttribute('aria-expanded')).toBe('false');
    rest(1000);
    // The menu stays open.
    expect(screen.getAllByRole('menu')).toHaveLength(1);
    expect(layoutEntry()).toBe(entry);
  });

  it('does not open the submenu for a rest on its entry from before it was opened and closed in another way, or before the menu closed, or in the menu that is closing', async () => {
    render();
    openMenu();
    const entry = layoutEntry();
    moveMouse(entry);
    act(() => entry.focus());
    fireEvent.click(entry);
    const submenu = screen.getByRole('menu', { name: 'Layout' });
    fireEvent.keyDown(
      within(submenu).getByRole('menuitemradio', { name: 'Automatic' }),
      { key: 'ArrowLeft' },
    );
    rest(1000);
    expect(entry.getAttribute('aria-expanded')).toBe('false');

    moveMouse(entry);
    fireEvent.keyDown(entry, { key: 'Escape' });
    moveMouse(entry);
    rest(1000);
    await waitFor(() => expect(screen.queryAllByRole('menu')).toHaveLength(0));
  });
});
