import { Column, Cell } from 'react-table';
import { mapToCollection } from 'common/mappers';

const mapColumnFromStringToColumn = (column: string): Column => ({
  accessor: column,
  Header: column,
});

export const mapColumnListFromStringToColumn = (columns: string[]): Column[] =>
  mapToCollection(columns, mapColumnFromStringToColumn);
