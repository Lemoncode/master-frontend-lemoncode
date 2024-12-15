# 03 Debug

In this example we are going to configure VS Code for debugging specs.

We will start from `02-calculator`.

Summary steps:

- Using JavaScript Debug Terminal

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

## Using JavaScript Debug Terminal

Since we are a using a NodeJS process to run specs, we can use the integrated `JavaScript Debug Terminal` provided by VS Code to debug them.

> More info [here](https://www.lemoncode.tv/curso/vs-code-js-debugging/leccion/javascript-debug-terminal)

We can run all specs in this terminal and adding some breakpoints:

```bash
npm test

```

We can run specs related to specific file or files:

_./src/second.spec.ts_

```typescript
describe('second specs', () => {
  it('should return true', () => {
    expect(true).toBeTruthy();
  });
});
```

```bash
npm test second
npm test second.spec
npm test spec

```

> Use `p` option in vitest's menu.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
