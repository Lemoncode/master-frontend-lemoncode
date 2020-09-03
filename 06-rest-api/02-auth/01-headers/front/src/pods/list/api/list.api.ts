import Axios from 'axios';
import { Item } from './list.api-model';

const clientUrl = '/api/clients';
const orderUrl = '/api/orders';

export const getClientList = async (): Promise<Item[]> => {
  // const { data } = await Axios.get(clientUrl);
  // return data;
  return [
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
    {
      id: '4',
      name: 'Client 4',
    },
  ];
};

export const getOrderList = async (): Promise<Item[]> => {
  // const { data } = await Axios.get(orderUrl);
  // return data;
  return [
    {
      id: '1',
      name: 'Order 1',
    },
    {
      id: '2',
      name: 'Order 2',
    },
    {
      id: '3',
      name: 'Order 3',
    },
  ];
};
