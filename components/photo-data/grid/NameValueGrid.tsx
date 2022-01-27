import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { TreeDataState, CustomTreeData } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

import { GridRow } from './grid-row';
import classes from './NameValueGrid.module.scss';

export interface NameAndValue {
  name: string;
  value: string | JSX.Element;
}

export interface NameValueGridRow extends GridRow, NameAndValue {}

const NameValueGrid: React.FC<{
  className?: string;
  rows: NameValueGridRow[];
}> = (props) => {
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ]);

  const [tableColumnExtensions] = useState([
    { columnName: 'name', width: 300 },
  ]);

  const [expandedRowIds, setExpandenRowIds] = useState([0, 1]);

  const handleOnExpandedRowIdsChange: (
    expandedRowIds: Array<number | string>
  ) => void = (expandedRowIds) => {
    const expandedRowIdsInNumber = expandedRowIds.map(Number);
    setExpandenRowIds(expandedRowIdsInNumber);
  };

  const getChildRows = (row: GridRow, rootRows: GridRow[]) => {
    const childRows = rootRows.filter(
      (r) => r.parentId === (row ? row.id : null)
    );
    return childRows.length ? childRows : null;
  };

  return (
    <Paper className={classes.container}>
      <Grid rows={props.rows} columns={columns}>
        <TreeDataState
          expandedRowIds={expandedRowIds}
          onExpandedRowIdsChange={handleOnExpandedRowIdsChange}
        />
        <CustomTreeData getChildRows={getChildRows} />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow />
        <TableTreeColumn for='name' />
      </Grid>
    </Paper>
  );
};

export default NameValueGrid;
