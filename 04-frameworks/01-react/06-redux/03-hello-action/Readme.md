# 03 Hello Action

In this example we are going to create an action, just to allow
update the user profile name

## Steps to build it

- Copy the content of the `02-hello-container` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- Let's let the user update the name from his profile, in order to do that:

  - We will define an action ID to do it so,
  - We will define an action Creator + Action to update the name.
  - We will handle this action in the user Profile reducer.
  - We will create an editUserProfile component.
  - We will create a editUserPofile container to wire up reducer +
    action with ui.

- Let's create the action ID

_./src/common/action-id.ts_

```typescript
export const actionsIds = {
  UPDATE_USERPROFILE_NAME: "UPDATE_USERPROFILE_NAME ",
};
```

- Let's define the action + action creator to update
  the user profile name.

_./src/action.ts_

```typescript
import { actionsIds } from "./common/action-id";

export const updateUserProfileName = (newName: string) => ({
  type: actionsIds.UPDATE_USERPROFILE_NAME,
  payload: newName,
});
```

- Let's handle it in the user profile reducer:

_./src/reducer/user-profile.reducer.ts_

```diff
+ import {actionsIds} from '../common/action-id';

export const userProfileReducer = (state = defaultUserState(), action) => {
-  // Later on we will have a switch statement to replace state on changes.
+ switch (action.type) {
+   case actionsIds.UPDATE_USERPROFILE_NAME:
+     return handleUserProfileAction(state, action.payload);
+ }
+
  return state;
};

+ const handleUserProfileAction = (state : UserProfileState, firstname) => {
+   return {
+     ...state,
+     firstname,
+   };
+ }
```

- Let's jump into the UI side, let's create a name edit component.

_./src/name-edit.component.tsx_

```typescript
import * as React from "react";

interface Props {
  username: string;
  onChange: (name: string) => void;
}

export const NameEditComponent = (props: Props) => {
  return (
    <div>
      <label>Update Name:</label>
      <input
        value={props.username}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
```

- Let's create a name edit container

_./src/name-edit.container.tsx_

```typescript
import { connect } from "react-redux";
import { NameEditComponent } from "./name-edit.component";
import { updateUserProfileName } from "./action";
import { State } from "./reducer";

const mapStateToProps = (state: State) => {
  return {
    username: state.userProfileReducer.firstname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (name: string) => dispatch(updateUserProfileName(name)),
  };
};

export const NameEditContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NameEditComponent);
```

- Let's instantiate the brand new _NameEditContainer_ into
  our main _index_ file.

_./src/index.tsx_

```diff
+ import {NameEditContainer} from './name-edit.container';
```

```diff
ReactDOM.render(
  <Provider store={store}>
    <>
      <HelloContainer />
+     <NameEditContainer />
    </>
  </Provider>,

  document.getElementById("root")
);
```

- Now it's time to run the sample and check the result (open your
  dev tools as well to check how this is working).

```typescript
npm start
```
