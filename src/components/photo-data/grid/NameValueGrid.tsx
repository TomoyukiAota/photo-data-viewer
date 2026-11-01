import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { IGridRowData } from './grid-row-data';
import classes from './NameValueGrid.module.scss';

export interface NameAndValue {
  name: string | React.JSX.Element;
  value: string | number | React.JSX.Element;
}

export interface NameValueGridRow extends IGridRowData, NameAndValue {}

interface ColumnExtension {
  columnName: 'name' | 'value';
  width?: number;
}

// Only a read-only two-column table is needed. Keep the legacy grid's sizing,
// overflow and cell metrics without depending on its unsupported React APIs.
const NameValueGrid: React.FC<{
  className?: string;
  rows: NameValueGridRow[];
  columnExtensions: ColumnExtension[];
}> = ({ rows, columnExtensions }) => {
  const columns = [
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ] as const;
  const widths = columns.map(
    (column) =>
      columnExtensions.find((extension) => extension.columnName === column.name)
        ?.width,
  );

  return (
    <Paper className={classes.container} sx={{ boxShadow: 'none' }}>
      <div className={classes.layout}>
        <div className={classes.scroll}>
          <div>
            <Table
              className={classes.table}
              style={{
                minWidth: widths.reduce<number>(
                  (total, width) => total + (width ?? 120),
                  0,
                ),
              }}
            >
              <colgroup>
                {columns.map((column, index) => (
                  <col key={column.name} style={{ width: widths[index] }} />
                ))}
              </colgroup>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.name}>
                      <div className={classes.heading}>{column.title}</div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((column) => (
                      <TableCell key={column.name}>
                        {row[column.name]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={2} className={classes.empty}>
                      <div>
                        <big>No data</big>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default NameValueGrid;
