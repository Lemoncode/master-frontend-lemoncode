# APIS

Well the app is getting into shape :), now we are going to dig deeper into the pod concept, our goal is to have
a rich pod, but separating concerns and having each file with a clear goal.

In this example we will extract the rest api access from the container into a separate file, we will discuss
where to place this funcionallity and how distinguish between server API model and pod View model, and how to
perform conversions between entities.

# Step by Step Guide

- So now we want to extract the code that access to an API rest from the container, our firs instinct could be to create
  a root _/api/_ folder, but what problems could we have by using this?

- We are taking far away related assets, each time we want to touch the repo and we are on the container we have
  to dig in to the folder api deep blue sea.

- Is hard to know which api is being used where, maybe we can introduce some change by mistake in a given api
  that could impact another pod.

- It's easy to generate conflicts with other developers in the team since we are updating common stuff.

- If we want to extract the pod functionality we have to grant some files from the pod, some other from the api folder,
  is not straight forward.

So let's try a radical change, let's store the api inside the pod... _WTF !!?!?!?! but then if you want to reuse it what happens_:

- Usually most of the calls you are going to make to a REST API will be just used by that give pod and no other pods.
- If there is a call to a given REST API that will be heavily resued by other pods (for instance lookups etc...), then
  we can promote that api to a _core/apis_ folder and use it every where.

- Let's start refactoring the login page, in this case we will go one step further:

  - We have to be prepared for the "real thing" integration, right now we are just check some dummy user/password in a
    synchronous way.
  - Why not creating a client API that will return a promise with the expected result, by following this approach:
    - Once we get the real server API we only need to update the api file, the rest of assets / components won't
      be affected.
    - We can configure using an environment variable whether to use the real or the mock client api (this will let us
      perform e2e testing, or if the server is down keep on progressing using the mock approach).

- First let's simulate a client API:

_./pods/login/login.api.ts_

```ts
export const doLogin = (
  username: string,
  password: string
): Promise<Boolean> => {
  const promise = new Promise<Boolean>((resolve, reject) => {
    // Simulating Ajax Call
    setTimeout(() => {
      resolve(username === "admin" && password === "test");
    }, 500);
  });
  return promise;
};
```

> For the sake of simplicity we are using the standar promise handling, we could use async await but it would
> need some extra setup plumbing (regenerator runtime).

- And now let's consume it in the login container.

_./src/pods/login/login.container.tsx_

```diff
+ import { doLogin } from './login.api';

// (...)

  const handleLogin = (username: string, password: string) => {
-    if (username === "admin" && password === "test") {
-      setUserProfile({ userName: username });
-      navigate(routes.list);
-    } else {
-      alert("User / password not valid, psst... admin / test");
-    }
+    doLogin(username, password).then(result => {
+      if(result) {
+         setUserProfile({ userName: username });
+         navigate(routes.list);
+      } else {
+        alert("User / password not valid, psst... admin / test");
+     }
+    })
  };
```

- This is not api related, but is a good moment to check how easy is to create a custom component,
  if we take a look to this container, it is starting to have some code that is not related with
  rendering, we may think about encapsulating some funcionality in a custom hook, something like:

```diff
+ const useLoginHook = () => {
+  const navigate = useNavigate();
+  const { setUserProfile } = React.useContext(ProfileContext);
+
+  const loginSucceededAction = (userName) => {
+        setUserProfile({ userName });
+        navigate(routes.list);
+  }
+
+  const loginFailedAction = () => {
+    alert("User / password not valid, psst... admin / test");
+  }
+  return {loginSucceededAction, loginFailedAction}
+}

export const LoginContainer: React.FC = () => {
-  const navigate = useNavigate();
-  const { setUserProfile } = React.useContext(ProfileContext);
+  const {loginSucceededAction, loginFailedAction} = useLoginHook();

  const handleLogin = (username: string, password: string) => {
    doLogin(username, password).then((result) => {
      if (result) {
-        setUserProfile({ userName: username });
-        navigate(routes.list);
+        loginSucceededAction(username);
      } else {
-        alert("User / password not valid, psst... admin / test");
+        loginFailedAction();
      }
    });
  };

  return <LoginComponent onLogin={handleLogin} />;
};
```

We could even go on step forward and encapsulate handleLogin in the hook, do you want to give a try?
Is it a good idea?

- Now it's time to apply this refactor to the list pod, BUUUUUUT we have a more complex scenario:

  - In this case our API is returning a list of entities (is not a simple type).
  - This server entities may differ from the entities that we are using in our pod, for instance:
    - Is a third party api and returns a complex structure, and we only need some fields (for instance
      open hotel apis).
    - Is a third party api and the way of naming some fields is not the same as the dictionary we are
      using in our domain.
    - The same view is hitting several API providers (e.g. you want to show hotels availability from
      different beds providers, each of them have their own contracts).
    - The third party api returns some fields, but we need to apply some transformations:
      - Date formatting.
      - Doing some calculations (for instance an API returns us a list of trainings and we just want to show
        a pill with the total number).

- In order to control this we introduce new pieces:
  - The ViewModel are the entities related to the pod UI.
  - The ApiModel are the entities that the server API (Rest API) exposes.
  - A Mapper is the bridge between the ViewModel and API and viceversa: this are just functions that map the
    data in both ways applying the needed transformations.

Our main goal is to preprocess the data so the View (UI) has to focus on displaying the information, rhater
that adapt it from the server to the client.

- Let's get started, first we will create the list api:

_./src/pods/list/list.api.ts_

```tsx
import { MemberEntity } from "./list.vm";

export const getMemberCollection = (): Promise<MemberEntity[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
    response.json()
  );
```

- And let's consume it in the container:

_./src/pods/list/list.container.ts_

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
+ import { getMemberCollection } from './list.api';

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
+    getMemberCollection().then(
+     (memberCollection : MemberEntity[]) => setMembers(memberCollection)
+ );
-    fetch(`https://api.github.com/orgs/lemoncode/members`)
-      .then((response) => response.json())
-      .then((json) => setMembers(json));
  }, []);

  return <ListComponent members={members} />;
};
```

- That was fine, but are doing a dangerous assumption, in the api we are directly returning
  a viewmodel entity, but the Github API returns lot more data, even the names could not be
  the same as the ones we are using, we should establish an _api.model_:

We can take a look to the real api json result and create a more accurate entity:

https://api.github.com/orgs/lemoncode/members

_./src/pods/list/list.api-model.ts_

```ts
export interface MemberEntityApi {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: string;
}
```

Let's update our list api just to consume the real server entity :)

_./src/pods/list.api.ts_

```diff
- import {MemberEntity} from './list.vm'
+ import { MemberEntityApi } from './list.api-model';


- export const getMemberCollection = () : Promise<MemberEntity[]> =>
+ export const getMemberCollection = () : Promise<MemberEntityApi[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`)
  .then((response) => response.json())
```

Now we get an error on the list container, can you tell me whats going on?

To solve this we are going to create a separate piece that will transform from
_MemberEntityApi_ to _MemberEntity_ (viewModel), we will call this a _mapper_,
things to take into considerations:

- In this case the solution is straight forward, usually we will have to handle
  date conversions, field names that do not match, info that can be nested,
  or even some extra calcs to be performed.
- Mappers are an excellent candidate to be implemented using TDD, you should
  be prepared to cover edge cases (null object, undefined, no results...).
- In a read / write form, we will map in both ways api -> vm and vm -> api
  (data retrieval, data write).

We are going to create a simple mapper, we won't take the time to ensure is robust
(we can do this in the testing module).

_./src/pods/list.mapper.ts_

```ts
import * as vm from "./list.vm";
import * as api from "./list.api-model";

export const mapMemberFromApiToVm = (
  member: api.MemberEntityApi
): vm.MemberEntity => ({
  id: member.id.toString(),
  login: member.login,
  avatar_url: member.avatar_url,
});

export const mapMemberCollectionFromApiToVm = (
  memberCollection: api.MemberEntityApi[]
): vm.MemberEntity[] =>
  memberCollection.map((member) => mapMemberFromApiToVm(member));
```

- Now we could try to perform the mapping directly on the container, it would work, buuuut...

_./src/pods/list/list.container.tsx_

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
import { getMemberCollection } from "./list.api";
+ import {mapMemberCollectionFromApiToVm} from "./list.mapper";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
-    getMemberCollection().then((memberCollection: MemberEntity[]) =>
+    getMemberCollection().then((memberCollection) =>
-      setMembers(memberCollection)
+      setMembers(mapMemberCollectionFromApiToVm(memberCollection))
    );
  }, []);

  return <ListComponent members={members} />;
};
```

But there's something dirty here:

- The view should not be aware of a model different
  than the Viewmodel.

- The view is taking care of the transformation process, this should
  be transparent for the UI.

Let's add one more component, the repository:

- The goal of this piece is to provide an API that talks "Viewmodelish".
- It will let us decouple the api model from the view.

_./src/list/list.repository.ts_

```tsx
import { MemberEntity } from "./list.vm";
import { getMemberCollection as getMemberCollectionApi } from "./list.api";
import { mapMemberCollectionFromApiToVm } from "./list.mapper";

export const getMemberCollection = (): Promise<MemberEntity[]> => {
  return new Promise<MemberEntity[]>((resolve) => {
    getMemberCollectionApi().then((result) => {
      resolve(mapMemberCollectionFromApiToVm(result));
    });
  });
};
```

And now let's simplify our list container:

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
- import { getMemberCollection } from "./list.api";
+ import { getMemberCollection } from './list.repository';
- import { mapMemberCollectionFromApiToVm } from "./list.mapper";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    getMemberCollection().then((memberCollection) =>
-      setMembers(mapMemberCollectionFromApiToVm(memberCollection))
+      setMembers(memberCollection)

    );
  }, []);

  return <ListComponent members={members} />;
};
```

What benefits are we getting from following this approach (in a real scenario):

- Each part does it's own job.
- In the future it could be quite easy to promote an api + model to common if needed, we
  only need to create the repository entries to adapt them to the viewmodel in each pod where
  is being used.
- We get separate parts that do one thing and only one thing.
- All the pods have an homogeneus structure.
- We could even specialize resource if needed.
- We have simple entry point for a developer, this is your task, open this pod, this 5 files
  are you need to touch (plus some common goodies).
- We get less conflicts when a team is working in parallel (each member can work on a separate
  pod).
- We can industrialize processes (less magic, more deterministic steps)

** Excercise: Let's do the same with the detail pod **

Steps:

- Create an API model.
- Extract the API.
- Create a mapper API > Vm
- Use it on the container.

- We can get the API model from

https://api.github.com/users/brauliodiez

- Let's build it:

_./src/detail/detail.api-model.ts_

```ts
export interface MemberDetailEntityApi {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  hireable: string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gits: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
```

Let's create extract the API:

_./src/pods/detail.api.ts_

```ts
import { MemberDetailEntityApi } from "./detail.api-model";

export const getMemberDetail = (id: string): Promise<MemberDetailEntityApi> =>
  fetch(`https://api.github.com/users/${id}`).then((response) =>
    response.json()
  );
```

Let's create the mapper:

_./src/pods/detail.mapper.ts_

```ts
import * as vm from "./detail.vm";
import * as api from "./detail.api-model";

export const mapMemberFromApiToVm = (
  member: api.MemberDetailEntityApi
): vm.MemberDetailEntity => ({
  id: member.id.toString(),
  login: member.login,
  name: member.name,
  company: member.company,
  bio: member.bio,
});
```

Let's create the repository:

_./src/pods/detail.repository.ts_

```ts
import { MemberDetailEntity } from "./detail.vm";
import { getMemberDetail as getMemberDetailApi } from "./detail.api";
import { mapMemberFromApiToVm } from "./detail.mapper";

export const getMemberCollection = (
  id: string
): Promise<MemberDetailEntity> => {
  return new Promise<MemberDetailEntity>((resolve) => {
    getMemberDetailApi(id).then((result) => {
      resolve(mapMemberFromApiToVm(result));
    });
  });
};
```

And finally let's consume it in the container:

_./src/detail.container.tsx_

```diff
+ import { getMemberCollection } from './detail.repository';
//(...)

  React.useEffect(() => {
-    fetch(`https://api.github.com/users/${id}`)
-      .then((response) => response.json())
-      .then((json) => setMember(json));
+    getMemberCollection(id)
+      .then(memberDetail => setMember(memberDetail));
  }, []);
```
