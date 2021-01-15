import {
  getHotelList,
  Hotel,
  getHotel,
  insertHotel,
  updateHotel,
  HotelEdit,
  getCities,
  City,
  deleteHotel,
} from '../db';

interface SaveHotelArgs {
  hotel: HotelEdit;
}

export const resolvers = {
  Query: {
    hotels: async (): Promise<Hotel[]> => {
      const hotels = await getHotelList();
      return hotels;
    },
    hotel: async (parent, args): Promise<Hotel> => {
      const hotel = await getHotel(args.id);
      return hotel;
    },
    cities: async (): Promise<City[]> => {
      const cities = await getCities();
      return cities;
    },
  },
  Mutation: {
    saveHotel: async (parent, args: SaveHotelArgs): Promise<boolean> => {
      if (args.hotel.id) {
        await updateHotel(args.hotel);
      } else {
        await insertHotel(args.hotel);
      }
      return true;
    },
    deleteHotel: async (parent, args): Promise<boolean> => {
      return await deleteHotel(args.id);
    },
  },
};
