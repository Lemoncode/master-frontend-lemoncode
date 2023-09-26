import React from 'react';
import { cx } from '@emotion/css';
import Button from '@mui/material/Button';
import { Item } from './list.vm';
import { TableComponent } from './components';
import * as classes from './list.styles';

interface Props {
  clientList: Item[];
  onLoadClientList: () => void;
  orderList: Item[];
  onLoadOrderList: () => void;
  className?: string;
}

export const ListComponent: React.FunctionComponent<Props> = (props) => {
  const {
    clientList,
    onLoadClientList,
    orderList,
    onLoadOrderList,
    className,
  } = props;

  return (
    <div className={cx(classes.root, className)}>
      <Button
        className={classes.loadClientButton}
        variant="contained"
        color="secondary"
        onClick={onLoadClientList}
      >
        Load Clients
      </Button>
      <TableComponent className={classes.clientList} itemList={clientList} />
      <Button
        className={classes.loadOrderButton}
        variant="contained"
        color="secondary"
        onClick={onLoadOrderList}
      >
        Load Orders
      </Button>
      <TableComponent className={classes.orderList} itemList={orderList} />
    </div>
  );
};
