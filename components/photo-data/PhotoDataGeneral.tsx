import React, { useContext, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { TreeDataState, CustomTreeData } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

import PhotoContext from '../../store/photo-context';
import LatLngRow from './LatLngRow';
import classes from './PhotoDataGeneral.module.scss';

interface GridRow {
  id: number;
  parentId: number | null;
  name: string;
  value: string | JSX.Element;
}

const getChildRows = (row: GridRow, rootRows: GridRow[]) => {
  const childRows = rootRows.filter(
    (r) => r.parentId === (row ? row.id : null)
  );
  return childRows.length ? childRows : null;
};

const PhotoDataGeneral: React.FC<{ className?: string }> = (props) => {
  const photoCtx = useContext(PhotoContext);

  console.log('PhotoDataGeneral: photoCtx', photoCtx);

  const loadedPhotoData = photoCtx.loadedPhotoData;

  const [columns] = useState([
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ]);

  const rows: GridRow[] = [
    {
      id: 0,
      parentId: null,
      name: 'File Name',
      value: loadedPhotoData?.file?.name ?? '',
    },
    {
      id: 1,
      parentId: null,
      name: 'File Size',
      value: loadedPhotoData?.file?.size?.displayString ?? '',
    },
    {
      id: 2,
      parentId: null,
      name: 'Last Modified',
      value: loadedPhotoData?.file?.lastModified?.localizedFormat ?? '',
    },
    {
      id: 3,
      parentId: null,
      name: 'Date Taken',
      value: loadedPhotoData?.exif?.dateTimeOriginal?.localizedFormat ?? '',
    },
    // TODO: Add Image Dimensions
    {
      id: 4,
      parentId: null,
      name: 'Latitude, Longitude',
      value: (
        <LatLngRow
          latitude={loadedPhotoData?.exif?.latitude}
          longitude={loadedPhotoData?.exif?.longitude}
        />
      ),
    },
  ];

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
      <Grid rows={rows} columns={columns}>
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
