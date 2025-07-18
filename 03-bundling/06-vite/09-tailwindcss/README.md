# TailwindCSS

In this example, we are going add TailwindCSS integration.

📌 We start from sample `08-env-vars`.

## Introduction

ℹ️ Before jumping into the sample, let's briefly introduce TailwindCSS.

TailwindCSS is a utility-first framework that provides a set of predefined CSS classes — often referred to as _primitives_. These classes allow you to style elements directly in your markup, instead of writing custom CSS from scratch.

Each class typically maps to a single, simple CSS rule (for example: `h-full` translates to `height: 100%`). This modular approach makes styling faster and more predictable.

While most classes are low-level utilities, TailwindCSS also includes more advanced tools out-of-the-box — like animations, transitions, and responsive variants.

Think of it as a well-organized CSS toolbox: consistent, fast, and highly extensible, making UI development smoother and less prone to complexity than managing large custom stylesheets.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `08-env-vars`. Just copy the project and install:

  ```bash
  npm install
  ```

- Let's add the main TailwindCSS package:

  ```bash
  npm install tailwindcss
  ```

  > ℹ️ `tailwindcss` package is the core of TailwindCSS. It ships the engine that interprets classes (like `bg-red-500` or `h-full`) and generates the proper CSS. It uses `PostCSS` under the hood to compile and optimize styles.

  and also TailwindCSS's Vite plugin:

  ```bash
  npm install @tailwindcss/vite --save-dev
  ```

  > ℹ️ Although not mandatory, this plugin will help us to integrate TailwindCSS compiler with Vite in a more efficient way. Otherwise, we would have to manually setup PostCSS in Vite configuration.

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

  > ℹ️ This CSS import will bring all base styles and utilities from TailwindCSS.

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

  > ℹ️ This line is doing the following:
  >
  > - The directive `@custom-variant` is creating a variant called `dark` that TailwindCSS will use to apply conditional sytles ... but ¿when?
  > - The rest, is an advanced selector that is telling TailwindCSS when to apply the `dark:` variant: whe the current element (`&`) is placed within an HTML tree tree that contains `data-theme="dark"` attribute.

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
    };

  + const toggleTheme = () => {
  +   const html = document.documentElement;
  +   const isDark = html.getAttribute("data-theme") === "dark";
  +   if (isDark) html.removeAttribute("data-theme");
  +   else html.setAttribute("data-theme", "dark");
  + };

    return (
      <>
  +     <button
  +       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  +       onClick={toggleTheme}
  +     >
  +       Toggle theme 🎨
  +     </button>
        <h2>Hello from React</h2>
  ```
