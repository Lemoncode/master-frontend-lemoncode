import * as apiModel from './api/hotel-collection.api-model';
import * as viewModel from './hotel-collection.vm';

export const mapFromApiToVm = (
  hotel: apiModel.HotelEntityApi
): viewModel.HotelEntityVm => ({
  id: hotel.id,
  picture: `${process.env.BASE_PICTURES_URL}/${hotel.thumbNailUrl}`,
  name: hotel.name,
  description: hotel.shortDescription,
  rating: hotel.hotelRating,
  address: hotel.address1,
});
