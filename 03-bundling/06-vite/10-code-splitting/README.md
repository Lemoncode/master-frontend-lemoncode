# Code Splitting

In this example, we are going add TailwindCSS integration.

📌 We start from sample `09-tailwindcss`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `09-tailwindcss`. Just copy the project and install:

  ```bash
  npm install
  ```

- Let's run the project:

  ```bash
  npm start
  ```

  🔎 Navigate to [http://localhost:5173](http://localhost:5173).

ℹ️ Code splitting is a performance optimization technique in frontend development where the application's JavaScript is broken into smaller, separate chunks that can be loaded on demand, rather than all at once.

This means parts of the code are only loaded when needed (e.g. when a user navigates to a specific page or triggers a certain action), which reduces the initial bundle size, improves load times, and enhances user experience.

Now we can go the topic: **code splitting**. In this example we're going to use a module that is loaded on demand.

- Let's add _src/math.ts_ file.

  _src/math.ts_

  ```ts
  const randomBetween = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  export const operate = (n: number): number => {
    const base = Math.min(n, randomBetween(0, 50));
    const multiplier = randomBetween(1, 15);
    return base + multiplier;
  };
  ```

  The `operate` function is exported to apply a math operation to our counter.

- Modify `src/hello.tsx` to import the module dynamically and apply the `operate` function to the `counter` state:

  _src/hello.tsx_

  ```diff
    }, []);

  + const applyOperation = async () => {
  +   const { operate } = await import("./math");
  +   setCounter((prevCounter) => operate(prevCounter));
  + };

    return (
      <>
        <h2>Hello from React</h2>
        <p>Api server is {config.API_BASE}</p>
        <p>Feature A is {config.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
        <p>Counter state: {counter}</p>
  +     <button
  +       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  +       onClick={applyOperation}
  +     >
  +       Apply operation
  +     </button>
        <a
          href="#"
          className="m-2 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
  ```

  ⚠️ Notice how we imported the `math` module dynamically using `import()` syntax. Vite will extract this module into its own bundle and will rely on native `import()` to download it at the time the button is clicked. Even if the user clicks multiple times on the button the module will be downloaded once.

  🔎 Try yourself by clicking the button!

- Perform a build using `npm run build`:

  ```bash
  npm run build
  ```

  🔎 Notice two JavaScript files has been created under `dist/assets`: `index-[hash].js` and `math-[hash].js`.
