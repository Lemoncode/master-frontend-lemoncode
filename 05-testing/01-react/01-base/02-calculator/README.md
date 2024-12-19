# 02 Calculator

In this example we are going to add a basic example to test plain vanilla javascript.

We will start from `01-config`.

Summary steps:

- Create `calculator` business.
- Add unit tests.

## Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Create calculator:

_./src/calculator.ts_

```javascript
export const add = (a, b) => a + b;
```

Rename `dummy.spec.ts` to `calculator.spec.ts`:

_./src/calculator.spec.ts_

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

> We can see that Vitest supports ESModules out of the box.

## Differences between `toEqual` vs `toBe` vs `toStrictEqual`:

- `toBe`

  - Fails if `expect({ id: 1 }).toBe({ id: 1 });`
  - it's not the same object.
  - We should use `toEqual` if we only want the value not the reference.

- `toStrictEqual`
  - Pass if `expect({ id: 1 }).toStrictEqual({ id: 1 });`
  - But it fails if `expect({ id: 1 }).toStrictEqual({ id: 1, name: undefined });`
  - It should have same fields, even undefined values.
  - We should use `toEqual` if we don't care about it.


## Spy

Now, we need passing a method as parameter, whatever it is, we only want to check that it was called and with which arguments:

_./src/calculator.ts_

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

_./src/calculator.spec.ts_

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
+     const isLowerThanFive = vi.fn();

+     // Act
+     calculator.add(a, b, isLowerThanFive);

+     // Assert
+     expect(isLowerThanFive).toHaveBeenCalled();
+     expect(isLowerThanFive).toHaveBeenCalledWith(4);
+   })
  });
});

```

> If we set `a = 3` this test fail.
>
> [Vi fn](https://vitest.dev/api/vi.html#vi-fn)
>
> [SinonJS spy](https://sinonjs.org/releases/v19/spies/)

## Stub

Sometimes, we need to `import` dependencies that we can't pass throught function parameters, we need to import as `external dependency`:

_./src/business/calculator.business.ts_

```javascript
export const isLowerThanFive = (value) => {
  console.log(`The value: ${value} is lower than 5`);
};
```

Add barrel file:

_./src/business/index.ts_

```javascript
export * from './calculator.business';
```

Use it:

_./src/calculator.ts_

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

_./src/calculator.spec.ts_

```diff
import * as calculator from './calculator';
+ import * as business from './business';

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     const isLowerThanFive = () => {};

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
-     const isLowerThanFive = vi.fn();
+     vi.spyOn(business, 'isLowerThanFive');

      // Act
-     calculator.add(a, b, isLowerThanFive);
+     calculator.add(a, b);

      // Assert
-     expect(isLowerThanFive).toHaveBeenCalled();
+     expect(business.isLowerThanFive).toHaveBeenCalled();
-     expect(isLowerThanFive).toHaveBeenCalledWith(4);
+     expect(business.isLowerThanFive).toHaveBeenCalledWith(4);
    })
  })
})

```

> NOTES:
>
> [Vi spyOn](https://vitest.dev/api/vi.html#vi-spyon)
>
> [SinonJS stub](https://sinonjs.org/releases/v19/stubs/)
>
> As we see in `console`, the `stub` doesn't replace original function behaviour. We have to mock it if we need it.

Mocking original behaviour:

_./src/calculator.spec.ts_

```diff
...

    it('should call to isLowerThanFive when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     vi.spyOn(business, 'isLowerThanFive');
+     vi.spyOn(business, 'isLowerThanFive')
+       .mockImplementation((result) => console.log(`This is the result ${result}`));

      // Act
      calculator.add(a, b);

      // Assert
      expect(business.isLowerThanFive).toHaveBeenCalled();
      expect(business.isLowerThanFive).toHaveBeenCalledWith(4);
    })

```

Note, it's important reset the `mocks` implementation:

_./src/calculator.spec.ts_

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

_./src/calculator.spec.ts_

```diff
...

describe('Calculator tests', () => {
+ afterEach(() => {
+   vi.restoreAllMocks();
+ });

  describe('add', () => {
...

```

Instead of use `restoreAllMocks` on each spec file, we could configure it globally:

_./config/test/config.ts_

```diff
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
+   restoreMocks: true,
  },
});

```

> [restoreMocks](https://vitest.dev/config/#restoremocks)

_./src/calculator.spec.ts_

```diff
...

describe('Calculator tests', () => {
- afterEach(() => {
-   vi.restoreAllMocks();
- });

  describe('add', () => {
...

```

## Stub a constant

Finally, we could have a business with too much methods, or even, it is exporting a constant:

_./src/business/calculator.business.ts_

```diff
- export const isLowerThanFive = (value) => {
+ export const isLowerThan = (value, max) => {
- console.log(`The value: ${value} is lower than 5`)
+ console.log(`The value: ${value} is lower than ${max}`)
}

+ export const max: number = 6;

```

Use it:

_./src/calculator.ts_

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

In this case, we need to mock the constant:

_./src/calculator.spec.ts_

```diff
import * as calculator from './calculator';
import * as business from './business';

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
      vi.spyOn(business, 'isLowerThan').mockImplementation((result) =>
        console.log(`This is the result ${result}`)
      );
+     vi.spyOn(business, 'max', 'get').mockReturnValue(7);

      // Act
      calculator.add(a, b);

      // Assert
-     expect(business.isLowerThanFive).toHaveBeenCalled();
+     expect(business.isLowerThan).toHaveBeenCalled();
-     expect(business.isLowerThanFive).toHaveBeenCalledWith(4);
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

## Mock

There are cases where we need to mock a module, for example, if we have a module with a lot of functionality and we don't want to call original functionality but we don't want to mock all methods one by one:

_./src/calculator.spec.ts_

```diff
import * as calculator from './calculator';
import * as business from './business';

+ vi.mock('./business');

describe('Calculator tests', () => {
  describe('add', () => {
    it('should return 4 when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;

      // Act
      const result = calculator.add(a, b);

      // Assert
      expect(result).toEqual(4);
    });

    it('should call to isLowerThan when passing A equals 2 and B equals 2', () => {
      // Arrange
      const a = 2;
      const b = 2;
-     vi.spyOn(business, 'isLowerThan').mockImplementation((result) =>
-       console.log(`This is the result ${result}`)
-     );
      vi.spyOn(business, 'max', 'get').mockReturnValue(7);

...

```
> [vi.mock](https://vitest.dev/api/vi.html#vi-mock)
>
> Notice that we don't see any `console.log` from original `isLowerThan` method.
>
> In this case we can also use `vi.mocked` instead of `vi.spyOn`: `vi.mocked(business.isLowerThan).mockImplementation(...)`
>
> Another use case is to [enable esModule support for a module that doesn't support it](https://github.com/vitest-dev/vitest/issues/3152#issuecomment-1566327217).

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
