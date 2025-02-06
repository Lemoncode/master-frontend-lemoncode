import { Router } from 'express';
import { getCities } from '../db/index.js';

export const cityApi = Router();

cityApi.get('/', async (req, res) => {
  const cities = await getCities();
  res.send(cities);
});
