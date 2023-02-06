# 02 Name Edit

Let's start playing with DOM events. In this example we will create a name editor component.

We will start from `01-hello`.

Summary steps:

- It will display a given name.
- It will let us edit that name.
- We will be playing with dom events (on change).

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's create our _name-edit_ component.

### ./src/name-edit.tsx

```javascript
import React from 'react';

export const NameEdit: React.FunctionComponent = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <>
      <h3>{userName}</h3>
      <input value={userName} onChange={e => setUserName(e.target.value)} />
    </>
  );
};
```

- Let's instantiate this component in our app.

### ./src/app.tsx

```diff
import React from 'react';
+ import { NameEdit } from './name-edit';

export const App: React.FunctionComponent = () => {
- return <h1>05-Testing / 01 React</h1>;
+ return (
+   <>
+     <h1>05-Testing / 01 React</h1>
+     <NameEdit />
+   </>
+ );
};

```

- Let's start implementing a test, the scenario we want to test:

  - Render the _NameEdit_ component.
  - Get the input element.
  - Trigger an update over that input.
  - Check that we get that update on the _h3_ element that is displaying the userName.

- If we try use `getByText`:

### ./src/name-edit.spec.tsx

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NameEdit } from './name-edit';

describe('NameEdit component specs', () => {
  it('should display a heading and input elements with empty userName value', () => {
    // Arrange

    // Act
    render(<NameEdit />);

    const h3Element = screen.getByText('');

    // Assert
  });
});

```

> It fails because it found multiple elements
>
> We could try `getAllByText` too but we should follow the priority

- Let's use `byRole`:

### ./src/name-edit.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NameEdit } from './name-edit';

describe('NameEdit component specs', () => {
  it('should display a label and input elements with empty userName value', () => {
    // Arrange

    // Act
    render(<NameEdit />);

-   const h3Element = screen.getByText('');
+   const h3Element = screen.getByRole('heading', { level: 3 });
+   const inputElement = screen.getByRole('textbox') as HTMLInputElement;

    // Assert
+   expect(h3Element).toBeInTheDocument();
+   expect(inputElement).toBeInTheDocument();
  });
});

```

- should update h3 text when input changes. This library comes with `fireEvent`, it will simply trigger some event over the element but in some cases, [we could have some issues](https://github.com/testing-library/react-testing-library/issues/322). So let's install [@testing-library/user-event](https://github.com/testing-library/user-event) is a package that's built on top of `fireEvent`, but it provides several methods that resemble the user interactions more closely:

```bash
npm install @testing-library/user-event @testing-library/dom --save-dev

```

### ./src/name-edit.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
import { NameEdit } from './name-edit';

...
+ it('should update h3 text when input changes', async () => {
+   // Arrange

+   // Act
+   render(<NameEdit />);

+   const inputElement = screen.getByRole('textbox') as HTMLInputElement;

+   await userEvent.type(inputElement, 'John');
+   const h3Element = screen.getByRole('heading', { level: 3 });

+   // Assert
+   expect(inputElement.value).toEqual('John');
+   expect(h3Element.textContent).toEqual('John');
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
