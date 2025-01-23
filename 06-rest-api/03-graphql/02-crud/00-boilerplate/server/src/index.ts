import express from 'express';
import path from 'node:path';
import { hotelApi, cityApi } from './api/index.js';

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/', express.static(path.resolve(import.meta.dirname, '../public')));

app.use('/api/hotels', hotelApi);
app.use('/api/cities', cityApi);

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
