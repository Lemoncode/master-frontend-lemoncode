import React from 'react';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { RouterComponent } from 'core/router';
import { GlobalStateProvider } from 'core/context';
import { store } from 'core/store';

const App = () => {
  return (
    <Provider store={store}>
      <GlobalStateProvider>
        <RouterComponent />
      </GlobalStateProvider>
    </Provider>
  );
};

export default hot(App);
