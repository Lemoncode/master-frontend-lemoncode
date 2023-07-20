# 07 Router

In this example we will use the `Solid Router` to navigate between pages. You can find the official documentation [here](https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router).

We will start from `06-store`.

## Steps to build it

`npm install` to install previous example packages:

```bash
npm install
```

## Install the router package

```bash
npm install @solidjs/router
```

## Create MemberList page

We will move the necessary code from the App component to create the first page (MemberList):

_./src/member-list.page.tsx:_

```tsx
import { For, useContext } from "solid-js";
import "./styles.css";
import { MemberContext } from "./members.store";

export const MemberListPage = () => {
  const { members, setMembers } = useContext(MemberContext);
  const handleDelete = (id) => {
    setMembers((members) => members.filter((member) => member.id !== id));
  };

  return (
    <>
      <div class="list">
        <For each={members}>
          {(member, index) => {
            return (
              <>
                <img
                  onClick={() => handleDelete(member.id)}
                  src={member.avatar_url}
                />
                <input
                  value={member.login}
                  onInput={(e) =>
                    setMembers(index(), "login", e.currentTarget.value)
                  }
                />
              </>
            );
          }}
        </For>
      </div>
    </>
  );
};
```

Now we are going to clean the App component and the render:

_/index.tsx:_

```tsx
import { render } from "solid-js/web";
import "./styles.css";
import { MemberProvider } from "./members.store";
import { MemberListPage } from "./member-list.page";

const App = () => {
  return <MemberListPage />;
};

render(
  () => (
    <MemberProvider>
      <App />
    </MemberProvider>
  ),
  document.getElementById("root")
);
```

## Create MemberDetail page

Let's create a second page to see the detail of a `Member`:

_./src/member-detail.page.tsx:_

```tsx
import { Component } from "solid-js";

export const MemberDetailPage: Component = () => {
  return <h1>Hello from Member Detail Page</h1>;
};
```

## Create router

We are going to use `SolidJS Router` components to create our routes and assign the components:

_/index.tsx:_

```diff
+ import { Router, Route, Routes } from "@solidjs/router";
import { render } from "solid-js/web";
import "./styles.css";
import { MemberProvider } from "./members.store";
import { MemberListPage } from "./member-list.page";
+ import { MemberDetailPage } from "./member-detail.page";

const App = () => {
- return <MemberListPage />;
+ return (
+   <Router>
+     <Routes>
+       <Route path="/" element={<MemberListPage />} />
+       <Route path="/member/:id" element={<MemberDetailPage />} />
+     </Routes>
+   </Router>
+ );
};

render(
  () => (
    <MemberProvider>
      <App />
    </MemberProvider>
  ),
  document.getElementById("root")
);
```

## Add link to navigate to detail page

_./src/member-list.page.tsx:_

To add a navigation link, we will use the `A` component of the router:

```diff
import { For, useContext } from "solid-js";
import "./styles.css";
import { MemberContext } from "./members.store";
+ import { A } from "@solidjs/router";

export const MemberListPage = () => {
  const { members, setMembers } = useContext(MemberContext);
  const handleDelete = (id) => {
    setMembers((members) => members.filter((member) => member.id !== id));
  };

  return (
    <>
      <div class="list">
        <For each={members}>
          {(member, index) => {
            return (
              <>
                <img
                  onClick={() => handleDelete(member.id)}
                  src={member.avatar_url}
                />
                <input
                  value={member.login}
                  onInput={(e) =>
                    setMembers(index(), "login", e.currentTarget.value)
                  }
                />
+               <A href={`/member/${member.login}`}>View Details</A>
              </>
            );
          }}
        </For>
      </div>
    </>
  );
};
```

And we modify the styles in order to add the new column:

_./src/styles.css:_

```diff
.list {
  display: grid;
- grid-template-columns: auto 3fr;
+ grid-template-columns: auto 3fr 1fr;
  grid-gap: 10px;
}

.list > img {
  width: 80px;
}
```

We check that it is working properly:

```bash
npm start
```

### Read route params

We can read the route params using the `useParams` hook:

_./src/member-detail.page.tsx:_

```diff
import { Component } from "solid-js";
+ import { useParams } from "@solidjs/router";

export const MemberDetailPage: Component = () => {
+ const params = useParams();

- return <h1>Hello from Member Detail Page</h1>;
+ return <h1>Hello from Member Detail Page. Member id: {params.id}</h1>;
};
```

We can now check that we get the `Member` id correctly:

```bash
npm start
```

> You can use the `useNavigate` hook to navigate programmatically. See the [official documentation](https://docs.solidjs.com/guides/how-to-guides/routing-in-solid/solid-router#usenavigation) for more details.

## Exercise

As an exercise we propose you to finish the `MemberDetail` page to get the data of a Member and display it in the browser.

> Member API: https://api.github.com/users/{login}
> Tip: use a `createResource` to do it.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
