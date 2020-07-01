import React from 'react';

const createDefaultState = () => ({
  login: '',
  hotelCollection: [],
});

export const GlobalStateContext = React.createContext({
  state: createDefaultState(),
  dispatch: () => {
    console.warn(
      'if you are reading this, likely you forgot to add the provider on top of your app'
    );
  },
});

const reducer = (state = createDefaultState(), newValue) => ({
  ...state,
  ...newValue,
});

export const GlobalStateProvider = props => {
  const { children } = props;
  const [state, dispatch] = React.useReducer(reducer, createDefaultState());

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
