import axios from 'axios';
import { Item } from './list.api-model';

const clientUrl = 'http://localhost:3000/api/clients';
const orderUrl = 'http://localhost:3000/api/orders';

export const getClientList = async (): Promise<Item[]> => {
  const { data } = await axios.get(clientUrl);
  return data;
};

export const getOrderList = async (): Promise<Item[]> => {
  const { data } = await axios.get(orderUrl);
  return data;
};
