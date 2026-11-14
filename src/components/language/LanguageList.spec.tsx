import { act, fireEvent, render, screen } from '@testing-library/react';

import { applyLanguage } from '../../i18n/i18n';
import { languages, LanguageSetting } from '../../i18n/languages';
import LanguageList from './LanguageList';

// The tests run in English, in a browser that asks for English (jest.setup.ts).

function options(): HTMLElement[] {
  return screen.queryAllByRole('option');
}

function option(name: string): HTMLElement {
  return screen.getByRole('option', { name });
}

function searchField(): HTMLInputElement {
  return screen.getByRole('searchbox', { name: 'Search' });
}

function search(text: string): void {
  fireEvent.change(searchField(), { target: { value: text } });
}

function labels(): (string | null)[] {
  return options().map((element) => element.textContent);
}

function chosen(): (string | null)[] {
  return options()
    .filter((element) => element.getAttribute('aria-selected') === 'true')
    .map((element) => element.textContent);
}

function renderList(selected: LanguageSetting = 'auto') {
  const onChoose = jest.fn();
  const view = render(<LanguageList selected={selected} onChoose={onChoose} />);
  return { onChoose, ...view };
}

describe('the list', () => {
  it("lists the browser's language first, with the language it stands for, then each language under its own name", () => {
    renderList();
    expect(labels()).toEqual([
      'Use browser setting (English)',
      ...languages.map((language) => language.name),
    ]);
  });

  it('tells which language each name is written in, by which it is drawn and read aloud', () => {
    renderList();
    expect(options().map((element) => element.getAttribute('lang'))).toEqual([
      'en',
      ...languages.map((language) => language.code),
    ]);
  });

  it('is a list box named Language, of which the chosen setting is the one entry chosen', () => {
    const { rerender, onChoose } = renderList('auto');
    expect(screen.getByRole('listbox', { name: 'Language' })).toBeTruthy();
    expect(chosen()).toEqual(['Use browser setting (English)']);

    rerender(<LanguageList selected='ja' onChoose={onChoose} />);
    expect(chosen()).toEqual(['日本語']);
  });

  it('tells which entry the user clicked', () => {
    const { onChoose } = renderList('auto');
    fireEvent.click(option('日本語'));
    expect(onChoose.mock.calls).toEqual([['ja']]);
  });

  it('keeps an entry chosen when the user clicks it again, as one is always chosen', () => {
    const { onChoose } = renderList('ja');
    fireEvent.click(option('日本語'));
    expect(onChoose).not.toHaveBeenCalled();
    expect(chosen()).toEqual(['日本語']);
  });

  it('tells that the chosen entry was chosen again where the page takes that for a choice', () => {
    const onChoose = jest.fn();
    render(<LanguageList selected='ja' canChooseSelected onChoose={onChoose} />);
    const japanese = option('日本語');

    fireEvent.click(japanese);
    japanese.focus();
    fireEvent.keyDown(japanese, { key: 'Enter' });
    fireEvent.keyDown(japanese, { key: ' ' });

    expect(onChoose.mock.calls).toEqual([['ja'], ['ja'], ['ja']]);
    expect(chosen()).toEqual(['日本語']);
  });
});

describe('the keyboard', () => {
  it('reaches the chosen entry alone with the Tab key', () => {
    renderList('ja');
    const reachable = options().filter((element) => element.tabIndex === 0);
    expect(reachable.map((element) => element.textContent)).toEqual(['日本語']);
    // Not the box itself, which Firefox would stop at as it scrolls.
    expect(screen.getByRole('listbox').tabIndex).toBe(-1);
  });

  it('moves the focus along the list with the arrow keys, from either end to the other', () => {
    renderList('auto');
    const all = options();
    all[0].focus();

    fireEvent.keyDown(all[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(all[1]);
    expect(all[1].tabIndex).toBe(0);
    expect(all[0].tabIndex).toBe(-1);

    fireEvent.keyDown(all[1], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(all[0]);

    fireEvent.keyDown(all[0], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(all[all.length - 1]);

    fireEvent.keyDown(all[all.length - 1], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(all[0]);
  });

  it('moves the focus to the first entry with Home and to the last with End', () => {
    renderList('auto');
    const all = options();
    all[1].focus();

    fireEvent.keyDown(all[1], { key: 'End' });
    expect(document.activeElement).toBe(all[all.length - 1]);

    fireEvent.keyDown(all[all.length - 1], { key: 'Home' });
    expect(document.activeElement).toBe(all[0]);
  });

  it('moves the focus without choosing', () => {
    const { onChoose } = renderList('auto');
    const all = options();
    all[0].focus();
    fireEvent.keyDown(all[0], { key: 'ArrowDown' });
    expect(onChoose).not.toHaveBeenCalled();
    expect(chosen()).toEqual(['Use browser setting (English)']);
  });

  it.each([
    ['Enter', 'Enter'],
    ['Space', ' '],
  ])('chooses the entry under the focus with %s', (_name, key) => {
    const { onChoose } = renderList('auto');
    const japanese = option('日本語');
    japanese.focus();
    fireEvent.keyDown(japanese, { key });
    expect(onChoose.mock.calls).toEqual([['ja']]);
  });

  it('leaves a key pressed with Ctrl, Alt or Command to the browser', () => {
    const { onChoose } = renderList('auto');
    const all = options();
    all[0].focus();
    fireEvent.keyDown(all[0], { key: 'ArrowDown', ctrlKey: true });
    fireEvent.keyDown(all[0], { key: 'Enter', metaKey: true });
    expect(document.activeElement).toBe(all[0]);
    expect(onChoose).not.toHaveBeenCalled();
  });
});

describe('a letter typed on the list', () => {
  const now = jest.spyOn(Date, 'now');

  /** Types a letter on the entry that has the focus, so many milliseconds after the test's start. */
  function type(key: string, at: number) {
    now.mockReturnValue(at);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key });
  }

  function focusedLabel(): string | null {
    return (document.activeElement as HTMLElement).textContent;
  }

  afterAll(() => now.mockRestore());

  it('moves the focus to the next language whose name starts with it', () => {
    renderList('auto');
    options()[0].focus();

    type('d', 10_000);
    expect(focusedLabel()).toBe('Dansk');

    // After a pause, the same letter goes on to the next one, and round again.
    type('d', 12_000);
    expect(focusedLabel()).toBe('Deutsch');
    type('d', 14_000);
    expect(focusedLabel()).toBe('Dansk');
  });

  it('takes letters typed in quick succession together', () => {
    renderList('auto');
    options()[0].focus();

    type('s', 10_000);
    expect(focusedLabel()).toBe('Slovenčina');
    type('v', 10_200);
    expect(focusedLabel()).toBe('Svenska');

    // Half a second after the last letter, the next one is on its own.
    type('e', 10_701);
    expect(focusedLabel()).toBe('Eesti');
  });

  it('goes through the languages that start with a letter typed again and again', () => {
    renderList('auto');
    options()[0].focus();

    type('p', 10_000);
    expect(focusedLabel()).toBe('Polski');
    type('p', 10_100);
    expect(focusedLabel()).toBe('Português (Brasil)');
    type('p', 10_200);
    expect(focusedLabel()).toBe('Português (Portugal)');
  });

  it('is without regard to case or diacritics', () => {
    renderList('auto');
    options()[0].focus();

    type('C', 10_000);
    expect(focusedLabel()).toBe('Català');
    type('e', 10_100);
    expect(focusedLabel()).toBe('Čeština');
  });

  it('moves the focus without choosing, and leaves the focus where it is when no language starts with it', () => {
    const { onChoose } = renderList('auto');
    options()[0].focus();

    type('d', 10_000);
    type('x', 12_000);
    expect(focusedLabel()).toBe('Dansk');
    expect(onChoose).not.toHaveBeenCalled();
    expect(chosen()).toEqual(['Use browser setting (English)']);
  });

  it('leaves Space to choose the entry, and a letter with Ctrl or Command to the browser', () => {
    const { onChoose } = renderList('auto');
    options()[0].focus();

    type('d', 10_000);
    now.mockReturnValue(10_100);
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'e', ctrlKey: true });
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'e', metaKey: true });
    expect(focusedLabel()).toBe('Dansk');

    type(' ', 10_200);
    expect(onChoose.mock.calls).toEqual([['da']]);
  });

  it('leaves a key that is no character, or part of composing one, to the browser', () => {
    renderList('auto');
    const first = options()[0];
    first.focus();

    type('Shift', 10_000);
    type('Dead', 10_100);
    now.mockReturnValue(10_200);
    fireEvent.keyDown(first, { key: 'd', isComposing: true });
    expect(document.activeElement).toBe(first);
  });

  it('moves among the languages that the search lists', () => {
    renderList('auto');
    search('port');
    options()[0].focus();

    type('p', 10_000);
    expect(focusedLabel()).toBe('Português (Portugal)');
    type('p', 12_000);
    expect(focusedLabel()).toBe('Português (Brasil)');
    type('d', 14_000); // Dansk and Deutsch are not listed.
    expect(focusedLabel()).toBe('Português (Brasil)');
  });
});

describe('the search field', () => {
  it('is above the list, which it names as what it narrows down', () => {
    renderList();
    const field = searchField();
    expect(field.placeholder).toBe('Search');
    expect(field.getAttribute('aria-controls')).toBe(
      screen.getByRole('listbox').id,
    );
    expect(
      field.compareDocumentPosition(screen.getByRole('listbox')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('has a magnifying glass after it, the usual sign of a search field, which is not read aloud', () => {
    renderList();
    const field = searchField();
    const icon = field.nextElementSibling as HTMLElement;

    expect(icon.querySelector('[data-testid="SearchIcon"]')).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.textContent).toBe('');
    // The field is still found by its own name, and is the only search field.
    expect(screen.getAllByRole('searchbox', { name: 'Search' })).toEqual([field]);
  });

  it("narrows the list down as the user types: by a language's own name, its English name or its code", () => {
    renderList();
    search('日本');
    expect(labels()).toEqual(['日本語']);
    search('japan');
    expect(labels()).toEqual(['日本語']);
    search('JA');
    expect(labels()).toEqual(['日本語']);
  });

  it('lists the first entry while it has what is typed', () => {
    renderList();
    search('browser');
    expect(labels()).toEqual(['Use browser setting (English)']);
    search('english');
    expect(labels()).toEqual(['Use browser setting (English)', 'English']);
  });

  it('lists every entry again when it is cleared', () => {
    renderList();
    const all = labels();
    search('japan');
    search('');
    expect(labels()).toEqual(all);
  });

  it('says so when no language has what is typed, in place of the entries', () => {
    renderList();
    expect(screen.getByRole('status').textContent).toBe('');

    search('no such language');
    expect(labels()).toEqual([]);
    expect(screen.getByRole('status').textContent).toBe('No languages found');

    search('japan');
    expect(screen.getByRole('status').textContent).toBe('');
  });

  it('keeps the chosen entry chosen while it is not listed', () => {
    const { onChoose } = renderList('ja');
    search('english');
    expect(chosen()).toEqual([]);
    expect(onChoose).not.toHaveBeenCalled();

    search('');
    expect(chosen()).toEqual(['日本語']);
  });

  it('lets the Tab key reach the first entry listed when the chosen one is not', () => {
    renderList('ja');
    search('english');
    const reachable = options().filter((element) => element.tabIndex === 0);
    expect(reachable.map((element) => element.textContent)).toEqual([
      'Use browser setting (English)',
    ]);
  });

  it('chooses among the entries listed', () => {
    const { onChoose } = renderList('auto');
    search('japan');
    fireEvent.click(option('日本語'));
    expect(onChoose.mock.calls).toEqual([['ja']]);
  });
});

describe('when the page opens', () => {
  /** Makes the browser one with a mouse (`true`) or one that is touched (`false`). */
  function pointer(isMouse: boolean) {
    window.matchMedia = jest.fn((query: string) => ({
      matches: isMouse && query === '(hover: hover) and (pointer: fine)',
    })) as unknown as typeof window.matchMedia;
  }

  const focus = jest.spyOn(HTMLElement.prototype, 'focus');
  const rect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');

  beforeEach(() => {
    focus.mockClear();
    rect.mockReset();
  });

  afterEach(() => {
    // jsdom has no matchMedia of its own.
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  afterAll(() => {
    focus.mockRestore();
    rect.mockRestore();
  });

  it('gives the search field the focus, without scrolling the page, where the user types on a keyboard', () => {
    pointer(true);
    rect.mockReturnValue({ top: 300, bottom: 332 } as DOMRect);
    renderList();
    expect(document.activeElement).toBe(searchField());
    expect(focus.mock.calls).toEqual([[{ preventScroll: true }]]);
  });

  it('leaves the focus where it is on a phone, where it would bring up the keyboard', () => {
    pointer(false);
    rect.mockReturnValue({ top: 300, bottom: 332 } as DOMRect);
    renderList();
    expect(document.activeElement).toBe(document.body);
    expect(focus).not.toHaveBeenCalled();
  });

  it('leaves the focus where it is while the field is outside the window, which would be scrolled', () => {
    pointer(true);
    rect.mockReturnValue({
      top: window.innerHeight - 10,
      bottom: window.innerHeight + 22,
    } as DOMRect);
    renderList();
    expect(document.activeElement).toBe(document.body);
    expect(focus).not.toHaveBeenCalled();
  });

  it('leaves the focus where it is in a browser that does not tell how the user points', () => {
    rect.mockReturnValue({ top: 300, bottom: 332 } as DOMRect);
    renderList();
    expect(document.activeElement).toBe(document.body);
  });

  it('keeps the focus where the user put it when the list is drawn again', () => {
    pointer(true);
    rect.mockReturnValue({ top: 300, bottom: 332 } as DOMRect);
    const { rerender, onChoose } = renderList('auto');
    const japanese = option('日本語');
    japanese.focus();
    rerender(<LanguageList selected='ja' onChoose={onChoose} />);
    expect(document.activeElement).toBe(japanese);
  });
});

describe('in a page shown in Arabic, which is written from right to left', () => {
  afterEach(() => act(() => applyLanguage('en')));

  it("keeps the name of the browser's language together in the first entry", async () => {
    await act(() => applyLanguage('ar'));
    renderList('auto');
    const start = String.fromCodePoint(0x2068);
    const end = String.fromCodePoint(0x2069);
    expect(labels()[0]).toBe(`استخدام إعداد المتصفح (${start}English${end})`);

    // What is typed finds it as it is read, without those two characters.
    const field = screen.getByRole('searchbox', { name: 'بحث' });
    fireEvent.change(field, { target: { value: '(english)' } });
    expect(labels()).toEqual([`استخدام إعداد المتصفح (${start}English${end})`]);
  });
});

describe('in a page shown in Japanese', () => {
  afterEach(() => act(() => applyLanguage('en')));

  it('finds a language by its name in Japanese as well, which the browser knows', async () => {
    await act(() => applyLanguage('ja'));
    renderList('auto');
    const field = screen.getByRole('searchbox', { name: '検索' });

    fireEvent.change(field, { target: { value: 'ドイツ語' } });
    expect(labels()).toEqual(['Deutsch']);

    fireEvent.change(field, { target: { value: 'ポルトガル語' } });
    expect(labels()).toEqual(['Português (Brasil)', 'Português (Portugal)']);

    // Its own name, its English name and its code find it as in any language.
    fireEvent.change(field, { target: { value: 'german' } });
    expect(labels()).toEqual(['Deutsch']);
  });
});
