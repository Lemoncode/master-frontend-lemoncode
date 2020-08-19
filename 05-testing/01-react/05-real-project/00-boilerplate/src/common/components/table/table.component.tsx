import React from 'react';
import { cx } from 'emotion';
import { TableProps, HeaderGroup, Row } from 'react-table';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { SearchBarComponent } from '../search-bar';
import { PaginationComponent } from '../pagination';
import { ConfirmationDialogComponent } from '../confirmation-dialog';
import { HeaderComponent, BodyComponent } from './components';
import { RowRendererProps, LabelProps } from './table.vm';
import * as classes from './table.styles';

interface Props<T extends object = {}> {
  tableProps: TableProps;
  headerGroups: HeaderGroup<T>[];
  rows: Row<T>[];
  prepareRow: (row: Row<T>) => void;
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

export const TableComponent: React.FunctionComponent<Props> = props => {
  const {
    tableProps,
    headerGroups,
    rows,
    prepareRow,
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
            <HeaderComponent headerGroups={headerGroups} />
            <BodyComponent
              rows={rows}
              prepareRow={prepareRow}
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
