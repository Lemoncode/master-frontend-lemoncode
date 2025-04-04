import * as apiModel from './api/hotel-edit.api-model';
import * as viewModel from './hotel-edit.vm';

export const mapHotelFromApiToVm = (
  hotel: apiModel.Hotel
): viewModel.Hotel => ({
  id: hotel.id,
  picture: hotel.thumbNailUrl,
  name: hotel.name,
  description: hotel.shortDescription,
  rating: hotel.hotelRating,
  address: hotel.address1,
  city: hotel.city,
});

export const mapHotelFromVmToApi = (hotel: viewModel.Hotel): apiModel.Hotel =>
  ({
    id: hotel.id,
    thumbNailUrl: hotel.picture,
    name: hotel.name,
    shortDescription: hotel.description,
    hotelRating: hotel.rating,
    address1: hotel.address,
    city: hotel.city,
  } as apiModel.Hotel);
