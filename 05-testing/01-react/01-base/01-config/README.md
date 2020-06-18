# 01 Config

In this example we are going to add a basic setup needed to support unit testing with Jest.

We will start from `00-boilerplate`.

Summary steps:

- Install `jest`.
- Add configuration.
- Add dummy spec.
- External jest config file.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

# Libraries

- We are going to install the main library which we base all our unit tests, [Jest](https://facebook.github.io/jest/en/).

- [jest](https://github.com/facebook/jest): JavaScript Testing library with runner, assertion, mocks, etc.
- [@types/jest](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/df38f202a0185eadfb6012e47dd91f8975eb6151/types/jest): Typings for jest.
- [ts-jest](https://github.com/kulshekhar/ts-jest): A preprocessor with sourcemap support to help use TypeScript with Jest.

```bash
npm install jest @types/jest ts-jest --save-dev
```

# Config

- Jest test commands:
  - `npm test`: to single run
  - `npm run test:watch`: to run all specs after changes.

> NOTE:

> [Jest CLI options](https://facebook.github.io/jest/docs/en/cli.html#options)

> --watchAll To rerun all tests.

> --watch To rerun tests related to changed files.

> --verbose Display individual test results with the test suite hierarchy.

> -i or --runInBand Run all tests serially in the current process, rather than creating a worker pool of child processes that run tests. This can be useful for debugging

### ./package.json

```diff
{
  ...
  "scripts": {
    ...
-   "build": "npm run clean && webpack --config ./config/webpack/prod.js"
+   "build": "npm run clean && webpack --config ./config/webpack/prod.js",
+   "test": "jest --verbose",
+   "test:watch": "npm run test -- --watchAll -i"
  },
  ...
}
```

- [ts-jest basic configuration](https://kulshekhar.github.io/ts-jest/user/config/#basic-usage):

### ./package.json

```diff
{
    ...
- }
+ },
+ "jest": {
+   "preset": "ts-jest"
+ }
```

- Finally we are going to automatically restore mock state between every test:

### ./package.json

```diff
{
  ...
  "jest": {
-   "preset": "ts-jest"
+   "preset": "ts-jest",
+   "restoreMocks": true
  }
}
```

> [Jest configuration options](https://facebook.github.io/jest/docs/en/configuration.html#options)

# Dummy spec

- Let's launch tests in watch mode:

```bash
npm run test:watch
```

- Adding success spec:

### ./src/dummy.spec.ts

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

- Adding failed spec:

### ./src/dummy.spec.ts

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

- One step over, we could be moved jest config outside `package.json` to improve maintainability.

- Move config to `config/test/jest.json` file:

### ./package.json

```diff
...
- },
+ }
- "jest": {
-   "preset": "ts-jest",
-   "restoreMocks": true
- }
}

```

### ./config/test/jest.json

```json
{
  "preset": "ts-jest",
  "restoreMocks": true
}
```

- We only need a detail to keep working with this Jest config, we need to use `rootDir`:

### ./config/test/jest.json

```diff
{
+ "rootDir": "../../",
  "preset": "ts-jest",
  "restoreMocks": true
}
```

- And use that file:

### ./package.json

```diff
{
  ...
  "scripts": {
    ...
-   "test": "jest --verbose",
+   "test": "jest -c ./config/test/jest.json --verbose",
    "test:watch": "npm run test -- --watchAll -i"
  },
  ...
}
```

- Running specs again:

```bash
npm run test:watch
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
