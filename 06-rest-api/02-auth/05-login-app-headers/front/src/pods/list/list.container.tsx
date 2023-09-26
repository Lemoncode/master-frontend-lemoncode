import React from 'react';
import * as api from './api';
import { mapItemListFromApiToVm } from './list.mappers';
import { ListComponent } from './list.component';
import { Item, createEmptyItemList, createNoTokenItemList } from './list.vm';

interface Props {
  className?: string;
}

export const ListContainer: React.FunctionComponent<Props> = (props) => {
  const { className } = props;
  const [clientList, setClientList] = React.useState<Item[]>(
    createEmptyItemList()
  );
  const [orderList, setOrderList] = React.useState<Item[]>(
    createEmptyItemList()
  );

  const handleLoadClientList = async () => {
    try {
      const apiClientList = await api.getClientList();
      const vmClientList = mapItemListFromApiToVm(apiClientList);
      setClientList(vmClientList);
    } catch {
      setClientList(createNoTokenItemList());
    }
  };

  const handleLoadOrderList = async () => {
    try {
      const apiOrderList = await api.getOrderList();
      const vmOrderList = mapItemListFromApiToVm(apiOrderList);
      setOrderList(vmOrderList);
    } catch {
      setOrderList(createNoTokenItemList());
    }
  };

  return (
    <ListComponent
      className={className}
      clientList={clientList}
      onLoadClientList={handleLoadClientList}
      orderList={orderList}
      onLoadOrderList={handleLoadOrderList}
    />
  );
};
