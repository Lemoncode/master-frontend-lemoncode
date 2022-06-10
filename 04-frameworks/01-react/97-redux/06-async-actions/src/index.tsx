import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import { reducers } from "./reducer";
import { MemberCollectionContainer } from "./components/member-collection.container";

import { HelloComponent } from "./hello";

const composeEnhancers =
  window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

const store = createStore(
  reducers,
  /* preloadedState, */ composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <Provider store={store}>
    <>
      <HelloComponent />
      <MemberCollectionContainer />
    </>
  </Provider>,
  document.getElementById("root")
);
