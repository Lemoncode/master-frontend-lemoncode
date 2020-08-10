# 01 Hello Container

In this sample we are going to create a container and
wire it up with the redux state (just display the
user profile name).

## Steps to build it

- Copy the content of the `01-hello-redux` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- Now we want to display the data that comes from redux in our hello component.

- We will update our _helloComponent_ and let it receive a property
  called _username_ and rename _hello.tsx_ to _hello.component.tsx_

_./src/hello.component.tsx_

```diff
import * as React from "react";

+ interface Props {
+  username : string;
+ }

- export const HelloComponent = () => {
+ export const HelloComponent = (props : Props) => {
+  const {username} = props;
+
+  return <h2>Hello {username}</h2>
-  return <h2>Hello component !</h2>;
};
```

- Then we will create a _helloContainer_ component that will wire
  up the redux state with the hello component props.

_hello.container.tsx_

```typescript
import { connect } from "react-redux";
import { State } from "./reducer";
import { HelloComponent } from "./hello.component";

const mapStateToProps = (state: State) => {
  return {
    username: state.userProfileReducer.firstname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export const HelloContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloComponent);
```

- Now let's update our main index.tsx file.

```diff
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { reducers } from "./reducer";

- import { HelloComponent } from "./hello";
+ import { HelloContainer } from "./hello.container";
```

```diff
ReactDOM.render(
  <Provider store={store}>
    <>
-      <HelloComponent />
+      <HelloContainer />
    </>
  </Provider>,

  document.getElementById("root")
);
```

- Let's check that the name is being displayed.

```bash
npm start
```
