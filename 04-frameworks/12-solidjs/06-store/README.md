# 06 Store

In this example we will use the SolidJS store to manage the state.

We will start from `05-fetching-data`.

# Steps to build it

`npm install` to install previous example packages:

```bash
npm install
```

In this example we will play with the global state in SolidJS, remember that we can just move a signal to a file and use it in any component:

_./src/members.store.ts_

```javascript
import { createSignal } from "solid-js";

interface Member {
  id: string;
  login: string;
  avatar_url: string;
}

export const [members, setMembers] = createSignal<Member[]>([
  {
    id: "4374977",
    login: "nasdan",
    avatar_url: "https://avatars.githubusercontent.com/u/4374977?v=4",
  },
  {
    id: "43609530",
    login: "v-borrego",
    avatar_url: "https://avatars.githubusercontent.com/u/43609530?v=4",
  },
]);

```

_./src/index.tsx_

```diff
- import { createResource, For } from "solid-js";
+ import { For } from "solid-js";
import { render } from "solid-js/web";
import "./styles.css";
+ import { members, setMembers } from "./members.store";

- interface Member {
-   id: string;
-   login: string;
-   avatar_url: string;
- }

- const getMembers = (): Promise<Member[]> =>
-   fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
-     response.json()
-   );

const App = () => {
- const [members, { mutate }] = createResource(getMembers, {
-   initialValue: [],
- });

  const handleDelete = (id) => {
-   mutate((members) => members.filter((member) => member.id !== id));
+   setMembers((members) => members.filter((member) => member.id !== id));
  };

  return (
    <>
-     {members.loading && <p>Loading...</p>}
-     {members.error && <p>Error...</p>}
      <div class="list">
...

- render(() => <App />, document.getElementById("root"));
+ render(
+   () => (
+     <div
+       style={{
+         display: "flex",
+         "justify-content": "space-between",
+       }}
+     >
+       <App />
+       <App />
+     </div>
+   ),
+   document.getElementById("root")
+ );

```

`createSignal` can be used to store almost any data, including objects and arrays. However, the `createStore` is optimized to handle nested reactivity on objects and arrays:

_./src/members.store.ts_

```diff
- import { createSignal } from "solid-js";
+ import { createStore } from "solid-js/store";

...

- export const [members, setMembers] = createSignal<Member[]>([
+ export const [members, setMembers] = createStore<Member[]>([
...

```

_./src/index.tsx_

```diff
...

  return (
    <>
      <div class="list">
-       <For each={members()}>
+       <For each={members}>
-         {(member) => {
+         {(member, index) => {
            console.log("Member");
            return (
              <>
                <img
                  onClick={() => handleDelete(member.id)}
                  src={member.avatar_url}
                />
-               <span>{member.login}</span>
+               <input
+                 value={member.login}
+                 onInput={(e) =>
+                   setMembers(index(), "login", e.currentTarget.value)
+                 }
+               />
              </>
...

```

> Notice that `index` is a signal.
>
> Using object: `setMembers(index(), { login: e.target.value })`
>
> Using member id: `setMembers((list) => list.id === member.id, "login", ...)`
>
> Updating multiple items: `setMembers([0, 1], "login", e.currentTarget.value)`
>
> [More examples using stores](https://docs.solidjs.com/references/api-reference/stores/using-stores)

If we combine with [createContext](https://www.solidjs.com/docs/latest/api#createcontext) we can have multiple instances of the same store (rename to `members.store.tsx`):

_./src/members.store.tsx_

```diff
- import { createStore } from "solid-js/store";
+ import { createStore, SetStoreFunction, Store } from "solid-js/store";
+ import { createContext, ParentComponent } from "solid-js";

interface Member {
  id: string;
  login: string;
  avatar_url: string;
}

+ interface Context {
+   members: Store<Member[]>;
+   setMembers: SetStoreFunction<Member[]>;
+ };

+ export const MemberContext = createContext<Context>();

+ export const MemberProvider: ParentComponent = (props) => {
- export const [members, setMembers] = createStore<Member[]>([
+ const [members, setMembers] = createStore<Member[]>([
    {
      id: "4374977",
      login: "nasdan",
      avatar_url: "https://avatars.githubusercontent.com/u/4374977?v=4",
    },
    {
      id: "43609530",
      login: "v-borrego",
      avatar_url: "https://avatars.githubusercontent.com/u/43609530?v=4",
    },
  ]);

+   return (
+     <MemberContext.Provider value={{ members, setMembers }}>
+       {props.children}
+     </MemberContext.Provider>
+   );
+ };

```

_./src/index.tsx_

```diff
- import { For } from "solid-js";
+ import { For, useContext } from "solid-js";
import { render } from "solid-js/web";
import "./styles.css";
- import { members, setMembers } from "./members.store";
+ import { MemberContext, MemberProvider } from "./members.store";

const App = () => {
+ const { members, setMembers } = useContext(MemberContext);
  const handleDelete = (id) => {
    setMembers((members) => members.filter((member) => member.id !== id));
  };

....

render(
  () => (
    <div
      style={{
        display: "flex",
        "justify-content": "space-between",
      }}
    >
+     <MemberProvider>
        <App />
+     </MemberProvider>
+     <MemberProvider>
        <App />
+     </MemberProvider>
    </div>
  ),
  document.getElementById("root")
);

```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
