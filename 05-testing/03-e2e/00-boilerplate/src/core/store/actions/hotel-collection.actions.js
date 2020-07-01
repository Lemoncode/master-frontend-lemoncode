import { actionTypes } from '../action-types';

export const onUpdateHotelCollection = hotelCollection => ({
  type: actionTypes.ON_UPDATE_HOTEL_COLLECTION,
  payload: hotelCollection,
});
