import { Router } from 'express';
import { Client } from './client.api-model';

export const clientApi = Router();

const clientList: Client[] = [
  {
    id: '1',
    name: 'Del Blyth',
  },
  {
    id: '2',
    name: 'Vania MacDonnell',
  },
  {
    id: '3',
    name: 'Turner Darrigoe',
  },
  {
    id: '4',
    name: 'Stephie Gofton4',
  },
  {
    id: '5',
    name: 'Stephie Gofton4',
  },
  {
    id: '6',
    name: 'Marji Monkley',
  },
  {
    id: '7',
    name: 'Roxanne GoftKynanon4',
  },
];

clientApi.get('/', async (req, res) => {
  res.send(clientList);
});
