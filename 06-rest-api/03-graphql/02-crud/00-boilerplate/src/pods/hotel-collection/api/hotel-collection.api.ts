import axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await axios.get<HotelEntityApi[]>(url);
  return data;
};

export const deleteHotel = async (id: string): Promise<boolean> => {
  await axios.delete(`${url}/${id}`);
  return true;
};
