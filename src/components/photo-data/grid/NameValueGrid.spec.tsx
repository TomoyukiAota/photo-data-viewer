import { render, screen } from '@testing-library/react';

import NameValueGrid, { NameValueGridRow } from './NameValueGrid';

const rows: NameValueGridRow[] = [
  { id: 0, parentId: null, name: 'Make', value: 'Apple' },
  { id: 1, parentId: null, name: <div>File Name</div>, value: <div>demo.jpg</div> },
];

function cells(): HTMLElement[] {
  return screen.getAllByRole('cell');
}

it("gives a cell of plain text the direction of its own text, as it is a photo's data", () => {
  render(<NameValueGrid rows={rows} columnExtensions={[]} />);
  expect(cells().map((cell) => cell.getAttribute('dir'))).toEqual([
    'auto',
    'auto',
    null, // What is in such a cell sets its own direction.
    null,
  ]);
});

it('cuts a name that is wider than its column, unless names may take a second line', () => {
  const { rerender } = render(<NameValueGrid rows={rows} columnExtensions={[]} />);
  expect(cells().filter((cell) => cell.className.includes('wrap'))).toEqual([]);

  rerender(<NameValueGrid rows={rows} columnExtensions={[]} wrapNames />);
  const wrapping = cells().filter((cell) => cell.className.includes('wrap'));
  expect(wrapping.map((cell) => cell.textContent)).toEqual(['Make', 'File Name']);
});

it('says so when there is no data', () => {
  render(<NameValueGrid rows={[]} columnExtensions={[]} />);
  expect(screen.getByText('No data')).toBeTruthy();
});
