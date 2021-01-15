# 01 Hello Redux

In this sample we are going to include the plumbing to
setup redux and include a very simple reducer

## Steps to build it

- Copy the content of the `00 Boilerplate` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- Let's install _redux_ and _react-redux_ and it's typings.

```bash
npm install react react-dom redux react-redux --save
```

```bash
npm install @types/react @types/react-dom @types/react-redux --save-dev
```

- Now we will start creating the state of the application, we will
  just create a simple reducer that will hold the user profile information.

_./src/reducer/user-profile.reducer.ts_

```typescript
export interface UserProfileState {
  firstname: string;
}

const defaultUserState = (): UserProfileState => ({
  firstname: "John Doe",
});

export const userProfileReducer = (state = defaultUserState(), action) => {
  // Later on we will have a switch statement to replace state on changes.
  return state;
};
```

- Now that we got the reducer, we will wire it up using _combineReducers_

_./src/reducer/index.ts_

```typescript
import { combineReducers } from "redux";
import { userProfileReducer, UserProfileState } from "./user-profile.reducer";

export interface State {
  userProfileReducer: UserProfileState;
}

export const reducers = combineReducers<State>({
  userProfileReducer,
});
```

- Let's create the store in our main index entry point.

_./src/index.tsx_

```diff
import * as React from "react";
import * as ReactDOM from "react-dom";
+ import { createStore } from 'redux';
+ import { Provider } from 'react-redux';
+ import {reducers } from './reducer';

import { HelloComponent } from "./hello";

+ const store = createStore(reducers);


ReactDOM.render(
+ <Provider store={store}>
+   <>
    <HelloComponent />
+   </>
+ </Provider>
  , document.getElementById("root"));
```

- Let's connect redux dev tools with the store.

_./src/index.tsx_

```diff
const store = createStore(reducers
+  ,window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()
);

ReactDOM.render(

```

- Let's run the sample and check that we got redux tools
  up and running.

```bash
npm start
```
