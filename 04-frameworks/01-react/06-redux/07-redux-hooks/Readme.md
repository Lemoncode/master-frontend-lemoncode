# 07 Redux Hooks

Let's replace container with redux hooks.

More info: https://react-redux.js.org/next/api/hooks

## Steps to build it

- Copy the content of the `06-async-actions` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- Let's remove _member-collection.container.tsx_

- Let's update _member-collection.component.tsx_
  and read data from state using _useSelector_ hook
  and dispatch actions using _useDispatch_ hook

_./src/components/member-collection.component.tsx_

```diff
import * as React from "react";
import { MemberEntity } from "model/member.entity";
+ import { State } from "../reducer";
+ import { useSelector, useDispatch } from 'react-redux'
+ import { memberRequest } from "../action";

interface Props {
-  memberCollection: MemberEntity[];
-  loadMemberCollection: () => void;
}

export const MemberCollectionComponent = (props: Props) => {
-  const { memberCollection, loadMemberCollection } = props;
+  const memberCollection = useSelector((state : State) => state.memberReducer)
+  const dispatch = useDispatch();

  // TODO Excercise port this to a table
  return (
    <>
-      <button onClick={loadMemberCollection}>Load</button>
+ <button onClick={() => dispatch(memberRequest())}>
+ Load
+ </button>
      <ul>
        {memberCollection.map(member => (
          <li key={member.id}>{member.login}</li>
        ))}
      </ul>
    </>
  );
};
```

- Let's replace the component in the main index.

_./src/index.tsx_

```diff
- import { MemberCollectionContainer } from "./components/member-collection.container";

+ import { MemberCollectionComponent } from "./components/member-collection.component";

// (...)
ReactDOM.render(
  <Provider store={store}>
    <>
      <HelloComponent />
-      <MemberCollectionContainer />
+      <MemberCollectionComponent />

    </>
  </Provider>,

  document.getElementById("root")
);

```

- Let's give a try and check that application is running as
  expected

```bash
npm start
```

**Exercise:** extract all state management for the page to a hook.

**Excercise:** Discussion here which approach do you preffer?
