export const mapFromApiToVm = apiEntity => ({
  id: apiEntity.id,
  picture: `${process.env.BASE_PICTURES_URL}${apiEntity.thumbNailUrl}`,
  name: apiEntity.name,
  description: apiEntity.shortDescription,
  rating: apiEntity.hotelRating,
  address: apiEntity.address1,
  city: apiEntity.city,
});
