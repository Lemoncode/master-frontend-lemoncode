import Axios from 'axios';
import { Hotel } from './hotel-edit.api-model';
import { Lookup } from 'common/models';

const hotelListUrl = '/api/hotels';
const cityListUrl = '/api/cities';

export const getHotel = async (id: string): Promise<Hotel> => {
  const { data } = await Axios.get<Hotel>(`${hotelListUrl}/${id}`);

  return data;
};

export const getCities = async (): Promise<Lookup[]> => {
  const { data } = await Axios.get<Lookup[]>(`${cityListUrl}`);

  return data;
};

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
  const { data } = await Axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);

  return true;
};
