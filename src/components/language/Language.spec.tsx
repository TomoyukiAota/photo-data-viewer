import { act, fireEvent, render, screen } from '@testing-library/react';
import { NextRouter, useRouter } from 'next/router';

import {
  trackChangedLanguageInUse,
  trackChangedUserSetting,
} from '../../analytics/track-event';
import PhotoContext from '../../context/photo/photo-context';
import i18next, { applyLanguage, loadLanguage } from '../../i18n/i18n';
import {
  BrowserSettingLabels,
  loadBrowserSettingLabels,
} from './browser-setting-labels';
import Language from './Language';

// What the page records is checked here, and sent nowhere.
jest.mock('../../analytics/track-event');

// The language is fetched as in the app, unless a test makes it fail.
jest.mock('../../i18n/i18n', () => {
  const actual = jest.requireActual('../../i18n/i18n');
  return { __esModule: true, ...actual, loadLanguage: jest.fn(actual.loadLanguage) };
});

// The page reads the language of its address from the router, which opens the
// address of the language chosen there. A test sets the locale that Next.js
// gives the address (next.config.js): undefined in the app without addresses
// for the languages, as in Photo Location Map, or a language's code.
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
const push = jest.fn(async () => true);
let router: Pick<NextRouter, 'locale' | 'asPath' | 'push'>;
beforeEach(() => {
  router = { locale: undefined, asPath: '/language', push };
  jest.mocked(useRouter).mockImplementation(() => router as NextRouter);
});

/** Opens the page at the address of a language, as the app does when it is opened there. */
async function atAddressOf(language: string) {
  window.history.replaceState(null, '', `/${language}/language`);
  router.locale = language;
  await act(() => applyLanguage(language as 'ja'));
}

const reloadPhoto = jest.fn();

/** The text of the list's first entry in every language, which the page's props bring. */
let browserSettingLabels: BrowserSettingLabels;
beforeAll(async () => {
  browserSettingLabels = await loadBrowserSettingLabels();
});

function page() {
  return (
    <PhotoContext.Provider
      value={{
        loadedPhotoData: null,
        loadedPhotoImage: <div />,
        loadPhoto: () => {},
        reloadPhoto,
      }}
    >
      <Language browserSettingLabels={browserSettingLabels} />
    </PhotoContext.Provider>
  );
}

function renderPage() {
  return render(page());
}

/** Clicks an entry of the list, and waits for its language to be fetched and shown. */
async function choose(name: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole('option', { name }));
  });
}

function chosen(): (string | null)[] {
  return screen
    .getAllByRole('option')
    .filter((element) => element.getAttribute('aria-selected') === 'true')
    .map((element) => element.textContent);
}

afterEach(async () => {
  jest.clearAllMocks();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  await act(() => applyLanguage('en'));
});

it('has the browser\'s language chosen until a language is chosen', () => {
  renderPage();
  expect(screen.getByText('Language')).toBeTruthy();
  expect(chosen()).toEqual(['Use browser setting (English)']);
});

it('shows a saved value that names no language as the browser\'s language', () => {
  localStorage.setItem('Language', 'xx');
  renderPage();
  expect(chosen()).toEqual(['Use browser setting (English)']);
});

it('shows the app in the language chosen, at once, and saves and records the choice', async () => {
  renderPage();
  await choose('日本語');

  expect(i18next.language).toBe('ja');
  expect(document.documentElement.lang).toBe('ja');
  expect(screen.getByText('言語')).toBeTruthy(); // The page's title.
  expect(screen.getByRole('searchbox', { name: '検索' })).toBeTruthy();
  expect(chosen()).toEqual(['日本語']);
  expect(localStorage.getItem('Language')).toBe('ja');
  expect(trackChangedUserSetting).toHaveBeenCalledWith('Language', 'ja');
  expect(trackChangedLanguageInUse).toHaveBeenCalledWith('ja');
  // The address names no language, and stays.
  expect(push).not.toHaveBeenCalled();
});

it('loads the photo again after the language is applied, for its dates', async () => {
  reloadPhoto.mockImplementationOnce(() => {
    expect(i18next.language).toBe('ja');
  });
  renderPage();
  await choose('日本語');
  expect(reloadPhoto).toHaveBeenCalledTimes(1);
});

it('follows the browser again when its entry is chosen', async () => {
  localStorage.setItem('Language', 'ja');
  await act(() => applyLanguage('ja'));
  renderPage();
  expect(chosen()).toEqual(['日本語']);

  // Its entry is in the browser's language, English, on the page in Japanese too.
  await choose('Use browser setting (English)');

  expect(i18next.language).toBe('en');
  expect(chosen()).toEqual(['Use browser setting (English)']);
  expect(localStorage.getItem('Language')).toBe('auto');
  // The setting does not tell the language then, so the language shown is recorded beside it.
  expect(trackChangedUserSetting).toHaveBeenCalledWith('Language', 'auto');
  expect(trackChangedLanguageInUse).toHaveBeenCalledWith('en');
});

it('says so when the language cannot be fetched, and leaves the app and the setting as they were', async () => {
  jest.mocked(loadLanguage).mockRejectedValueOnce(new Error('Loading chunk failed'));
  renderPage();
  await choose('日本語');

  expect(screen.getByRole('alert').textContent).toBe(
    'The language could not be loaded. Check your connection, then try again.',
  );
  expect(i18next.language).toBe('en');
  expect(chosen()).toEqual(['Use browser setting (English)']);
  expect(localStorage.getItem('Language')).toBe('auto');
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
  expect(trackChangedLanguageInUse).not.toHaveBeenCalled();
  expect(reloadPhoto).not.toHaveBeenCalled();

  // Choosing it again tries again.
  await choose('日本語');
  expect(screen.queryByRole('alert')).toBeNull();
  expect(i18next.language).toBe('ja');
  expect(localStorage.getItem('Language')).toBe('ja');
  expect(trackChangedLanguageInUse).toHaveBeenCalledWith('ja');
});

it('does nothing when the chosen entry is chosen again while the app is shown in its language', async () => {
  renderPage();
  await choose('Use browser setting (English)');

  expect(loadLanguage).not.toHaveBeenCalled();
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
  expect(trackChangedLanguageInUse).not.toHaveBeenCalled();
  expect(reloadPhoto).not.toHaveBeenCalled();
});

it('asks for the saved language again when its entry is chosen while the app is shown in English without it', async () => {
  // As after a start at which Japanese could not be fetched: the app is in
  // English, and the setting is kept.
  localStorage.setItem('Language', 'ja');
  renderPage();
  expect(i18next.language).toBe('en');
  expect(chosen()).toEqual(['日本語']);

  await choose('日本語');

  expect(i18next.language).toBe('ja');
  expect(chosen()).toEqual(['日本語']);
  expect(reloadPhoto).toHaveBeenCalledTimes(1);
  // The setting is the one that was saved: it did not change, so no change of
  // it is recorded. The language shown did, from English.
  expect(localStorage.getItem('Language')).toBe('ja');
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
  expect(trackChangedLanguageInUse).toHaveBeenCalledWith('ja');
});

it("asks for the browser's language again in the same way, and keeps following the browser", async () => {
  // The app is shown in Japanese, in a browser that asks for English, while
  // the setting follows the browser.
  await act(() => applyLanguage('ja'));
  renderPage();
  expect(chosen()).toEqual(['Use browser setting (English)']);
  const saved = localStorage.getItem('Language');

  await choose('Use browser setting (English)');

  expect(i18next.language).toBe('en');
  expect(chosen()).toEqual(['Use browser setting (English)']);
  expect(localStorage.getItem('Language')).toBe(saved);
  expect(trackChangedUserSetting).not.toHaveBeenCalled();
  expect(trackChangedLanguageInUse).toHaveBeenCalledWith('en');
});

it('says so when the language asked for again cannot be fetched, and can be asked for once more', async () => {
  localStorage.setItem('Language', 'ja');
  jest.mocked(loadLanguage).mockRejectedValueOnce(new Error('Loading chunk failed'));
  renderPage();

  await choose('日本語');
  expect(screen.getByRole('alert').textContent).toBe(
    'The language could not be loaded. Check your connection, then try again.',
  );
  expect(i18next.language).toBe('en');
  expect(chosen()).toEqual(['日本語']);

  await choose('日本語');
  expect(screen.queryByRole('alert')).toBeNull();
  expect(i18next.language).toBe('ja');
});

describe('at an address that names a language', () => {
  it('has the language of the address chosen, whatever the setting', async () => {
    localStorage.setItem('Language', 'ja');
    await atAddressOf('de');
    renderPage();
    expect(chosen()).toEqual(['Deutsch']);
  });

  it('opens the address of the language chosen, and saves it as the setting', async () => {
    await atAddressOf('de');
    renderPage();
    await choose('日本語');

    expect(i18next.language).toBe('ja');
    expect(push).toHaveBeenCalledWith('/language', undefined, { locale: 'ja' });
    expect(localStorage.getItem('Language')).toBe('ja');
    expect(trackChangedLanguageInUse).toHaveBeenCalledWith('ja');
    expect(reloadPhoto).toHaveBeenCalledTimes(1);
  });

  it("opens the address without a language for the browser's entry", async () => {
    await atAddressOf('de');
    renderPage();
    await choose('Use browser setting (English)');

    expect(i18next.language).toBe('en');
    expect(push).toHaveBeenCalledWith('/language', undefined, { locale: 'default' });
    expect(localStorage.getItem('Language')).toBe('auto');
  });

  it("follows the address when the browser's Back or Forward changes its language", async () => {
    await atAddressOf('de');
    const { rerender } = renderPage();

    // Back, from the address that a choice on the page opened.
    window.history.replaceState(null, '', '/ja/language');
    router = { ...router, locale: 'ja' };
    await act(async () => rerender(page()));

    expect(i18next.language).toBe('ja');
    expect(chosen()).toEqual(['日本語']);
    expect(trackChangedLanguageInUse).toHaveBeenCalledWith('ja');
    expect(reloadPhoto).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });
});
