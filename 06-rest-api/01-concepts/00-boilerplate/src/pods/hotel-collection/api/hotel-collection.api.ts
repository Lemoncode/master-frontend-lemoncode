import { HotelEntityApi } from './hotel-collection.api-model';
import { mockHotelCollection } from './hotel-collection.mock-data';

let hotelCollection = [...mockHotelCollection];

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  return hotelCollection;
};

export const deleteHotel = async (id: string): Promise<boolean> => {
  hotelCollection = hotelCollection.filter((h) => h.id !== id);
  return true;
};
