import { actionTypes } from '../action-types';

export const onUpdateLogin = login => ({
  type: actionTypes.ON_UPDATE_LOGIN,
  payload: login,
});
