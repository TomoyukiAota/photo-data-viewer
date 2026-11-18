import { act, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { applyLanguage } from '../../i18n/i18n';
import { IconDataUrl } from '../../icons/icon-data-url';
import Credits from './Credits';
import { iconCredits } from './icon-credits';

afterEach(() => act(() => applyLanguage('en')));

/** The credits' lines, as the page shows them. */
function lines(): HTMLElement[] {
  return within(screen.getByRole('list'))
    .getAllByRole('listitem')
    .map((item) => item.querySelector('[dir]') as HTMLElement);
}

it("credits each author once, in Flaticon's words, with a link to the author, to Flaticon and to a license", () => {
  render(<Credits />);
  expect(lines().map((line) => line.textContent)).toEqual([
    'Icons made by Magnific from www.flaticon.com',
    'Icon made by srip from www.flaticon.com',
    'Icon made by Dave Gandy from www.flaticon.com, licensed under CC BY 3.0',
  ]);
  const links = lines().map((line) =>
    within(line)
      .getAllByRole('link')
      .map((link) => [link.textContent, link.getAttribute('href')]),
  );
  expect(links).toEqual([
    [
      ['Magnific', 'https://www.flaticon.com/authors/magnific'],
      ['www.flaticon.com', 'https://www.flaticon.com/'],
    ],
    [
      ['srip', 'https://www.flaticon.com/authors/srip'],
      ['www.flaticon.com', 'https://www.flaticon.com/'],
    ],
    [
      ['Dave Gandy', 'https://www.flaticon.com/authors/dave-gandy'],
      ['www.flaticon.com', 'https://www.flaticon.com/'],
      ['CC BY 3.0', 'https://creativecommons.org/licenses/by/3.0/'],
    ],
  ]);
  // Each opens in a tab of its own, which cannot reach this page.
  for (const link of screen.getAllByRole('link')) {
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener');
  }
});

it("shows each author's icons beside the line, as pictures that a screen reader passes by", () => {
  const { container } = render(<Credits />);
  const items = container.querySelectorAll('li');
  expect(
    [...items].map((item) =>
      [...item.querySelectorAll('img')].map((img) => img.getAttribute('src')),
    ),
  ).toEqual(iconCredits.map((credit) => credit.icons.map((icon) => IconDataUrl[icon])));
  for (const img of container.querySelectorAll('img')) {
    expect(img.getAttribute('alt')).toBe('');
  }
});

it('translates its title and the sentence before the lines, and keeps the lines in English, read from left to right', async () => {
  await act(() => applyLanguage('ja'));
  render(<Credits />);
  expect(screen.getByText('クレジット')).toBeTruthy();
  expect(
    screen.getByText('このアプリは、次の作者が作成した Flaticon のアイコンを使用しています。'),
  ).toBeTruthy();
  expect(lines()[1].textContent).toBe('Icon made by srip from www.flaticon.com');
  for (const line of lines()) expect(line.getAttribute('dir')).toBe('ltr');
});

it('credits every icon from Flaticon that the app has, and no other', () => {
  // The icons whose comment in icon-data-url.ts says that they are from Flaticon.
  const source = readFileSync(join(__dirname, '../../icons/icon-data-url.ts'), 'utf8');
  const fromFlaticon = [
    ...source.matchAll(
      /\/\/ From https:\/\/www\.flaticon\.com\/[^\n]*\n(?:\s*\/\/[^\n]*\n)*\s*public static (\w+)/g,
    ),
  ].map(([, name]) => name);
  expect(fromFlaticon.length).toBeGreaterThan(0);
  const credited = iconCredits.flatMap((credit) => credit.icons);
  expect([...credited].sort()).toEqual([...fromFlaticon].sort());
});
