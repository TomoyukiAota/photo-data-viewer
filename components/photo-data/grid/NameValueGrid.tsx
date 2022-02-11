import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { TreeDataState, CustomTreeData } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

import { IGridRowData } from './grid-row-data';
import classes from './NameValueGrid.module.scss';

export interface NameAndValue {
  name: string;
  value: string | number | JSX.Element;
}

export interface NameValueGridRow extends IGridRowData, NameAndValue {}

const NameValueGrid: React.FC<{
  className?: string;
  rows: NameValueGridRow[];
  columnExtensions: Table.ColumnExtension[];
}> = (props) => {
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ]);

  return (
    <Paper className={classes.container}>
      <Grid rows={props.rows} columns={columns}>
        <Table columnExtensions={props.columnExtensions} />
        <TableHeaderRow />
      </Grid>
    </Paper>
  );
};

export default NameValueGrid;
