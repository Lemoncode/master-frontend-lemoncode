# 05 List Refactor

## Summary

This example takes the _04-list-users_ example as a starting point.

We will add some refactor to enhance project readiblity and maintalibility.

## Step by step guided example

- First we copy the above example, and do an _npm install_

```bash
npm install
```

- Before we go on, let's fix a small bug we left in the previous example.
  previous example, we forgot to put the key in the map where we dynamically generated the files with the
  the files with the members that belong to an organisation.

_./src/app.tsx_

```diff
{members.map((member) => (
-  <>
+  <React.Fragment key={member.id}>
    <img src={member.avatar_url} />
    <span>{member.id}</span>
    <span>{member.login}</span>
+  </React.Fragment>
- </>
```

- Secondly, right now we are not typing the list of members we receive from github.
  github, wouldn't it be good to type it to avoid making silly mistakes when, for example, writing the field names?
  typing the names of the fields, let's go to it:

_./src/model.ts_

```typescript
export interface MemberEntity {
  avatar_url: string;
  id: string;
  login: string;
}
```

- We will now import it into our _app.tsx_ and type our state

_./src/app.tsx_

```diff
import React from "react";
+ import { MemberEntity } from './model';

export const App = () => {
-  const [members, setMembers] = React.useState([]);
+  const [members, setMembers] = React.useState<MemberEntity[]>([]);
```

- Now, if we make a mistake when writing one of the fields in our
  row component, the IDE will mark it in red.

- The next best thing we're going to introduce has to do with the JSX we generated,
  notice that we've barely put in a table and we're already having trouble following it.
  simplify this? The answer is yes, we can extract the part that paints a member of the table to a component.
  in the table to a component, we can leave it in the same file or extract it to a separate file.
  to a separate file, let's do it:

_./src/member-grid-row.tsx_

```tsx
import React from "react";
import { MemberEntity } from "./model";

interface Props {
  member: MemberEntity;
}

export const MemberTableRow: React.FC<Props> = (props) => {
  const { member } = props;

  return (
    <React.Fragment key={member.id}>
      <img src={member.avatar_url} />
      <span>{member.id}</span>
      <span>{member.login}</span>
    </React.Fragment>
  );
};
```

- See how interesting it is how a component remains a black box that exposes its interaction with the outside via properties.

- Now we can replace it in App:

```diff
import React from "react";
import { MemberEntity } from './model';
+ import { MemberTableRow} from './member-table-row';
```

```diff
  return (
    <div className="user-list-container">
      <span className="header">Avatar</span>
      <span className="header">Id</span>
      <span className="header">Name</span>
      {members.map((member) => (
+          <MemberTableRow key={member.id} member={member}>
-          <React.Fragment key={member.id}>
-            <img src={member.avatar_url} />
-            <span>{member.id}</span>
-            <span>{member.login}</span>
-          </React.Fragment>
      ))}
    </div>
  );
```

> We could even create a subcomponent for the table headers if we wanted to,
> this will be an excercise to do in a next example.

- One last step, the _App_ component still has too much code, it should just instantiate the main component and that's it.
  the main component and that's it, let's simplify this.

- We create a component called _member-table.tsx_ and encapsulate the table in that component.

_./src/member-table.tsx_

```tsx
import React from "react";
import { MemberEntity } from "./model";
import { MemberTableRow } from "./member-table-row";

export const MemberTable = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return (
    <div className="user-list-container">
      <span className="header">Avatar</span>
      <span className="header">Id</span>
      <span className="header">Name</span>
      {members.map((member) => (
        <MemberTableRow key={member.id} member={member} />
      ))}
    </div>
  );
};
```

- And the _App_ component remains very simple:

_./src/app.tsx_

```diff
import React from "react";
- import { MemberEntity } from './model';
+ import {MemberTable} from './member-table';

export const App = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

-  React.useEffect(() => {
-    fetch(`https://api.github.com/orgs/lemoncode/members`)
-      .then((response) => response.json())
-      .then((json) => setMembers(json));
-  }, []);

  return (
+    <MemberTable/>
-    <>
-      <div className="user-list-container">
-        <span className="header">Avatar</span>
-        <span className="header">Id</span>
-        <span className="header">Name</span>
-        {members.map((member) => (
-          <React.Fragment key={member.id}>
-            <img src={member.avatar_url} />
-            <span>{member.id}</span>
-            <span>{member.login}</span>
-          </React.Fragment>
-        ))}
-      </div>
-    </>
  );
};
```

Can we continue to clean up this code and build something that is maintainable and scalable in the future? The answer is yes, we will see
we'll see later on.
