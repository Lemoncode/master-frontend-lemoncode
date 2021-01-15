import Axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';

const hotelListUrl = '/api/hotels';
const cityListUrl = '/api/cities';

export const getHotel = async (id: string): Promise<Hotel> => {
  const { data } = await Axios.get<Hotel>(`${hotelListUrl}/${id}`);

  return data;
};

export const getCities = async (): Promise<Lookup[]> => {
  const { data } = await Axios.get<Lookup[]>(cityListUrl);

  return data;
};

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
  if (hotel.id) {
    await Axios.patch<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
  } else {
    await Axios.post<Hotel>(hotelListUrl, hotel);
  }
  return true;
};
