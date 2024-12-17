# 01 Config

In this example we are going to add a basic setup needed to support unit testing with Vitest.

We will start from `00-boilerplate`.

Summary steps:

- Install `vitest`.
- Add configuration.
- Add dummy spec.
- External vitest config file.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

- We are going to install the main library which we base all our unit tests, [Vitest](https://vitest.dev/).

- [vitest](https://github.com/vitest-dev/vitest): JavaScript Testing library with runner, assertion, mocks, etc.

> Jest it's a good option for React projects, but it doesn't support [ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules) yet.
>
> [Migration from Jest](https://vitest.dev/guide/migration.html#migrating-from-jest)

```bash
npm install vitest --save-dev
```

# Config

Test commands:
  - `npm test`: it will run all specs in watch mode (by default). But it depends on the [process.env.CI](https://vitest.dev/config/#watch)

> NOTES:
>
> [CLI options](https://vitest.dev/guide/cli.html#options)
>
> [--watch](https://vitest.dev/guide/cli.html#watch): Enable watch mode
>
> [--globals](https://vitest.dev/guide/cli.html#globals): Inject Vitest methods into global scope

_./package.json_

```diff
{
  ...
  "scripts": {
    ...
-   "clean": "rimraf dist"
+   "clean": "rimraf dist",
+   "test": "vitest --globals"
  },
  ...
}
```

# Dummy spec

Let's launch tests in watch mode:

```bash
npm test
```

Adding success spec:

_./src/dummy.spec.ts_

```javascript
describe('dummy specs', () => {
  it('should pass spec', () => {
    // Arrange

    // Act

    // Assert
    expect(true).toBeTruthy();
  });
});
```

We could see that TypeScript doesn't recognize `vitest` methods, we need to add a `vitest` type definition:

_./vitest.d.ts_

```ts
/// <reference types="vitest/globals" />

```

And add it to `tsconfig.json`:

_./tsconfig.json_

```diff
{
  ...
  },
- "include": ["./src/**/*"]
+ "include": ["./src/**/*", "./vitest.d.ts"]
}

```

> Sometimes we need to restart the editor to recognize the new type definition
>
> Control/Command + Shift + P -> TypeScript: Restart TS server

Adding failed spec:

_./src/dummy.spec.ts_

```diff
describe('dummy specs', () => {
  it('should pass spec', () => {
    // Arrange

    // Act

    // Assert
    expect(true).toBeTruthy();
  });

+ it('should fail spec', () => {
+   // Arrange

+   // Act

+   // Assert
+   expect(true).toBeFalsy();
+ });
});
```

# External config

We could create a jest config outside `package.json` to improve maintainability.

> [Config file](https://vitest.dev/config/)

Create config in `config/test/config.ts` file:

_./config/test/config.ts_

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
});

```

> We will add more configuration in next examples when needed

Move also the `.d.ts` file:

_./config/test/config.d.ts_

```ts
/// <reference types="vitest/globals" />

```

> Remove the ./vitest.d.ts file

And update the `tsconfig.json`:

_./tsconfig.json_

```diff
{
  ...
  },
- "include": ["./src/**/*", "./vitest.d.ts"]
+ "include": ["./src/**/*", "./config/test/config.d.ts"]
}

```

Update the `package.json`:

_./package.json_

```diff
{
  ...
  "scripts": {
    ...
-   "test": "vitest --globals"
+   "test": "vitest -c ./config/test/config.ts"
  },
  ...
}
```

Running specs again:

```bash
npm test
```

> We could update the globals property in the config file to `false` to see the difference

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
