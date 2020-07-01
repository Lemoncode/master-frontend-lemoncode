import { actionTypes } from '../action-types';

export const hotelCollectionReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.ON_UPDATE_HOTEL_COLLECTION:
      return action.payload;

    default:
      return state;
  }
};
