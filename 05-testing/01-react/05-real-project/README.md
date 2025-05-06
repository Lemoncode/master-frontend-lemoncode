# 05 Real project

In this example we will implement tests in a real project.

This boilerplate is copy of the [origin-front-admin repository](https://github.com/Lemoncode/origin-front-admin).

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Let's add specs to `./src/common/components/form/select`:

_./src/common/components/form/select/select.component.spec.tsx_

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import { SelectComponent } from "./select.component";

describe("SelectComponent specs", () => {
  it("should render a select element when it feeds required props and three items", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Run test watch:

```bash
npm test select
```

Let's implement the first spec:

_./src/common/components/form/select/select.component.spec.tsx_

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SelectComponent } from './select.component';

describe('SelectComponent specs', () => {
  it('should render a select element when it feeds required props and three items', () => {
    // Arrange
+   const props: React.ComponentProps<typeof SelectComponent> = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ],
+     label: 'Test label',
+     value: '',
+   };

    // Act
+   render(<SelectComponent {...props} />);

+   const selectElement = screen.getByRole('combobox', { name: 'Test label' });
    // Assert
+   expect(selectElement).toBeInTheDocument();
  });
});
```

> An advantage of using `nodejs imports aliases` is that we don't need to configure for tests. It's already configured.
>
> If you are using webpack or vite aliases you can read this post about [configuring aliases for jest](https://www.basefactor.com/configuring-aliases-in-webpack-vs-code-typescript-jest)

Testing it should shows 3 items when it clicks on select:

_./src/common/components/form/select/select.component.spec.tsx_

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, fireEvent } from '@testing-library/react';
...

+ it('should render a menu with three item when it clicks on select element', () => {
+   // Arrange
+   const props: React.ComponentProps<typeof SelectComponent> = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ],
+     label: 'Test label',
+     value: '',
+   };

+   // Act
+   render(<SelectComponent {...props} />);

+   const selectElement = screen.getByRole('combobox', { name: 'Test label' });
+   fireEvent.click(selectElement);
+   const menuElement = screen.getByRole('listbox');

+   // Assert
+   expect(menuElement).toBeInTheDocument();
+ });
```

> It fails.
>
> We research about it and found this [issue](https://github.com/testing-library/react-testing-library/issues/322)

Install library:

```bash
npm install @testing-library/user-event --save-dev
```

Update spec:

_./src/common/components/form/select/select.component.spec.tsx_

```diff
import React from 'react';
- import { render, screen, fireEvent } from '@testing-library/react';
+ import { render, screen } from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
...

- it('should render a menu with three item when it clicks on select element', () => {
+ it('should render a menu with three item when it clicks on select element', async () => {
    // Arrange
    const props: React.ComponentProps<typeof SelectComponent> = {
      items: [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
      ],
      label: 'Test label',
      value: '',
    };
    // Act
    render(<SelectComponent {...props} />);

    const selectElement = screen.getByRole('combobox', { name: 'Test label' });
-   fireEvent.click(selectElement);
+   expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

+   await userEvent.click(selectElement);
    const menuElement = screen.getByRole('listbox');
+   const itemElementList = screen.getAllByRole('option');

    // Assert
    expect(menuElement).toBeInTheDocument();
+   expect(itemElementList).toHaveLength(3);
  });
```

Testing should calls onChange method when it clicks on second item:

_./src/common/components/form/select/select.component.spec.tsx_

```diff
...

+ it('should calls onChange method with value equals 2 when it clicks on second item', async () => {
+   // Arrange
+   const props: React.ComponentProps<typeof SelectComponent> = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ],
+     label: 'Test label',
+     value: '',
+     onChange: vi.fn(),
+   };

+   // Act
+   render(<SelectComponent {...props} />);

+   const selectElement = screen.getByRole('combobox', { name: 'Test label' });

+   await userEvent.click(selectElement);
+   const itemElementList = screen.getAllByRole('option');
+   await userEvent.click(itemElementList[1]);

+   // Assert
+   expect(props.onChange).toHaveBeenCalledWith(
+     expect.objectContaining({ target: { value: '2' } }),
+     expect.anything()
+   );
+ });
```

Testing should update selected item when it clicks on third item using Formik:

_./src/common/components/form/select/select.component.spec.tsx_

```diff
...
+ it('should update selected item when it clicks on third item using Formik', () => {
+   // Arrange
+   const props: React.ComponentProps<typeof SelectComponent> = {
+     items: [
+       { id: '1', name: 'Item 1' },
+       { id: '2', name: 'Item 2' },
+       { id: '3', name: 'Item 3' },
+     ],
+     label: 'Test label',
+     name: 'selectedItem',
+   };

+   // Act
+   render(<SelectComponent {...props} />);
+ });
```

Create `renderWithFormik`:

_./src/common/components/form/select/select.component.spec.tsx_

```diff
import React from 'react';
+ import { Formik, Form } from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectComponent } from './select.component';

+ const renderWithFormik = (component, initialValues) =>
+   render(
+     <Formik initialValues={initialValues} onSubmit={console.log}>
+       {() => <Form>{component}</Form>}
+     </Formik>
+   );
...

- it('should update selected item when it clicks on third item using Formik', () => {
+ it('should update selected item when it clicks on third item using Formik', async () => {
    ...
    // Act
-   render(<SelectComponent {...props} />);
+   renderWithFormik(<SelectComponent {...props} />, { selectedItem: '1' });

+   const selectElement = screen.getByRole('combobox', { name: "Test label" });

+   expect(selectElement.textContent).toEqual('Item 1');

+   await userEvent.click(selectElement);
+   const itemElementList = screen.getAllByRole('option');
+   await userEvent.click(itemElementList[2]);

+   // Assert
+   expect(selectElement.textContent).toEqual('Item 3');
  });
```

We will testing `./src/common/components/search-bar`. It has a `component` and `hook` file:

_./src/common/components/search-bar/search-bar.component.spec.tsx_

```javascript
import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchBarComponent } from "./search-bar.component";

describe("SearchBarComponent specs", () => {
  it("should render an input with placeholder and searchIcon when it feeds required props", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Let's render the component and check the input element:

_./src/common/components/search-bar/search-bar.component.spec.tsx_

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent specs', () => {
  it('should render an input with placeholder and searchIcon when it feeds required props', () => {
    // Arrange
+   const props: React.ComponentProps<typeof SearchBarComponent> = {
+     search: 'test search',
+     onSearch: vi.fn(),
+     labels: {
+       placeholder: 'test placeholder',
+     },
+   };

    // Act
+   render(<SearchBarComponent {...props} />);

+   const inputElement = screen.getByRole('textbox') as HTMLInputElement;

    // Assert
+   expect(inputElement).toBeInTheDocument();
+   expect(inputElement.value).toEqual('test search');
  });
});

```

> [ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
>
> [Which query should I use?](https://testing-library.com/docs/guide-which-query)

Another option is using:

```javascript
const inputElement = screen.getByPlaceholderText('test placeholder') as HTMLInputElement;
```

Start test watch:

```bash
npm test search-bar
```

If we want to search icon element, we have to update the code:

_./src/common/components/search-bar/search-bar.component.tsx_

```diff
...
  return (
    <TextField
      className={className}
      value={search}
      onChange={e => onSearch(e.target.value)}
      placeholder={labels.placeholder}
      slotProps={{
        input: {
-         startAdornment: <SearchIcon />,
+         startAdornment: <SearchIcon aria-label="Search icon" />,
        },
      }}
    />
  );
};

```

_./src/common/components/search-bar/search-bar.component.spec.tsx_

```diff
...
    // Arrange
    const props = {
      search: 'test search',
      onSearch: jest.fn(),
      labels: {
        placeholder: 'test placeholder',
      },
    };

    // Act
    render(<SearchBarComponent {...props} />);

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
+   const iconElement = screen.getByLabelText('Search icon');

    // Assert
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toEqual('test search');
+   expect(iconElement).toBeInTheDocument();
  });
});

```

Add second spec testing `onSearch` method:

_./src/common/components/search-bar/search-bar.component.spec.tsx_

```diff
import React from 'react';
import { render, screen } from '@testing-library/react';
+ import userEvent from '@testing-library/user-event';
...

+ it('should call onSearch prop when it types on input change event', async () => {
+   // Arrange
+   const props: React.ComponentProps<typeof SearchBarComponent> = {
+     search: '',
+     onSearch: vi.fn(),
+     labels: {
+       placeholder: 'test placeholder',
+     },
+   };

+   // Act
+   render(<SearchBarComponent {...props} />);

+   const inputElement = screen.getByRole('textbox');
+   inputElement.focus();
+   await userEvent.paste('new text search');

+   // Assert
+   expect(props.onSearch).toHaveBeenCalledWith('new text search');
+ });
...

```

Let's add `search-bar.hook` specs:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

```javascript
import { renderHook } from "@testing-library/react";
import { useSearchBar } from "./search-bar.hook";

describe("useSearchBar specs", () => {
  it('should return search text, onSearch method and filteredList when it feeds colors array and "name" field', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Let's implement first spec:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

```diff
import { renderHook } from '@testing-library/react';
import { useSearchBar } from './search-bar.hook';

describe('useSearchBar specs', () => {
  it('should return search text, onSearch method and filteredList when it feeds colors array and "name" field', () => {
    // Arrange
+   const colors = [
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ];

    // Act
+   const { result } = renderHook(() => useSearchBar(colors, ['name']));

    // Assert
+   expect(result.current.search).toEqual('');
+   expect(result.current.onSearch).toEqual(expect.any(Function));
+   expect(result.current.filteredList).toEqual([
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ]);
  });
});

```

Testing `filteredList` when we calls `onSearch` with some color:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

> It's async because we are using useDebounce hook.

```diff
- import { renderHook } from '@testing-library/react';
+ import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearchBar } from './search-bar.hook';

...

+ it('should return filteredList with one element equals red when it calls onSearch method with "red" text', async () => {
+   // Arrange
+   const colors = [
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ];

+   // Act
+   const { result } = renderHook(() =>
+     useSearchBar(colors, ['name'])
+   );

+   act(() => {
+     result.current.onSearch('red');
+   });

+   // Assert
+   await waitFor(() => {
+     expect(result.current.search).toEqual('red');
+     expect(result.current.filteredList).toEqual([{ id: 1, name: 'red' }]);
+   });
+ });

```

Testing it calls to `useDebounce` hook:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

```diff
import { renderHook, act } from '@testing-library/react';
+ import * as commonHooks from '#common/hooks';
import { useSearchBar } from './search-bar.hook';
...

+ it('should calls useDebounce hook when it renders', () => {
+   // Arrange
+   const colors = [
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ];
+   vi.spyOn(commonHooks, 'useDebounce');

+   // Act
+   renderHook(() => useSearchBar(colors, ['name']));

+   // Assert
+   expect(commonHooks.useDebounce).toHaveBeenCalledWith('', 250);
+ });

```

Testing `useDebounce` result:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

```diff
...

+ it('should return filteredList with one element equals blue when useDebounce return text equals "blue"', () => {
+   // Arrange
+   const colors = [
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ];
+   vi.spyOn(commonHooks, 'useDebounce').mockReturnValue('blue');

+   // Act
+   const { result } = renderHook(() => useSearchBar(colors, ['name']));

+   // Assert
+   expect(commonHooks.useDebounce).toHaveBeenCalledWith('', 250);
+   expect(result.current.search).toEqual('');
+   expect(result.current.filteredList).toEqual([{ id: 2, name: 'blue' }]);
+ });

```

Testing it calls to `filterByText` method:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

```diff
import { renderHook, act, waitFor } from '@testing-library/react';
import * as commonHooks from '#common/hooks';
+ import * as filterHelpers from '#common/helpers';
import { useSearchBar } from './search-bar.hook';
...

+ it('should calls filterByText method when it renders', () => {
+   // Arrange
+   const colors = [
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ];
+   vi.spyOn(filterHelpers, 'filterByText');

+   // Act
+   renderHook(() => useSearchBar(colors, ['name']));

+   // Assert
+   expect(filterHelpers.filterByText).toHaveBeenCalledWith(colors, '', ['name']);
+ });

```

Testing `filterByText` result:

_./src/common/components/search-bar/search-bar.hook.spec.tsx_

```diff
...

+ it('should return filteredList with two elements equals blue and green when filterByText return array with two elements blue and green', () => {
+   // Arrange
+   const colors = [
+     { id: 1, name: 'red' },
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ];
+   vi.spyOn(filterHelpers, 'filterByText').mockReturnValue([
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ]);

+   // Act
+   const { result } = renderHook(() => useSearchBar(colors, ['name']));

+   // Assert
+   expect(filterHelpers.filterByText).toHaveBeenCalledWith(colors, '', [
+     'name',
+   ]);
+   expect(result.current.search).toEqual('');
+   expect(result.current.filteredList).toEqual([
+     { id: 2, name: 'blue' },
+     { id: 3, name: 'green' },
+   ]);
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
