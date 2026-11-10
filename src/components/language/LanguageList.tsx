import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getLanguage,
  languages,
  LanguageSetting,
  languageSettingAuto,
} from '../../i18n/languages';
import { browserLanguage } from '../../i18n/resolve-language';
import { valuesIn } from '../../i18n/text-values';
import {
  LanguageListItem,
  languageNamesIn,
  matchesSearch,
} from './language-search';
import classes from './LanguageList.module.scss';

/** Scrolls the list, and nothing around it, by as little as shows the entry. */
function showInList(list: HTMLElement, entry: HTMLElement): void {
  const top = entry.offsetTop;
  const bottom = top + entry.offsetHeight;
  if (top < list.scrollTop) {
    list.scrollTop = top;
  } else if (bottom > list.scrollTop + list.clientHeight) {
    list.scrollTop = bottom - list.clientHeight;
  }
}

/**
 * Whether the field can take the keyboard's focus without anything else
 * happening: no keyboard coming up on the screen, and nothing to scroll to.
 */
function canTakeFocusQuietly(field: HTMLElement): boolean {
  // A mouse or a trackpad, so a keyboard that is not on the screen.
  const hasKeyboard =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const { top, bottom } = field.getBoundingClientRect();
  const isInView = top >= 0 && bottom <= window.innerHeight;
  return hasKeyboard && isInView;
}

/**
 * The list to choose the Language setting from, with a field above it that
 * narrows the list down: the browser's language first, with the language that it
 * stands for in this browser, then each language under its own name, so that a
 * user who cannot read the current language still finds theirs.
 *
 * TL;DR: It looks and works like the list in Photo Location Map, so that the
 * two applications ask for the language in the same way.
 * Details: a list box of which one entry is chosen, in a box of seven entries
 * that scrolls. The box keeps that height whatever the search leaves, so that
 * nothing below it moves while the user types. The arrow keys, Home and End
 * move the keyboard's focus along the list, and Space or Enter chooses the
 * entry under it. The search is without regard to case or diacritics, and
 * finds a language by its own name, its English name, its name in the language
 * the page is shown in, or its code. The chosen entry stays chosen while the
 * search hides it.
 */
const LanguageList: React.FC<{
  /** The Language setting that is chosen in the list. */
  selected: LanguageSetting;
  /** Called with the entry the user chose, unless it is the chosen one already. */
  onChoose: (setting: LanguageSetting) => void;
}> = ({ selected, onChoose }) => {
  const { t, i18n } = useTranslation();
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  /** The entry the keyboard's focus was on last. */
  const [focused, setFocused] = useState<LanguageSetting | null>(null);
  /** Each language's name in the language of the page: ドイツ語 finds Deutsch in Japanese. */
  const nameInPageLanguage = useMemo(
    () => languageNamesIn(i18n.language),
    [i18n.language],
  );

  const items: LanguageListItem[] = [
    {
      setting: languageSettingAuto,
      label: t(
        'language.useBrowserSetting',
        valuesIn(i18n.language, {
          language: getLanguage(browserLanguage()).name,
        }),
      ),
      labelLanguage: i18n.language,
      keywords: [],
    },
    ...languages.map((language) => ({
      setting: language.code,
      label: language.name,
      labelLanguage: language.code,
      keywords: [
        language.englishName,
        language.code,
        nameInPageLanguage(language.code),
      ],
    })),
  ];
  const listed = items.filter((item) => matchesSearch(item, search));

  // The one entry that the Tab key reaches: where the focus was last, or the
  // chosen entry, or the first, whichever is listed.
  const tabStop = (
    listed.find((item) => item.setting === focused) ??
    listed.find((item) => item.setting === selected) ??
    listed[0]
  )?.setting;

  // TL;DR: The search field has the keyboard's focus when the page opens, so
  // that the user can type at once, where that changes nothing else.
  // Details: In Photo Location Map the list is in a dialog, which gives its
  // search field the focus. A page is more careful. Where the user types on the
  // screen, the focus would bring the keyboard up over the list before they
  // asked for it; and a field outside the window would be scrolled to. In
  // either case the focus stays where it is.
  useEffect(() => {
    const field = searchRef.current;
    if (field && canTakeFocusQuietly(field)) {
      field.focus({ preventScroll: true });
    }
  }, []);

  // With more languages than the box shows at once, the chosen one may be below
  // its edge: it is shown when the page opens and when the search is cleared.
  // While the user types, the list starts at its first match.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const chosen = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (search.trim() === '' && chosen) showInList(list, chosen);
    else list.scrollTop = 0;
  }, [search]);

  const focusEntry = (index: number) => {
    const count = listed.length;
    const setting = listed[(index + count) % count].setting; // Past either end, the other end.
    listRef.current
      ?.querySelector<HTMLElement>(`[data-setting="${setting}"]`)
      ?.focus();
  };

  const choose = (setting: LanguageSetting) => {
    if (setting !== selected) onChoose(setting);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const setting = (event.target as HTMLElement).dataset.setting;
    const index = listed.findIndex((item) => item.setting === setting);
    if (index < 0) return;
    switch (event.key) {
      case 'ArrowDown':
        focusEntry(index + 1);
        break;
      case 'ArrowUp':
        focusEntry(index - 1);
        break;
      case 'Home':
        focusEntry(0);
        break;
      case 'End':
        focusEntry(listed.length - 1);
        break;
      case 'Enter':
      case ' ':
        choose(listed[index].setting);
        break;
      default:
        return;
    }
    event.preventDefault(); // The page does not scroll as well.
  };

  return (
    <div className={classes.container}>
      <input
        ref={searchRef}
        type='search'
        className={classes.search}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('language.search')}
        aria-label={t('language.search')}
        aria-controls={listId}
        autoComplete='off'
        autoCapitalize='off'
        autoCorrect='off'
        spellCheck={false}
      />
      <div className={classes.box}>
        <ul
          id={listId}
          ref={listRef}
          className={classes.languages}
          role='listbox'
          aria-label={t('language.title')}
          hidden={listed.length === 0}
          // Not a stop of the Tab key itself: Firefox makes one of every box
          // that scrolls, before the entry that the Tab key is to reach.
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {listed.map((item) => (
            <li
              key={item.setting}
              className={classes.language}
              role='option'
              aria-selected={item.setting === selected}
              lang={item.labelLanguage}
              data-setting={item.setting}
              tabIndex={item.setting === tabStop ? 0 : -1}
              onClick={() => choose(item.setting)}
              onFocus={() => setFocused(item.setting)}
            >
              {/* On its own, so that a name written in the other direction than the page keeps its order. */}
              <bdi>{item.label}</bdi>
            </li>
          ))}
        </ul>
        {/* In the page while it is empty, so that a screen reader says the text when it comes. */}
        <div className={classes['no-languages']} role='status'>
          {listed.length === 0 ? t('language.noLanguagesFound') : ''}
        </div>
      </div>
    </div>
  );
};

export default LanguageList;
