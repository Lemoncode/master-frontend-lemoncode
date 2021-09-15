import { Router } from 'express';

export const api = Router();

api.get('/', async (req, res) => {
  res.send({ id: '1', name: 'test data' });
});
