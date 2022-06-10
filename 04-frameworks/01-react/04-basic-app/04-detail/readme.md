# 04 Details

## Summary

This example takes the _03-list_ example as a starting point.

We are going to show the detail of a Github user: for them
we keep the id of the user we chose in the list,
call the Github API to get its details, and display them in a component.
display them in a component.

## Step by Step Guide

- First we copy the previous example, and do an _npm install_.

```bash
npm install
```

- If we want to see what kind of data we are going to handle, we can open the web browser and see what Github's Rest API returns.

```bash
https://api.github.com/users/brauliodiez
```

EXCERCISE OPTION
> With what you have done in the previous examples you would be able to set up
> this page by yourself, I advise you to pause this > exercise and try it out.
> exercise and try it out.

- We are going to create an interface to have typed to show the details of a member.

_./src/detail.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";

+ interface MemberDetailEntity {
+   id : string;
+   login: string;
+   name: string;
+   company: string;
+   bio: string;
+ }
+
+ const createDefaultMemberDetail = () => ({
+   id: '',
+   login: '',
+   name: '',
+   company: '',
+   bio: '',
+ })
+
export const DetailPage: React.FC = () => {
+  const [member, setMember] = React.useState<MemberDetailEntity>(createDefaultMemberDetail());
  const { id } = useParams();

  return (
    <>
      <h2>Hello from Detail page</h2>
      <h3>User Id: {id}</h3>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

- Let's do the data loading:

_./src/detail.tsx_

```diff
export const DetailPage: React.FC = () => {
  const [member, setMember] = React.useState<MemberDetailEntity>();
  const { id } = useParams();

+  React.useEffect(() => {
+    fetch(`https://api.github.com/users/${id}`)
+      .then((response) => response.json())
+      .then((json) => setMember(json));
+  }, []);


  return (
    <>
      <h2>Hello from Detail page</h2>
      <h3>User Id: {id}</h3>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

- Let's show the data:

_./src/detail.tsx_

```diff
export const DetailPage: React.FC = () => {
  const [member, setMember] = React.useState<MemberDetailEntity>();
  const { id } = useParams();

  return (
    <>
      <h2>Hello from Detail page</h2>
-      <h3>User Id: {id}</h3>
+      <p> id: {member.id}</p>
+      <p> login: {member.login}</p>
+      <p> name: {member.name}</p>
+      <p> company: {member.company}</p>
+      <p> bio: {member.bio}</p>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

