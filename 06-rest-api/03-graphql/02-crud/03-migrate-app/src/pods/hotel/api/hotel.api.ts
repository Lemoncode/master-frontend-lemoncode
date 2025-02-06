import axios from 'axios';
import { graphql } from '#core/api';
import { Hotel } from './hotel.api-model';
import { Lookup } from '#common/models';

const hotelListUrl = '/api/hotels';
const cityListUrl = '/api/cities';

interface GetHotelResponse {
  hotel: Hotel;
}

export const getHotel = async (id: string): Promise<Hotel> => {
  const query = `
    query($id: ID!) {
      hotel(id: $id) {
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

  const { hotel } = await graphql<GetHotelResponse>({
    query,
    variables: { id },
  });

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

  const { cities } = await graphql<GetCitiesResponse>({
    query,
  });

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

  const { saveHotel } = await graphql<SaveHotelResponse>({
    query,
    variables: { hotel },
  });

  return saveHotel;
};
