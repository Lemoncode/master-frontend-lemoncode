# 06 Async actions

Action are synchronous, how can we manage asynchronous operations?

Let's explore _redux-thunk_ a simple approach.

## Steps to build it

- Copy the content of the `01-hello-action` folder to an empty folder for the sample.

- Install the npm packages described in the [./package.json](./package.json) and verify that it works:

```bash
npm install
```

- Let's install _redux-thunk_

```bash
npm install redux-thunk --save
```

- Le'ts install a library to make ajax calls.

```bash
npm install axios --save
```

- Let's register Redux-thunk middleware in the main index file.

_./src/index.tsx_

```diff
- import { createStore } from "redux";
+ import { createStore, applyMiddleware, compose  } from "redux";
+ import reduxThunk from 'redux-thunk';


- const store = createStore(reducers,
-  window['__REDUX_DEVTOOLS_EXTENSION__']
-  && window['__REDUX_DEVTOOLS_EXTENSION__']()
-  );

+ const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
+
+const store = createStore(reducers, /* preloadedState, */ composeEnhancers(
+   applyMiddleware(reduxThunk)
+ ));
```

- Let's create a member entity.

_./src/model/member.entity.ts_

```typescript
export interface MemberEntity {
  id: number;
  login: string;
  avatar_url: string;
}

export const createDefaultMemberEntity = () => ({
  id: -1,
  login: "",
  avatar_url: "",
});
```

- Let's create an api to get a list of members from Github:

_./src/api/member.api.ts_

```typescript
import { MemberEntity } from "../model/member.entity";
import Axios, { AxiosResponse } from "axios";

const gitHubURL = "https://api.github.com";
const gitHubMembersUrl = `${gitHubURL}/orgs/lemoncode/members`;

export const getMembersCollection = (): Promise<MemberEntity[]> => {
  const promise = new Promise<MemberEntity[]>((resolve, reject) => {
    try {
      Axios.get<MemberEntity[]>(gitHubMembersUrl).then((response) =>
        resolve(mapMemberListApiToModel(response))
      );
    } catch (ex) {
      reject(ex);
    }
  });

  return promise;
};

const mapMemberListApiToModel = ({
  data,
}: AxiosResponse<any[]>): MemberEntity[] =>
  data.map((gitHubMember) => ({
    id: gitHubMember.id,
    login: gitHubMember.login,
    avatar_url: gitHubMember.avatar_url,
  }));
```

- Let's define a new action Id (ajax request completed):

_./common/actionIds.ts_

```typescript
export const actionsIds = {
  MEMBER_REQUEST_COMPLETED: "MEMBER_REQUEST_COMPLETED",
};
```

- Let's create an action that will inform the list of members
  to the reducer once the ajax call has been completed.

_./action/index.ts_

```typescript
import { actionsIds } from "../common/actionIds";
import { MemberEntity } from "../model/member.entity";

export const memberRequestCompleted = (members: MemberEntity[]) => {
  return {
    type: actionsIds.MEMBER_REQUEST_COMPLETED,
    payload: members,
  };
};
```

- Now le't s add the thunk action (request start):

_./action/index.ts_

```diff
import {actionsEnums} from '../common/actionsEnums';
import {MemberEntity} from '../model/member';
+ import {getMembersCollection} from '../api/member.api';

export const memberRequestCompleted = (members: MemberEntity[]) => {
    return {
        type: actionsEnums.MEMBER_REQUEST_COMPLETED,
        payload: members
    }
}

+ export const memberRequest = () => (dispatcher) =>{
+   const promise = getMembersCollection();
+
+   promise.then(
+     (data) => dispatcher(memberRequestCompleted(data))
+   );
+
+   return promise;
+ }
```

- Let's add a new reducer that will hold members state ./src/reducers/member.reducer.ts.

_./src/reducer/member-reducer.ts_

```typescript
import { actionsIds } from "../common/actionIds";
import { MemberEntity } from "../model/member.entity";

export type memberState = MemberEntity[];

export const memberReducer = (state: memberState = [], action) => {
  switch (action.type) {
    case actionsIds.MEMBER_REQUEST_COMPLETED:
      return handleMemberRequestCompletedAction(state, action.payload);
  }

  return state;
};

const handleMemberRequestCompletedAction = (state: memberState, members) => {
  return members;
};
```

- Let's register it:

_./src/reducer/index.js_

```diff
import { combineReducers } from "redux";
import { userProfileReducer, UserProfileState } from "./user-profile.reducer";
+ import { memberReducer, memberState } from './member-reducer';

export interface State {
  userProfileReducer: UserProfileState;
+  memberReducer : memberState;
}

export const reducers = combineReducers<State>({
  userProfileReducer,
+ memberReducer,
});
```

- Let's start by create a simple member component that will
  just display and li (later on we will go porting this to a table),
  and contain a button to trigger a member load.

_./src/components/member-collection.component.tsx_

```typescript
import * as React from "react";
import { MemberEntity } from "../model/member.entity";

interface Props {
  memberCollection: MemberEntity[];
  loadMemberCollection: () => void;
}

export const MemberCollectionComponent = (props: Props) => {
  const { memberCollection, loadMemberCollection } = props;

  // TODO Excercise port this to a table
  return (
    <>
      <button onClick={loadMemberCollection}>Load</button>
      <ul>
        {memberCollection.map((member) => (
          <li>{member.login}</li>
        ))}
      </ul>
    </>
  );
};
```

- Let's binding it with our reducers and actions

_./src/components/member-collection.container.tsx_

```typescript
import { connect } from "react-redux";
import { memberRequest } from "../action";
import { MemberCollectionComponent } from "./member-collection.component";
import { State } from "../reducer";

const mapStateToProps = (state: State) => {
  return {
    memberCollection: state.memberReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadMemberCollection: () => {
      return dispatch(memberRequest());
    },
  };
};

export const MemberCollectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberCollectionComponent);
```

- Let's use this component in the application.

_./src/index.tsx_

```diff
+ import { MemberCollectionContainer } from "./components/member-collection.container";
// (...)

ReactDOM.render(
  <Provider store={store}>
    <>
      <HelloComponent />
+      <MemberCollectionContainer/>
    </>
  </Provider>,

  document.getElementById("root")
);

```

- Excercise A: port this li list to a table,break it down into table
  and row.

- Excercise B: repeat the same steps but hitting the following
  rest api:

https://jsonplaceholder.typicode.com/users

And include filter

https://jsonplaceholder.typicode.com/users?name_like=${filter}
