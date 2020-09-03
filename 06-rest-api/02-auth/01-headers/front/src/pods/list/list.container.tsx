import React from 'react';
import { ListComponent } from './list.component';

interface Props {
  className?: string;
}

export const ListContainer: React.FunctionComponent<Props> = (props) => {
  const { className } = props;

  const handleLoadClientList = () => {};

  const handleLoadOrderList = () => {};

  return (
    <ListComponent
      className={className}
      clientList={[
        {
          id: '1',
          name: 'Client 1',
        },
        {
          id: '2',
          name: 'Client 2',
        },
        {
          id: '3',
          name: 'Client 3',
        },
      ]}
      onLoadClientList={handleLoadClientList}
      orderList={[
        {
          id: '1',
          name: 'Order 1',
        },
        {
          id: '2',
          name: 'Order 2',
        },
      ]}
      onLoadOrderList={handleLoadOrderList}
    />
  );
};
