import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { coreReducer } from './reducers';

export const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    core: coreReducer,
  });
