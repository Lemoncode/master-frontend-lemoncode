import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useConfirmationDialog } from '../confirmation-dialog';
import {
  RowRendererProps,
  LabelProps,
  createEmptyLabelProps,
} from './table.vm';
import { TableComponent } from './table.component';
import { mapColumnListFromStringToColumn } from './table.mappers';

interface Props<T = {}> {
  columns: string[];
  rows: T[];
  rowRenderer: (props: RowRendererProps<T>) => React.ReactNode;
  enableSearch?: boolean;
  search?: string;
  onSearch?: (search: string) => void;
  enablePagination?: boolean;
  pageSize?: number;
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  labels?: LabelProps;
  className?: string;
}

export const TableContainer: React.FunctionComponent<Props> = (props) => {
  const { className, enablePagination = false } = props;

  const labels = { ...createEmptyLabelProps(), ...props.labels };

  const columns = React.useMemo(
    () => mapColumnListFromStringToColumn(props.columns),
    [props.columns]
  );
  const data = React.useMemo(() => props.rows, [props.rows]);

  const table = useReactTable({
    columns,
    data,
    initialState: {
      pagination: {
        pageSize: props.pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const { pageIndex } = table.getState().pagination;
  const pageOptions = table.getPageOptions();
  const { isOpen, itemToDelete, onOpenDialog, onClose, onAccept } =
    useConfirmationDialog();

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete(itemToDelete.id);
      onAccept();
    }
  };

  return (
    <TableComponent
      className={className}
      tableProps={table}
      rowRenderer={(rowProps) =>
        props.rowRenderer({
          ...rowProps,
          onEdit: props.onEdit,
          onDelete: Boolean(props.onDelete) ? onOpenDialog : undefined,
        })
      }
      labels={labels}
      enableSearch={props.enableSearch}
      search={props.search}
      onSearch={props.onSearch}
      enablePagination={Boolean(
        props.enablePagination && pageOptions.length > 1
      )}
      pageIndex={pageIndex}
      pageCount={pageOptions.length}
      goToPage={table.setPageIndex}
      onCreate={props.onCreate}
      onDelete={Boolean(props.onDelete) ? handleDelete : undefined}
      isOpenConfirmation={isOpen}
      onCloseConfirmation={onClose}
      itemToDeleteName={itemToDelete.name}
    />
  );
};
