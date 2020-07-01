import * as apiModel from './api/hotel-edit.api-model';
import * as viewModel from './hotel-edit.vm';

export const mapHotelFromApiToVm = (
  hotel: apiModel.Hotel
): viewModel.Hotel => ({
  id: hotel.id,
  picture: `${process.env.BASE_PICTURES_URL}/${hotel.thumbNailUrl}`,
  name: hotel.name,
  description: hotel.shortDescription,
  rating: hotel.hotelRating,
  address: hotel.address1,
  city: hotel.city,
});
