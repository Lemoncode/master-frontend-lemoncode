import { ColumnDef } from '@tanstack/react-table';
import { mapToCollection } from '#common/mappers';

const mapColumnFromStringToColumn = (column: string): ColumnDef<any> => ({
  accessorKey: column,
  header: column,
});

export const mapColumnListFromStringToColumn = (
  columns: string[]
): ColumnDef<any>[] => mapToCollection(columns, mapColumnFromStringToColumn);
