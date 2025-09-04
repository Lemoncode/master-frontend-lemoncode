# 05 Component update render

## Summary

We will take as starting point sample \_04-component-unmount.

In this example we will check how to use React.useEffect in order to execute a given code right after each render.

# Steps

- First we copy the previous example, and we execute _npm install_

```bash
npm install
```

- Let's open the _demo.tsx_, we will create a parent and child component as
  we did in previous examples.

_./src/demo.tsx_

```tsx
import React from "react";

export const MyComponent = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      {visible && <MyChildComponent />}
      <button onClick={() => setVisible(!visible)}>
        Toggle Child component visibility
      </button>
    </>
  );
};

const MyChildComponent = () => {
  const [userInfo, setUserInfo] = React.useState({
    name: "John",
    lastname: "Doe",
  });

  return (
    <div>
      <h3>
        {userInfo.name} {userInfo.lastname}
      </h3>
      <input
        value={userInfo.name}
        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
      />
      <input
        value={userInfo.lastname}
        onChange={(e) => setUserInfo({ ...userInfo, lastname: e.target.value })}
      />
    </div>
  );
};
```

- Now it comes the interesting part: by calling _React.useEffect_ without a second
  parameter, the code inside _useEffect_ will be triggered right when the
  component is just mounted and on any update (clean up function will be called
  right before the effect is triggered again).

_./src/demo.tsx_

```diff
const MyChildComponent = () => {
  const [userInfo, setUserInfo] = React.useState({
    name: "John",
    lastname: "Doe"
  });

+ React.useEffect(() => {
+    console.log("A. Called when the component is mounted and after every render");
+  });

  return (
```

- If we execute this, we can check that this code is executed after each render of the component.

- We can also add a function to free up resources just before the next render is executed.

```diff
React.useEffect(() => {
    console.log("A. Called when the component is mounted and after every render");

+    return () =>
+      console.log(
+        "B. Cleanup function called after every render"
+      );
  });
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
