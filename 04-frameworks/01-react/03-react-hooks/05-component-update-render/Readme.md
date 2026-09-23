# 05 Component update render

## Summary

We will take as starting point sample \_04-component-unmount.

In this example we will check how to use React.useEffect in order to execute a given code right after each render.

# Steps

- First we copy the previous example, and we execute _npm install_

```bash
npm install
```

- Let's open the _demo.tsx_, we will create a simple component.

_./src/demo.tsx_

```tsx
import React from "react";

export const Demo: React.FC = () => {
  const [value, setValue] = React.useState("John");

  return (
    <>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    </>
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
  const [value, setValue] = React.useState("John");

+ React.useEffect(() => {
+    console.log("A. Called right after every render");
+
+  });
+
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

- If we run the code, we can see how both functions are invoked.

As we have seen, if we don’t pass a second argument to _useEffect_, the effect (or callback) provided as the first parameter will run on every re-render. However, if we want to control when the effect and its cleanup function are executed, we must explicitly specify the dependencies in the second parameter.

To verify this behavior, we remove the _useEffect_ from the previous example and create a new one that runs whenever the value of _value_ changes:

```diff
const MyChildComponent = () => {
  const [value, setValue] = React.useState("John");

-   React.useEffect(() => {
-     console.log("A. Called right after every render");
-     return () => console.log("B. Cleanup function called after every render");
-   });

+   React.useEffect(() => {
+     console.log("EFFECT", value);
+     return () => console.log("CLEAN-UP", value);
+   }, [value]);
```

When the input changes, React first runs the cleanup function of the previous effect with the old value, and then runs the effect again with the updated value.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
