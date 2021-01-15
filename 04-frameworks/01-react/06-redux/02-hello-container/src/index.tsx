import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducers } from "./reducer";

import { HelloContainer } from "./hello.container";

const store = createStore(
  reducers,
  window["__REDUX_DEVTOOLS_EXTENSION__"] &&
    window["__REDUX_DEVTOOLS_EXTENSION__"]()
);

ReactDOM.render(
  <Provider store={store}>
    <>
      <HelloContainer />
    </>
  </Provider>,
  document.getElementById("root")
);
