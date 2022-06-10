# Cross cutting data

In react we are used to pass data from parent to child (drill prop approach), but there are entries that need
to be accessed from anywhere, cross cutting concerns like user logged in info, or theme info, in order to
handle this React offers us the context, let's see how can we use this and fit it in our architecure.

In this example we will get the logged in user name and store in a global place, then consume it in the
layout header.

# Step by step guide

- First of all we have to decide, this functionallity could fall into three areas:
  - _common_: we could think that storing the user name could be reused in other applications, not a bad place to store it, altough usually
    each app in a real world scenario would store different info.
  - _common-app_: we can think that this is an asset that is going to be reused in several places in the application, but is it going to be
    reused or just invoked on several places?
  - _core_: Can we consider this to be a cross cutting asset?

There's no clear answer :), what's your take on this?

In this example we have chosen to go for the _core_ approach, reasons why:

- Each application store different user profile info (name, login, role, session duration...), is not that straight forward to
  create something universal and strongly typed, we could try using generics etc, but it may get things complex.
- This asset is similar to the routes stuff, we are not going a component like a filter bar and drop it on some pages, we will
  just make use of this cross cutting feature (root instantiate the provider, login store in context, header read from context).

- Let's start implement this, first let's define the context:

- First let's define the profile data structure...

_./src/core/profile/profile.vm.ts_

```tsx
export interface UserProfile {
  userName: string;
}

export const createEmptyUserProfile = (): UserProfile => ({
  userName: "",
});
```

- Now let's define the context and the provider:

_./src/core/profile/profile.context.tsx_

```tsx
import React from "react";
import { UserProfile, createEmptyUserProfile } from "./profile.vm";

interface Context extends UserProfile {
  setUserProfile: (userProfile: UserProfile) => void;
}

const noUserLogin = "no user login";

export const ProfileContext = React.createContext<Context>({
  userName: noUserLogin,
  setUserProfile: () =>
    console.warn(
      "** If you area reading this, likely you have forgotten to add the provider on top of your app"
    ),
});

export const ProfileProvider: React.FC = ({ children }) => {
  const [userProfile, setUserProfile] = React.useState<UserProfile>(
    createEmptyUserProfile()
  );

  return (
    <ProfileContext.Provider
      value={{
        userName: userProfile.userName,
        setUserProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
```

- And let's define a barrel this time directly under user-profile, we could as well add this to the main barrel,
  **small discussion** let's create both and discuss if it's a good approach or not.

_./src/core/profile/index.ts_

```ts
export * from "./profile.context";
```

- Now it's time place this context provider on top of our application (is something to be consumed at a global level).

_./src/app.tsx_

```diff
import React from "react";
import { RouterComponent } from "@/core";
+ import { ProfileProvider } from '@/core/profile';


export const App = () => {
-  return <RouterComponent />;
+  return (<ProfileProvider>
+           <RouterComponent />
+          </ProfileProvider>);
};
```

And on the login component let's store the user name in the context...

_./src/scenes/login.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { CenterLayout } from "@/layouts";
+ import { ProfileContext } from "@/core/profile";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
+  const { setUserProfile } = React.useContext(ProfileContext);

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
+     setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };
```

- Let's now display that info the app bar:

_./src/layouts/app.layout.tsx_

```diff
import React from "react";
+ import { ProfileContext } from "@/core/profile";

-export const AppLayout: React.FC = ({ children }) => (
+ export const AppLayout: React.FC = ({ children }) => {
+  const { userName } = React.useContext(ProfileContext);
+  return (
  <div className="layout-app-container">
-    <div className="layout-app-header">User Logged in</div>
+    <div className="layout-app-header">{userName}</div>
    {children}
  </div>
);
+ }
```

- Let's give a try :)

```diff
npm start
```
