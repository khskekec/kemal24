import React from 'react';
import PropTypes from 'prop-types';
import BaseTable, {
  AutoResizer,
  Column
} from "react-base-table";
import moment from 'moment'

const getColumDefinition = (title, key, dataKey, width = 150) => ({
  title,
  key,
  dataKey,
  resizable: true,
  width
})

const Table = ({events, onActionDelete}) => {

  return <AutoResizer>
    {({ width, height }) => (
      <BaseTable
        width={width}
        height={height}
        fixed={true}
        columns={[
          {
            key: 'a',
            dataKey: 'id',
            width: 150,
            cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => <div>
              <button className='btn'><i className='fa fa-pen' /></button>
              <button className='btn' onClick={() => onActionDelete(cellData)}><i className='fa fa-trash color-danger' /></button>
            </div>
          },
          //getColumDefinition('ID', 'id', 'id'),
          //getColumDefinition('Title', 'title', 'title'),
          getColumDefinition('Type', 'EventType.title', 'EventType.title'),
          {
            ...getColumDefinition('Start', 'start', 'start'),
            cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) =>
              moment(cellData).format('DD.MM.YYYY HH:mm')
          },
          {
            ...getColumDefinition('End', 'end', 'end'),
            cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) =>
              moment(cellData).format('DD.MM.YYYY HH:mm')
          },
          getColumDefinition('Value', 'value', 'value'),
        ]}
        data={events}
      />
    )}
  </AutoResizer>
}

export default Table
