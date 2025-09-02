## 01 Vite boiler plate

## Summary

In this example there is a vite boiler plate set up with Typescript support, just in the step before
to adding React support.

It is based on the Vite examples.

This example is the only one that doesn't have a step-by-step (if you need guidance, you can go to the
vite examples you'll find in this repository).

Highlights:

- Added TypeScript as a local dev dependency.
- Switched project to use ES Modules in package.json.
- Created a `tsconfig.json` with a minimal configuration.
- Vite uses esbuild for transpilation (fast, no type checking).
- Enabled `isolatedModules` and `useDefineForClassFields` for `esbuild`compatibility.

In the following example we will take this as a starting point and we will go step by step adding
support for React.
