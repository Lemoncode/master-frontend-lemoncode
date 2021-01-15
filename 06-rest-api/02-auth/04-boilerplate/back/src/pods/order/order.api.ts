import { Router } from 'express';
import { Order } from './order.api-model';

export const orderApi = Router();

const orderList: Order[] = [
  {
    id: '1',
    name: 'Movies',
  },
  {
    id: '2',
    name: 'Grocery',
  },
  {
    id: '3',
    name: 'Jewelery',
  },
  {
    id: '4',
    name: 'Clothing',
  },
  {
    id: '5',
    name: 'Shoes',
  },
];

orderApi.get('/', async (req, res) => {
  res.send(orderList);
});
