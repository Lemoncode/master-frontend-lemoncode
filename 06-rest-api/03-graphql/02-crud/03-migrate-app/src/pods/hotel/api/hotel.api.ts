import Axios from 'axios';
import { graphQLClient } from 'core/api';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';

const hotelListUrl = '/api/hotels';
const cityListUrl = '/api/cities';

interface GetHotelResponse {
  hotel: Hotel;
}

export const getHotel = async (id: string): Promise<Hotel> => {
  const query = `
    query {
      hotel(id: "${id}") {
        id
        name
        shortDescription
        hotelRating
        address1
        thumbNailUrl
        city
      }
    }
  `;

  const { hotel } = await graphQLClient.request<GetHotelResponse>(query);
  return hotel;
};

interface GetCitiesResponse {
  cities: Lookup[];
}

export const getCities = async (): Promise<Lookup[]> => {
  const query = `
    query {
      cities {
        id
        name
      }
    }
  `;
  const { cities } = await graphQLClient.request<GetCitiesResponse>(query);

  return cities;
};

interface SaveHotelResponse {
  saveHotel: boolean;
}

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
  const query = `
    mutation($hotel: HotelInput!) {
      saveHotel(hotel: $hotel)
    }
  `;
  const { saveHotel } = await graphQLClient.request<SaveHotelResponse>(query, {
    hotel,
  });
  return saveHotel;
};
