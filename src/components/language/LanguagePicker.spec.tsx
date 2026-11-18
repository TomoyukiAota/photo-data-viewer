import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';

import {
  trackChangedLanguageInUse,
  trackChangedUserSetting,
} from '../../analytics/track-event';
import PhotoContext from '../../context/photo/photo-context';
import i18next, { applyLanguage, loadLanguage } from '../../i18n/i18n';
import LanguagePicker from './LanguagePicker';

// What the button records is checked here, and sent nowhere.
jest.mock('../../analytics/track-event');

// The language is fetched as in the app, unless a test makes it fail.
jest.mock('../../i18n/i18n', () => {
  const actual = jest.requireActual('../../i18n/i18n');
  return {
    __esModule: true,
    ...actual,
    loadLanguage: jest.fn(actual.loadLanguage),
  };
});

// A choice is the Language page's (useLanguageChoice), which reads the
// language of the address from the router; its address is checked there.
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
beforeEach(() => {
  jest.mocked(useRouter).mockImplementation(
    () =>
      ({
        locale: undefined,
        asPath: '/',
        push: jest.fn(),
      }) as unknown as NextRouter,
  );
});

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  await act(() => applyLanguage('en'));
});

const reloadPhoto = jest.fn();

function renderPicker() {
  return render(
    <PhotoContext.Provider
      value={{
        loadedPhotoData: null,
        loadedPhotoImage: <div />,
        loadPhoto: () => {},
        reloadPhoto,
      }}
    >
      <LanguagePicker />
    </PhotoContext.Provider>,
  );
}

const button = (name = 'Language English') =>
  screen.getByRole('button', { name });

it('is a button with the name of the language shown, which says that it opens a dialog', () => {
  renderPicker();
  const picker = button();
  expect(picker.textContent).toBe('LanguageEnglish');
  expect(picker.querySelector('[data-testid="LanguageIcon"]')).toBeTruthy();
  expect(picker.getAttribute('aria-haspopup')).toBe('dialog');
  expect(picker.getAttribute('aria-expanded')).toBe('false');
  expect(picker.getAttribute('aria-controls')).toBeNull();
});

it('opens a box named Language, with the search field above the list of languages and the chosen entry chosen', () => {
  renderPicker();
  // While the box is open, what is under it is hidden from a screen reader,
  // as MUI hides what is under a dialog.
  const picker = button();
  fireEvent.click(picker);
  const dialog = screen.getByRole('dialog', { name: 'Language' });
  expect(picker.getAttribute('aria-expanded')).toBe('true');
  expect(
    document
      .getElementById(picker.getAttribute('aria-controls')!)
      ?.contains(dialog),
  ).toBe(true);
  expect(
    within(dialog).getByRole('searchbox', { name: 'Search' }),
  ).toBeTruthy();
  const list = within(dialog).getByRole('listbox', { name: 'Language' });
  expect(
    within(list)
      .getAllByRole('option')
      .filter((option) => option.getAttribute('aria-selected') === 'true')
      .map((option) => option.textContent),
  ).toEqual(['Use browser setting (English)']);
});

it('shows the app in the language chosen, saves and records it, and closes the box', async () => {
  renderPicker();
  fireEvent.click(button());
  await act(async () => {
    fireEvent.click(screen.getByRole('option', { name: '日本語' }));
  });

  expect(i18next.language).toBe('ja');
  expect(localStorage.getItem('Language')).toBe('ja');
  expect(jest.mocked(trackChangedUserSetting).mock.calls).toEqual([
    ['Language', 'ja'],
  ]);
  expect(jest.mocked(trackChangedLanguageInUse).mock.calls).toEqual([['ja']]);
  expect(reloadPhoto).toHaveBeenCalled();
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(button('言語 日本語')).toBeTruthy();
});

it('says so in the box, which stays open, when the language cannot be fetched', async () => {
  jest.mocked(loadLanguage).mockRejectedValueOnce(new Error('offline'));
  renderPicker();
  fireEvent.click(button());
  await act(async () => {
    fireEvent.click(screen.getByRole('option', { name: 'Deutsch' }));
  });

  const dialog = screen.getByRole('dialog', { name: 'Language' });
  expect(within(dialog).getByRole('alert').textContent).toBe(
    'The language could not be loaded. Check your connection, then try again.',
  );
  expect(i18next.language).toBe('en');
  expect(localStorage.getItem('Language')).toBe('auto');
});

it('closes the box with Escape, without a choice', async () => {
  renderPicker();
  fireEvent.click(button());
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(button().getAttribute('aria-expanded')).toBe('false');
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
});
