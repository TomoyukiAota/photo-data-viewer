import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  /**
   * Lets a name that is wider than its column continue on the next line, rather
   * than being cut: for names that are translated, which some languages write
   * longer than the column is on a phone.
   */
  wrapNames?: boolean;
}> = ({ rows, columnExtensions, wrapNames }) => {
  const { t } = useTranslation();
  const columns = [
    { name: 'name', title: t('photoData.columns.name') },
    { name: 'value', title: t('photoData.columns.value') },
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
                      <TableCell
                        key={column.name}
                        className={
                          wrapNames && column.name === 'name'
                            ? classes.wrap
                            : undefined
                        }
                        // Plain text is a photo's data, in whatever language it is
                        // written: it takes its own direction, so that "f/2.8" or
                        // "3.09 MB" keeps its order in a right-to-left language.
                        dir={
                          typeof row[column.name] === 'object'
                            ? undefined
                            : 'auto'
                        }
                      >
                        {row[column.name]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {!rows.length && (
                  <TableRow>
                    <TableCell colSpan={2} className={classes.empty}>
                      <div>
                        <big>{t('photoData.noData')}</big>
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
