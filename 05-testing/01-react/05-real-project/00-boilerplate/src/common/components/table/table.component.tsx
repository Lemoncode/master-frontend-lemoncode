import React from 'react';
import { Table as TableProps } from '@tanstack/react-table';
import {
  Paper,
  TableContainer,
  Table,
  Button,
  Typography,
} from '@mui/material';
import { SearchBarComponent } from '../search-bar';
import { PaginationComponent } from '../pagination';
import { ConfirmationDialogComponent } from '../confirmation-dialog';
import { HeaderComponent, BodyComponent } from './components';
import { RowRendererProps, LabelProps } from './table.vm';
import * as classes from './table.styles';

interface Props<T extends object = {}> {
  tableProps: TableProps<T>;
  rowRenderer: (props: RowRendererProps<T>) => React.ReactNode;
  labels: LabelProps;
  enableSearch: boolean;
  search?: string;
  onSearch?: (search: string) => void;
  enablePagination: boolean;
  pageIndex?: number;
  pageCount?: number;
  goToPage?: (pageIndex: number) => void;
  onCreate?: () => void;
  onDelete?: () => void;
  itemToDeleteName?: string;
  isOpenConfirmation?: boolean;
  onCloseConfirmation?: () => void;
  className?: string;
}

export const TableComponent: React.FunctionComponent<Props> = (props) => {
  const {
    tableProps,
    rowRenderer,
    enableSearch,
    search,
    onSearch,
    enablePagination,
    pageIndex,
    pageCount,
    goToPage,
    onCreate,
    onDelete,
    itemToDeleteName,
    isOpenConfirmation,
    onCloseConfirmation,
    labels,
    className,
  } = props;

  return (
    <div className={className}>
      <div className={classes.root}>
        {enableSearch && (
          <SearchBarComponent
            className={classes.search}
            search={search}
            onSearch={onSearch}
            labels={{ placeholder: labels.searchPlaceholder }}
          />
        )}
        <TableContainer className={classes.table} component={Paper}>
          <Table {...tableProps}>
            <HeaderComponent headerGroups={tableProps.getHeaderGroups()} />
            <BodyComponent
              rows={tableProps.getRowModel().rows}
              rowRenderer={rowRenderer}
            />
          </Table>
          {enablePagination && (
            <PaginationComponent
              className={classes.pagination}
              pageIndex={pageIndex}
              pageCount={pageCount}
              onChange={goToPage}
            />
          )}
        </TableContainer>
        {onCreate && (
          <Button variant="contained" color="primary" onClick={onCreate}>
            {labels.createButton}
          </Button>
        )}
        {onDelete && (
          <ConfirmationDialogComponent
            isOpen={isOpenConfirmation}
            onAccept={onDelete}
            onClose={onCloseConfirmation}
            title={labels.deleteTitle}
            labels={{
              closeButton: labels.closeButton,
              acceptButton: labels.acceptButton,
            }}
          >
            <Typography variant="body1">
              {labels.deleteContent({ itemName: itemToDeleteName })}
            </Typography>
          </ConfirmationDialogComponent>
        )}
      </div>
    </div>
  );
};
