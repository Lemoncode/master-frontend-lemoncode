import axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const { data } = await axios.get<HotelEntityApi[]>(url);
  return data;
};

// json-server delete issue: It deletes all collection instead of single one.
// https://github.com/typicode/json-server/issues/760
export const deleteHotel = async (id: string): Promise<boolean> => {
  await axios.delete(`${url}/${id}`);
  return true;
};
