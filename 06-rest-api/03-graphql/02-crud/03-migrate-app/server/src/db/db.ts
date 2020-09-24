import crypto from 'crypto';
import { createDefaultHotel, mockCities, mockHotels } from './mock-data';
import { Hotel, HotelEdit, City } from './models';

let hotels = [...mockHotels];
let cities = [...mockCities];

export const getHotelList = async (): Promise<Hotel[]> => hotels;

export const getHotel = async (id: string): Promise<Hotel> =>
  hotels.find((h) => h.id === id);

export const insertHotel = async (hotelEdit: HotelEdit) => {
  const newId = crypto.randomBytes(16).toString('hex');
  hotels = [
    ...hotels,
    {
      ...createDefaultHotel(),
      ...hotelEdit,
      id: newId,
    },
  ];
  return newId;
};

export const updateHotel = async (hotelEdit: HotelEdit): Promise<boolean> => {
  hotels = hotels.map((h) =>
    h.id === hotelEdit.id
      ? {
          ...h,
          ...hotelEdit,
        }
      : h
  );

  return true;
};

export const deleteHotel = async (id: string): Promise<boolean> => {
  hotels = hotels.filter((h) => h.id !== id);
  return true;
};

export const getCities = async (): Promise<City[]> => cities;
