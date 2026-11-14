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

it('gives a row that lays out its own names and values the whole width, and tells it how wide the names\' column is', () => {
  render(
    <NameValueGrid
      rows={[
        ...rows,
        { id: 2, parentId: null, name: '', value: '', whole: <div data-testid='whole'>Latitude 37.33</div> },
      ]}
      columnExtensions={[{ columnName: 'name', width: 130 }]}
    />,
  );
  const cell = screen.getByTestId('whole').closest('td') as HTMLTableCellElement;

  expect(cell.colSpan).toBe(2);
  expect(cell.className).toContain('whole');
  expect(cell.parentElement?.children).toHaveLength(1);
  expect(screen.getByRole('table').style.getPropertyValue('--name-column-width')).toBe('130px');
  // The other rows are a name and a value, as before.
  expect(cells()).toHaveLength(5);
});

it('says so when there is no data', () => {
  render(<NameValueGrid rows={[]} columnExtensions={[]} />);
  expect(screen.getByText('No data')).toBeTruthy();
});
