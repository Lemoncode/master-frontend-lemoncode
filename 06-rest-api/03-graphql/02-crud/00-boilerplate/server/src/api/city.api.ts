import { Router } from 'express';
import { getCities } from '../db';

export const cityApi = Router();

cityApi.get('/', async (req, res) => {
  const cities = await getCities();
  res.send(cities);
});
