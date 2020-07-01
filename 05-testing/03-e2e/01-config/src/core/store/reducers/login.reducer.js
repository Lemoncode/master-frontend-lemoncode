import { actionTypes } from '../action-types';

export const loginReducer = (state = '', action) => {
  switch (action.type) {
    case actionTypes.ON_UPDATE_LOGIN:
      return action.payload;

    default:
      return state;
  }
};
