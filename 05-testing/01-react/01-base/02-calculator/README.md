# 02 Calculator

In this example we are going to add a basic example to test plain vanilla javascript.

We will start from `01-config`.

Summary steps:

- Create `calculator` business.
- Add unit tests.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Create calculator:

### ./src/calculator.ts

```javascript
export const add = (a, b) => a + b;
```

Rename `dummy.spec.ts` to `calculator.spec.ts`:

### ./src/calculator.spec.ts

```diff
+ import * as calculator from "./calculator";

- describe('dummy specs', () => {
+ describe("Calculator tests", () => {
+   describe("add", () => {
-     it('should pass spec', () => {
+     it("should return 4 when passing A equals 2 and B equals 2", () => {
        // Arrange
+       const a = 2;
+       const b = 2;

        // Act
+       const result = calculator.add(a, b);

        // Assert
-       expect(true).toBeTruthy();
+       expect(result).toEqual(4);
      });

-     it('should fail spec', () => {
-       // Arrange

-       // Act

-       // Assert
-       expect(true).toBeFalsy();
-     });
+  });
});

```

Why it's failing? Since [jest still doesn't support ES6 modules](https://jestjs.io/docs/ecmascript-modules), we need a `babel` configuration to transpile our code to `commonjs` or [using `ts-jest`](https://kulshekhar.github.io/ts-jest/docs/getting-started/presets):

```bash
npm install ts-jest --save-dev

```

Update jest config:

### ./config/test/jest.js

```diff
export default {
  rootDir: '../../',
  verbose: true,
+ preset: 'ts-jest',
};

```

Run again:

```bash
npm run test:watch

```

> Differences between `toEqual` vs `toBe` vs `toStrictEqual`:
>
> `toBe` fails if `expect({ id: 1 }).toBe({ id: 1 });`: it's not the same object. We should use `toEqual` if we only want the value not the reference
>
> `toStrictEqual` pass if `expect({ id: 1 }).toStrictEqual({ id: 1 });` but it fails if `expect({ id: 1 }).toStrictEqual({ id: 1, name: undefined });`: it should have same fields, even undefined values. We should use `toEqual` if we don't care about it.

Now, we need passing a method as parameter, whatever it is, we only want to check that it was called and with which arguments:

### ./src/calculator.ts

```diff
- export const add = (a, b) => a + b
+ export const add = (a, b, isLowerThanFive) => {
+   const result = a + b;

+   if (result < 5) {
+     isLowerThanFive(result);
+   }

+   return result;
+ }

```

How we could test it? Using a `spy`:

### ./src/calculator.spec.ts

```diff
import * as calculator from "./calculator";

describe("Calculator tests", () => {
  describe("add", () => {
    it("should return 4 when passing A equals 2 and B equals 2", () => {
      // Arrange
      const a = 2;
      const b = 2;
+     const isLowerThanFive = () => {};

      // Act
-     const result = calculator.add(a, b);
+     const result = calculator.add(a, b, isLowerThanFive);

      // Assert
      expect(result).toEqual(4);
    });

+   it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
+     // Arrange
+     const a = 2;
+     const b = 2;
+     const isLowerThanFive = jest.fn();

+     // Act
+     const result = calculator.add(a, b, isLowerThanFive);

+     // Assert
+     expect(isLowerThanFive).toHaveBeenCalled();
+     expect(isLowerThanFive).toHaveBeenCalledWith(4);
+   })
  });
});

```

> If we set `a = 3` this test fail.

Sometimes, we need to `import` dependencies that we can't pass throught function parameters, we need to import as `external dependency`:

### ./src/business/calculator.business.ts

```javascript
export const isLowerThanFive = (value) => {
  console.log(`The value: ${value} is lower than 5`);
};
```

Add barrel file:

### ./src/business/index.ts

```javascript
export * from './calculator.business';

```

Use it:

### ./src/calculator.ts

```diff
+ import { isLowerThanFive } from './business';

- export const add = (a, b, isLowerThanFive) => {
+ export const add = (a, b) => {
  const result = a + b;

  if(result < 5) {
    isLowerThanFive(result);
  }

  return result;
}

```

Same as before, we only want to test that function was called and with which arguments, but this time is an `external dependency`, so we need a stub:

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator';
+ import * as business from './business';

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.fn();

      // Act
-     const result = calculator.add(a, b, isLowerThanFive);
+     const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4)
    })

    it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.fn();
+     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive');

      // Act
-     const result = calculator.add(a, b, isLowerThanFive);
+     const result = calculator.add(a, b);

      // Assert
      expect(isLowerThanFive).toHaveBeenCalled();
      expect(isLowerThanFive).toHaveBeenCalledWith(4);
    })
  })
})

```

Why the second spec is failing? `TypeError: Cannot redefine property: isLowerThanFive`. We could find [many related issues](https://github.com/facebook/jest/issues/880) like this one or [using Object.defineProperty](https://github.com/facebook/jest/issues/6914) like this one. We should update the code:

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator';
- import * as business from './business';
+ import * as business from './business/calculator.business';

...

```

> Note: As we see in `console`, the `stub` doesn't replace original function behaviour. We have to mock it if we need it.
>
> [Alternative using jest.mock and __esModule: true](https://github.com/aelbore/esbuild-jest/issues/26#issuecomment-968853688)

Mocking original behaviour:

### ./src/calculator.spec.ts

```diff
...

    it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive');
+     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive')
+       .mockImplementation((result) => console.log(`This is the result ${result}`));

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(isLowerThanFive).toHaveBeenCalled();
      expect(isLowerThanFive).toHaveBeenCalledWith(4);
    })

```

Note, it's important reset the `mocks` implementation:

### ./src/calculator.spec.ts

```diff
...

+   it('should call to original implementation isLowerThanFive', () => {
+     // Arrange
+     const a = 1;
+     const b = 2;

+     // Act
+     const result = calculator.add(a, b);

+     // Assert
+     expect(result).toEqual(3);
+   });

```

> console.log
>
> This is the result 3

We should restore all mocks after run them:

### ./src/calculator.spec.ts

```diff
...

describe('Calculator tests', () => {
+ afterEach(() => {
+   jest.restoreAllMocks();
+ });

  describe('add', () => {
...

```

Instead of use `restoreAllMocks` on each spec file, we could configure it globally:

### ./config/test/jest.js

```diff
module.exports = {
  rootDir: '../../',
  verbose: true,
  preset: 'ts-jest',
+ restoreMocks: true,
};

```

> [Jest configuration options](https://facebook.github.io/jest/docs/en/configuration.html#options)

### ./src/calculator.spec.ts

```diff
...

describe('Calculator tests', () => {
- afterEach(() => {
-   jest.restoreAllMocks();
- });

  describe('add', () => {
...

```

> Run again `npm run test:watch`

Finally, we could have a business with too much methods, or even, it is exporting an object:

### ./src/business/calculator.business.ts

```diff
- export const isLowerThanFive = (value) => {
+ export const isLowerThan = (value, max) => {
- console.log(`The value: ${value} is lower than 5`)
+ console.log(`The value: ${value} is lower than ${max}`)
}

+ export const max = 6

```

Use it:

### ./src/calculator.ts

```diff
- import { isLowerThanFive } from './business'
+ import { isLowerThan, max } from './business'

export const add = (a, b) => {
  const result = a + b;

- if(result < 5) {
+ if(result < max) {
-   isLowerThanFive(result);
+   isLowerThan(result, max);
  }

  return result;
}

```

In this case, we need to mock the whole module:

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator';
import * as business from './business/calculator.business';

+ jest.mock('./business/calculator.business', () => ({
+   isLowerThan: jest.fn(),
+   max: 7,
+ }));

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4)
    })

-   it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
+   it('should call to isLowerThan when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = jest.spyOn(business, 'isLowerThanFive')
-       .mockImplementation((result) => console.log(`This is the result ${result}`));

      // Act
      const result = calculator.add(a, b);

      // Assert
-     expect(isLowerThanFive).toHaveBeenCalled();
+     expect(business.isLowerThan).toHaveBeenCalled();
-     expect(isLowerThanFive).toHaveBeenCalledWith(4);
+     expect(business.isLowerThan).toHaveBeenCalledWith(4, 7);
    })

-   it('should call to original implementation isLowerThanFive', () => {
+   it('should call to original implementation isLowerThan', () => {
      // Arrange
      const a = 1;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(3);
    });
  })
})

```

> If we change max value to 3. spec fails.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
