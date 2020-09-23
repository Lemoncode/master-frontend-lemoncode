import { getHotelList, Hotel } from '../db';

export const resolvers = {
  Query: {
    hotels: async (): Promise<Hotel[]> => {
      const hotels = await getHotelList();
      return hotels;
    },
  },
};
