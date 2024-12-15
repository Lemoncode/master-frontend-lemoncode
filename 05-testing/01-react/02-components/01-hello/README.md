# 01 Hello

In this example we will setup `react testing library` and create a simple test over a component that just display and _h1_

We will start from `00-boilerplate`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Let's install [react-testing-library](https://github.com/testing-library/react-testing-library)

```bash
npm install @testing-library/react @testing-library/dom --save-dev
```

We will create a simple component.

_./src/say-hello.tsx_

```javascript
import React from 'react';

interface Props {
  person: string;
}

export const SayHello: React.FC<Props> = (props) => {
  const { person } = props;
  return <h1>Hello {person}</h1>;
};
```

Let's add our first test, we want to instantiate _SayHello_ and check that we are getting an h1 that contains the name of the person that we are passing.

_./src/say-hello.spec.tsx_

```javascript
import React from 'react';
import { render } from '@testing-library/react';
import { SayHello } from './say-hello';

describe('SayHello component specs', () => {
  it('should display the person name', () => {
    // Arrange
    const person = 'John';

    // Act
    const { getByText } = render(<SayHello person={person} />);

    // Assert
    const element = getByText('Hello John');
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('H1');
  });
});
```

> [tagName MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName)

Running:

```bash
npm test

```

Why it's failing? Because the default the `default running environment` is NodeJS.
We have some [environment](https://vitest.dev/config/#environment) alterantives:

- [jsdom](https://github.com/jsdom/jsdom): More mature JavaScript implementation of web standards, for use with Node.js.
- [happy-dom](https://github.com/capricorn86/happy-dom): A lightweight, fast and accurate DOM implementation for Node.js.

```bash
npm install jsdom --save-dev

```

_./config/test/config.ts_

```diff
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
+   environment: 'jsdom',
  },
});


```

Running again:

```bash
npm test

```

Another approach is to use `snapshot testing`:

_./src/say-hello.spec.tsx_

```diff
...

+ it('should display the person name using snapshot testing', () => {
+   // Arrange
+   const person = 'John';

+   // Act
+   const { asFragment } = render(<SayHello person={person} />);

+   // Assert
+   expect(asFragment()).toMatchSnapshot();
+ });

```

It will add a file like:

_./src/\_\_snapshots\_\_/say-hello.spec.tsx.snap_

```
// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`SayHello component specs > should display the person name using snapshot testing 1`] = `
<DocumentFragment>
  <h1>
    Hello John
  </h1>
</DocumentFragment>
`;

```

Or even, we could use `inline snapshots`:

_./src/say-hello.spec.tsx_

```diff
...

+ it('should display the person name using inline snapshot testing', () => {
+   // Arrange
+   const person = 'John';

+   // Act
+   const { asFragment } = render(<SayHello person={person} />);

+   // Assert
+   expect(asFragment()).toMatchInlineSnapshot();
+ });

```

This kind of tests are useful when we want to make sure the UI does not change. The snapshot should be committed to be reviewed as part of the pull request.

On the other hand, this could be a `bad idea` in complex scenarios due to it could be complicated review the whole snapshot and we could fall into a bad habit of updating snapshot tests blindly.

A third approach is using [jest-dom](https://github.com/testing-library/jest-dom) from testing-library (yes, we can even use it with Vitest). It provides a set of custom matchers to create declarative and clear to read expects.

```bash
npm install @testing-library/jest-dom --save-dev

```

Configure it:

_./config/test/setup.ts_

```javascript
import '@testing-library/jest-dom/vitest';
```

Update config:

_./config/test/config.ts_

```diff
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    restoreMocks: true,
    environment: 'jsdom',
+   setupFiles: ['./config/test/setup.ts'],
  },
});
```

> [setupFiles](https://vitest.dev/config/#sequence-setupfiles)

Update `tsconfig`:

_./tsconfig.json_

```diff
...
- "include": ["./src/**/*", "./config/test/config.d.ts"]
+ "include": ["./src/**/*", "./config/test/config.d.ts", "./config/test/setup.ts"]
}
```

Now, we could write it like:

_./src/say-hello.spec.tsx_

```diff
...

+ it('should display the person name using jest-dom', () => {
+   // Arrange
+   const person = 'John';

+   // Act
+   const { getByText } = render(<SayHello person={person} />);

+   const element = getByText('Hello John');

+   // Assert
+   expect(element).toBeInTheDocument();
+ });

```

Here, there are some [best practices using react-testing-library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library), like using `screen`:

> The benefit of using `screen` is you no longer need to keep the `render` call destructure up-to-date as you add/remove the queries you need.

_./src/say-hello.spec.tsx_

```diff
import React from 'react';
- import { render } from '@testing-library/react';
+ import { render, screen } from '@testing-library/react';
import { SayHello } from './say-hello';

describe('SayHello component specs', () => {
  it('should display the person name', () => {
    // Arrange
    const person = 'John';

    // Act
-   const { getByText } = render(<SayHello person={person} />);
+   render(<SayHello person={person} />);

    // Assert
-   const element = getByText('Hello John');
+   const element = screen.getByText('Hello John');
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('H1');
  });

  ...

  it('should display the person name using jest-dom', () => {
    // Arrange
    const person = 'John';

    // Act
-   const { getByText } = render(<SayHello person={person} />);
+   render(<SayHello person={person} />);

-   const element = getByText('Hello John');
+   const element = screen.getByText('Hello John');

    // Assert
    expect(element).toBeInTheDocument();
  });
});

```

Using `getByRole`:

> [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
>
> [Which query should I use?](https://testing-library.com/docs/guide-which-query)

_./src/say-hello.tsx_

```diff
import React from 'react';

interface Props {
  person: string;
}

export const SayHello: React.FunctionComponent<Props> = (props) => {
  const { person } = props;
- return <h1>Hello {person}</h1>;
+ return <h1>Hello <strong>{person}</strong></h1>;
};

```

> We have to update the snapshot test: ok! it's not a big deal, we press `u` key.

But we have two specs still failling because the text is broken up by multiple elements. We can use `getByRole` that it`s a more flexible function and we are testing screen readers too.

_./src/say-hello.tsx_

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SayHello } from './say-hello';

describe('SayHello component specs', () => {
  it('should display the person name', () => {
    // Arrange
    const person = 'John';

    // Act
    render(<SayHello person={person} />);

    // Assert
-   const element = screen.getByText('Hello John');
+   const element = screen.getByRole('heading', {
+     level: 1,
+     name: 'Hello John',
+   });
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('H1');
  });

  ...

  it('should display the person name using jest-dom', () => {
    // Arrange
    const person = 'John';

    // Act
    render(<SayHello person={person} />);

-   const element = screen.getByText('Hello John');
+   const element = screen.getByRole('heading', {
+     level: 1,
+     name: /hello john/i,
+   });

    // Assert
    expect(element).toBeInTheDocument();
  });
});

```

> [h1 MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#technical_summary)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
