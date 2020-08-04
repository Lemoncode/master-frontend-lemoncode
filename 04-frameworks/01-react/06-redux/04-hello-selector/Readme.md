# 04 Hello Selector

Let's play with calculated fields + memoization

## Steps to build it

- Copy the content of the `03-hello-action` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- In this example we are going to:

  - Introduce a last name field in our reducer.
  - Create a selector to calculate name + lastname together (fullname).
  - Show this field in the hello component.

- Let's introduce a lastname field in our reducer:

_./reducer/user-profile.reducer.ts_

```diff
export interface UserProfileState {
  firstname: string;
+ lastname : string;
}

const defaultUserState = (): UserProfileState => ({
  firstname: "John",
+ lastname: "Naukas",
});
```

- Let's install _reselect_ library

```bash
npm install reselect --save
```

- Let's create a chain of selectors to access our userProfile reducer
  and create a selector to calculate the full name.

_./src/reducer/selector.ts_

```typescript
import { createSelector } from "reselect";
import { State } from "./index"; // This is not a good idea because it could create a circular reference, but we'll leave it like that for now
import { UserProfileState } from "./user-profile.reducer";

// To be able to access state.memberListReducer from a different path in case the app grows and we need to relocate our reducer.
export const getUserProfileReducer = (state: State) => state.userProfileReducer;

export const getFullname = createSelector(
  getUserProfileReducer,
  (userProfileReducer) =>
    `${userProfileReducer.firstname} ${userProfileReducer.lastname}`
);
```

- Let's use this selector in the helloContainer component.

_./src/hello.container_

```diff
import { connect } from "react-redux";
import { State } from "./reducer";
import { HelloComponent } from "./hello.component";
+ import { getFullname } from './reducer/selector';

const mapStateToProps = (state: State) => {
  return {
-    username: state.userProfileReducer.firstname
+   username: getFullname(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export const HelloContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloComponent);
```

- Now it's time to run the sample and check the result (open your
  dev tools as well to check how this is working).

```typescript
npm start
```
