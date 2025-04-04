import { getHotelList } from '#db/index.js';
import { Hotel } from '#db/models/index.js';

export const resolvers = {
  hotels: async (): Promise<Hotel[]> => {
    const hotels = await getHotelList();
    return hotels;
  },
};
