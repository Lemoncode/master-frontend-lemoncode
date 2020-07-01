import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createRootReducer } from './root-reducer';
import { history } from '../router';

const composeEnhancer =
  (process.env.NODE_ENV !== 'production' &&
    window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) ||
  compose;

const initialState = {};

export const store = createStore(
  createRootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(routerMiddleware(history)))
);
