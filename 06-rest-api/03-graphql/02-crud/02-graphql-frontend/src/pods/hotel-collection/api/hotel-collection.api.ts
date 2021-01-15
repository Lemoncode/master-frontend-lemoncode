import Axios from 'axios';
import { graphQLClient } from 'core/api';
import { HotelEntityApi } from './hotel-collection.api-model';

const url = '/api/hotels';

interface GetHotelCollectionResponse {
  hotels: HotelEntityApi[];
}

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const query = `
    query {
      hotels {
        id
        name
        shortDescription
        hotelRating
        address1
        thumbNailUrl
      }
    }
  `;
  const { hotels } = await graphQLClient.request<GetHotelCollectionResponse>(
    query
  );
  return hotels;
};

export const deleteHotel = async (id: string): Promise<boolean> => {
  await Axios.delete(`${url}/${id}`);
  return true;
};
