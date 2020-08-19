# 05 Real project

In this example we will implement tests in a real project.

We will start from [origin-front-admin repository](https://github.com/Lemoncode/origin-front-admin).

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- We will testing `./src/common/components/search-bar`. It has a `component` and `hook` file:

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchBarComponent } from './search-bar.component';

describe('common/search-bar/search-bar.component specs', () => {
  it('should render an input with placeholder and searchIcon when it feeds required props', () => {
    // Arrange

    // Act

    // Assert
  });
});

```

- Let's render the component and check the input element:

> If we try getByRole, we need something like:

```javascript
<>
  <label htmlFor="inputId">Search</label>
  <input id="inputId" type="text" />
</>
  
screen.getByRole('textbox', {name: /search/i})
```

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchBarComponent } from './search-bar.component';

describe('common/search-bar/search-bar.component specs', () => {
  it('should render an input with placeholder and searchIcon when it feeds required props', () => {
    // Arrange
+   const props = {
+     search: 'test search',
+     onSearch: jest.fn(),
+     labels: {
+       placeholder: 'test placeholder',
+     },
+   };

    // Act
+   render(<SearchBarComponent {...props} />);

+   const inputElement = screen.getByPlaceholderText('test placeholder');

    // Assert
+   expect(inputElement).toBeInTheDocument();
  });
});

```

> [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
> [Which query should I use?](https://testing-library.com/docs/guide-which-query)

- Start test watch:

```bash
npm run test:watch search-bar.component
```

- If we want to search icon element, we have to update the code:

### ./src/common/components/search-bar/search-bar.component.spec.tsx

```diff
```diff

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
