import axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';

const hotelListUrl = '/api/hotels';
const cityListUrl = '/api/cities';

export const getHotel = async (id: string): Promise<Hotel> => {
  const { data } = await axios.get<Hotel>(`${hotelListUrl}/${id}`);
  return data;
};

export const getCities = async (): Promise<Lookup[]> => {
  const { data } = await axios.get<Lookup[]>(cityListUrl);
  return data;
};

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
  if (hotel.id) {
    await axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
  } else {
    await axios.post<Hotel>(hotelListUrl, hotel);
  }
  return true;
};
