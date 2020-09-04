import Axios from 'axios';
import { Item } from './list.api-model';

const clientUrl = '/api/clients';
const orderUrl = '/api/orders';

export const getClientList = async (): Promise<Item[]> => {
  const { data } = await Axios.get(clientUrl);
  return data;
};

export const getOrderList = async (): Promise<Item[]> => {
  const { data } = await Axios.get(orderUrl);
  return data;
};
