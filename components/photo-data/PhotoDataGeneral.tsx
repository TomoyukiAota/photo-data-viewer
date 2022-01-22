import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { TreeDataState, CustomTreeData } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

import classes from './PhotoDataGeneral.module.scss';

interface GridRow {
  id: number;
  parentId: number | null;
  gender: string;
  name: string;
  city: string;
  car: string;
}

const getChildRows = (row: GridRow, rootRows: GridRow[]) => {
  const childRows = rootRows.filter(
    (r) => r.parentId === (row ? row.id : null)
  );
  return childRows.length ? childRows : null;
};

const PhotoDataGeneral: React.FC<{ className?: string }> = (props) => {
  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'gender', title: 'Gender' },
    { name: 'city', title: 'City' },
    { name: 'car', title: 'Car' },
  ]);

  const originalData: GridRow[] = [
    {
      id: 0,
      parentId: null,
      gender: 'Female',
      name: 'Photo Data General',
      city: 'Las Vegas',
      car: 'Audi A4',
    },
    {
      id: 1,
      parentId: 0,
      gender: 'Female',
      name: 'Sharon',
      city: 'Tokyo',
      car: 'Chevrolet Cruze',
    },
    {
      id: 2,
      parentId: 0,
      gender: 'Female',
      name: 'Maria',
      city: 'Chicago',
      car: 'Audi A4',
    },
    {
      id: 3,
      parentId: 1,
      gender: 'Female',
      name: 'Betty',
      city: 'Los Angeles',
      car: 'Nissan Altima',
    },
    {
      id: 4,
      parentId: 0,
      gender: 'Male',
      name: 'Robert',
      city: 'Las Vegas',
      car: 'Chevrolet Cruze',
    },
    {
      id: 5,
      parentId: 2,
      gender: 'Male',
      name: 'Paul',
      city: 'Paris',
      car: 'Chevrolet Cruze',
    },
    {
      id: 6,
      parentId: 2,
      gender: 'Male',
      name: 'John',
      city: 'Los Angeles',
      car: 'Audi A4',
    },
    {
      id: 7,
      parentId: 2,
      gender: 'Male',
      name: 'John',
      city: 'Chicago',
      car: 'Chevrolet Cruze',
    },
    {
      id: 8,
      parentId: 0,
      gender: 'Female',
      name: 'Betty',
      city: 'Paris',
      car: 'Honda Civic',
    },
    {
      id: 9,
      parentId: 1,
      gender: 'Male',
      name: 'John',
      city: 'Austin',
      car: 'Toyota Corolla',
    },
    {
      id: 10,
      parentId: 2,
      gender: 'Male',
      name: 'James',
      city: 'Las Vegas',
      car: 'BMW 750',
    },
    {
      id: 11,
      parentId: 2,
      gender: 'Female',
      name: 'Betty',
      city: 'New York',
      car: 'Chevrolet Cruze',
    },
    {
      id: 12,
      parentId: 5,
      gender: 'Female',
      name: 'Barbara',
      city: 'Paris',
      car: 'Toyota Corolla',
    },
    {
      id: 13,
      parentId: 1,
      gender: 'Male',
      name: 'David',
      city: 'Chicago',
      car: 'Chevrolet Cruze',
    },
    {
      id: 14,
      parentId: 6,
      gender: 'Male',
      name: 'Richard',
      city: 'Tokyo',
      car: 'Chevrolet Cruze',
    },
    {
      id: 15,
      parentId: 3,
      gender: 'Male',
      name: 'David',
      city: 'Chicago',
      car: 'BMW 750',
    },
    {
      id: 16,
      parentId: 6,
      gender: 'Male',
      name: 'David',
      city: 'Austin',
      car: 'Honda Civic',
    },
    {
      id: 17,
      parentId: 5,
      gender: 'Male',
      name: 'Robert',
      city: 'London',
      car: 'Kia Optima',
    },
    {
      id: 18,
      parentId: 6,
      gender: 'Female',
      name: 'Lisa',
      city: 'New York',
      car: 'Nissan Altima',
    },
    {
      id: 19,
      parentId: 0,
      gender: 'Male',
      name: 'John',
      city: 'Chicago',
      car: 'Chevrolet Cruze',
    },
  ];

  const [data] = useState(originalData);
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

  return (
    <Paper className={classes.container}>
      <Grid rows={data} columns={columns}>
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

export default PhotoDataGeneral;
