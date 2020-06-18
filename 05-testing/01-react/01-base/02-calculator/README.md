# 02 Calculator

In this example we are going to add a basic example to test plain vanilla javascript.

We will start from `01-config`.

Summary steps:

- Create `calculator` business.
- Add unit tests.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Create calculator:

### ./src/calculator.ts

```javascript
export const add = (a, b) => a + b;
```

- Rename `dummy.spec.ts` to `calculator.spec.ts`:

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

- Now, we need passing a method as parameter, whatever it is, we only want to check that it was called and with which arguments:

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

- How we could test it? Using a `spy`:

### ./src/calculator.spec.ts

```diff
import * as calculator from "./calculator";

describe("Calculator tests", () => {
  describe("add", () => {
    it("should return 4 when passing A equals 2 and B equals 2", () => {
      // Arrange
      const a = 2;
      const b = 2;
+     const isLowerThanFive = jest.fn();

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

- Sometimes, we need to `import` dependencies that we can't pass throught function parameters, we need to import as `external dependency`:

### ./src/business.ts

```javascript
export const isLowerThanFive = value => {
  console.log(`The value: ${value} is lower than 5`);
};
```

- Use it:

### ./src/calculator.ts

```diff
+ import { isLowerThanFive } from './business'

- export const add = (a, b, isLowerThanFive) => {
+ export const add = (a, b) => {
  const result = a + b;

  if(result < 5) {
    isLowerThanFive(result);
  }

  return result;
}

```

- Same as before, we only want to test that function was called and with which arguments, but this time is an `external dependency`, so we need a stub:

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator'
+ import * as business from './business'

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

> Note: As we see in `console`, the `stub` doesn't replace original function behaviour. We have to mock it if we need it.

- Mocking original behaviour:

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

- Finally, we could have a business with too much methods, or even, it is exporting an object:

### ./src/business.ts

```diff
- export const isLowerThanFive = (value) => {
+ export const isLowerThan = (value, max) => {
- console.log(`The value: ${value} is lower than 5`)
+ console.log(`The value: ${value} is lower than ${max}`)
}

+ export const max = 6

```

- Use it:

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

- In this case, we need to mock the whole module:

### ./src/calculator.spec.ts

```diff
import * as calculator from './calculator'
import * as business from './business'

+ jest.mock('./business', () => ({
+   isLowerThan: jest.fn(),
+   max: 7,
+ }))

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
  })
})

```

> If we change max value to 3. spec fails.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
