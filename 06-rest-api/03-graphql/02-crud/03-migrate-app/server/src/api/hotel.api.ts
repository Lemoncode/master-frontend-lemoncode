import { Router } from 'express';
import {
  HotelEdit,
  getHotelList,
  getHotel,
  updateHotel,
  insertHotel,
  deleteHotel,
} from '../db';

export const hotelApi = Router();

hotelApi
  .get('/', async (req, res) => {
    const hotels = await getHotelList();
    res.send(hotels);
  })
  .delete('/:id', async (req, res) => {
    const id = req.params.id;
    const success = await deleteHotel(id);
    res.send(success);
  })
  .get('/:id', async (req, res) => {
    const id = req.params.id;
    const hotel = await getHotel(id);
    res.send(hotel);
  })
  .post('/', async (req, res) => {
    const hotelEdit: HotelEdit = req.body;
    const id = await insertHotel(hotelEdit);
    res.send(id);
  })
  .patch('/:id', async (req, res) => {
    const hotelEdit: HotelEdit = req.body;
    await updateHotel(hotelEdit);
    res.sendStatus(200);
  });
