import * as apiModel from './api/hotel.api-model';
import * as viewModel from './hotel.vm';

export const mapHotelFromApiToVm = (
  hotel: apiModel.Hotel
): viewModel.Hotel => ({
  ...hotel,
  id: hotel.id,
  name: hotel.name,
  description: hotel.shortDescription,
  rating: hotel.hotelRating,
  address: hotel.address1,
  city: hotel.city,
});

export const mapHotelFromVmToApi = (hotel: viewModel.Hotel): apiModel.Hotel =>
  (({
    ...hotel,
    id: hotel.id,
    name: hotel.name,
    shortDescription: hotel.description,
    hotelRating: hotel.rating,
    address1: hotel.address,
    city: hotel.city,
  } as unknown) as apiModel.Hotel);
