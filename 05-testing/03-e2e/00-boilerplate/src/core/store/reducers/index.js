import { combineReducers } from 'redux';
import { loginReducer } from './login.reducer';
import { hotelCollectionReducer } from './hotel-collection.reducer';

export const coreReducer = combineReducers({
  login: loginReducer,
  hotelCollection: hotelCollectionReducer,
});
