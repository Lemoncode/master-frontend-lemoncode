# TailwindcCSS

In this example, we are going add TailwindCSS integration.

📌 We start from sample `08-env-vars`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `08-env-vars`. Just copy the project and install:

  ```bash
  npm install
  ```

- Let's add a TailwindCSS package:

  ```bash
  npm install tailwindcss
  ```

  and also TailwindCSS's Vite plugin:

  ```bash
  npm install @tailwindcss/vite --save-dev
  ```

- Let's modify `vite.config.ts` to include the plugin:

  _vite.config.ts_

  ```diff
    import { defineConfig } from "vite";
    import checker from "vite-plugin-checker";
    import react from "@vitejs/plugin-react";
  + import tailwindcss from "@tailwindcss/vite";

    export default defineConfig({
  -   plugins: [checker({ typescript: true }), react()],
  +   plugins: [checker({ typescript: true }), tailwindcss(), react()],
    });
  ```

- Create `src/styles.css` that will contain TailwindCSS entrypoint:

  _src/styles.css_

  ```css
  @import "tailwindcss";
  ```

- And import it in our `index.tsx`;

  _index.tsx_

  ```diff
    import { createRoot } from "react-dom/client";
    import { HelloComponent } from "./hello";
  + import "./styles.css";

    const root = createRoot(document.getElementById("root"));
  ```

- Now let's update `HelloComponent` to include new code with TailwindCSS classes:

  _src/hello.tsx_

  ```diff
    <p>Feature A is {config.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
    <p>Counter state: {counter}</p>
  + <a
  +   href="#"
  +   className="m-2 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
  + >
  +   <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
  +     Card title
  +   </h5>
  +   <p className="font-normal text-gray-700">
  +     Some quick example text to build on the card title and make up the
  +     bulk of the card's content.
  +   </p>
  + </a>
  ```

- Let's run the project:

  ```bash
  npm start
  ```

  🔎 Navigate to [http://localhost:5173](http://localhost:5173) and you'll see the card with style.

- Let's do one more update. We'll add a **dark mode**. Modify `src/styles.css` to add new variant:

  _src/styles.css_

  ```diff
    @import "tailwindcss";
  + @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
  ```

- Update our `HelloComponent` to include styles for our new dark theme:

  \__src/hello.tsx_

  ```diff
  - <a
  -   href="#"
  -   className="m-2 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
  - >
  -   <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
  -     Card title
  -   </h5>
  -   <p className="font-normal text-gray-700 dark:text-gray-600">
  -     Some quick example text to build on the card title and make up the
  -     bulk of the card's content.
  -   </p>
  - </a>
  + <a
  +   href="#"
  +   className="m-2 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
  + >
  +   <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
  +     Card title
  +   </h5>
  +   <p className="font-normal text-gray-700 dark:text-gray-400">
  +     Some quick example text to build on the card title and make up the
  +     bulk of the card's content.
  +   </p>
  + </a>
  ```

- Let's go to our main `index.html` to apply a bunch of general css rules to the whole page:

  _index.html_

  ```diff
  <!DOCTYPE html>
  - <html lang="en">
  + <html lang="en" class="p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <head>
  ```

- Finally, to see our dark styles in action, just add the following attribute update `index.html`:

  _index.html_

  ```diff
    <!DOCTYPE html>
    <html
      lang="en"
      class="p-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
  +   data-theme="dark"
      >
        <head>
  ```

## Optional

- You could also add a toggle component to trigger from dark and light theme! Go to `hello.tsx` and create a button with the following click handler:

  \__src/hello.tsx_

  ```diff
  return (
    <>
  +   <button
  +     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  +     onClick={() => {
  +       const html = document.documentElement;
  +       const isDark = html.getAttribute("data-theme") === "dark";
  +       if (isDark) html.setAttribute("data-theme", "");
  +       else html.setAttribute("data-theme", "dark");
  +     }}
  +   >
  +     Toggle theme
  +   </button>
      <h2>Hello from React</h2>
  ```
