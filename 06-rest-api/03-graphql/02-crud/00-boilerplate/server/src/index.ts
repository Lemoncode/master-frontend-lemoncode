import 'regenerator-runtime/runtime';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { hotelApi, cityApi } from './api';

const PORT = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));
app.use('/api/hotels', hotelApi);
app.use('/api/cities', cityApi);

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});
