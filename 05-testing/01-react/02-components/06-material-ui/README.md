# 06 Material UI

In this example we will test components using material-ui library.

We will start from `05-router`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Let's create a simple material-ui `Dialog`:

_./src/cookies-dialog.tsx_

```javascript
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

interface Props {
  onAgreeClick: () => void;
}

export const CookiesDialog: React.FC<Props> = (props) => {
  const { onAgreeClick } = props;
  const [open, setOpen] = React.useState(false);

  const handleAgreeClick = () => {
    setOpen(false);
    onAgreeClick();
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Learn more about our cookies
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>About cookies</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Any information that you voluntarily provide to us, including your
            name and email address, will be used for the sole purpose for which
            the information was provided to us.
          </DialogContentText>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cookie</TableCell>
                <TableCell>Purpose</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>cookie 1</TableCell>
                <TableCell>purpose 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>cookie 2</TableCell>
                <TableCell>purpose 2</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <DialogContentText>
            In addition, communication exchanges on this website are public (not
            private) communications. Therefore, any message that you post on
            this website will be considered and treated as available for public
            use and distribution.
          </DialogContentText>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cookie</TableCell>
                <TableCell>Purpose</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>cookie 3</TableCell>
                <TableCell>purpose 3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>cookie 4</TableCell>
                <TableCell>purpose 4</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleAgreeClick}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

```

Use it:

_./src/app.tsx_

```diff
import React from 'react';
import { Router } from './router';
+ import { CookiesDialog } from './cookies-dialog';

export const App: React.FunctionComponent = () => {
  return (
    <>
      <h1>05-Testing / 01 React</h1>
      <Router />
+     <CookiesDialog
+       onAgreeClick={() => {
+         console.log('Click agree');
+       }}
+     />
    </>
  );
};

```

Let's add some specs:

_./src/cookies-dialog.spec.tsx_

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookiesDialog } from './cookies-dialog';

describe('CookiesDialog component specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Should display a button with text "Learn more about our cookies":

_./src/cookies-dialog.spec.tsx_

```diff
...

describe('CookiesDialog component specs', () => {
- it('', () => {
+ it('should display a button with text "Learn more about our cookies"', () => {
    // Arrange
+   const props: React.ComponentProps<typeof CookiesDialog> = {
+     onAgreeClick: () => {},
+   };

    // Act
+   render(<CookiesDialog {...props} />);

+   const buttonElement = screen.getByRole('button', {
+     name: /learn more about our cookies/i,
+   });

    // Assert
+   expect(buttonElement).toBeInTheDocument();
  });
});

```

Should open a dialog when click on "learn more..." button:

_./src/cookies-dialog.spec.tsx_

```diff
...

+ it('should open dialog when click on "Learn more about our cookies" button', async () => {
+   // Arrange
+   const props = {
+     onAgreeClick: () => {},
+   };

+   // Act
+   render(<CookiesDialog {...props} />);

+   const buttonElement = screen.getByRole('button', {
+     name: /learn more about our cookies/i,
+   });
+   await userEvent.click(buttonElement);

+   const dialogElement = screen.getByRole('dialog');

+   // Assert
+   expect(dialogElement).toBeInTheDocument();
+ });

```

> Instead of get title element text, we should get element by role when it's available.

Should call onAgreeClick when it clicks on "Agree" button:

```diff
...

+ it('should call onAgreeClick when it clicks on "Agree" button', async () => {
+   // Arrange
+   const props = {
+     onAgreeClick: vi.fn(),
+   };

+   // Act
+   render(<CookiesDialog {...props} />);

+   const buttonElement = screen.getByRole('button', {
+     name: /learn more about our cookies/i,
+   });

+   expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

+   await userEvent.click(buttonElement);

+   const agreeButtonElement = screen.getByRole('button', { name: /agree/i });
+   await userEvent.click(agreeButtonElement);

+   // Assert
+   expect(props.onAgreeClick).toHaveBeenCalled();
+ });

```

> In this case filter by name is redundant, we could get the only button available at this moment because the DOM elements outside the dialog are hidden.
>
> Check Dev Tools to see the `aria-hidden` attribute.

Sometimes we need to get elements inside another one, in those cases we can use `within` method:

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookiesDialog } from './cookies-dialog';

...

+ it('should has "Cookie" and "Purpose" headers the second table', async () => {
+   // Arrange
+   const props = {
+     onAgreeClick: vi.fn(),
+   };

+   // Act
+   render(<CookiesDialog {...props} />);

+   const buttonElement = screen.getByRole('button', {
+     name: /learn more about our cookies/i,
+   });
+   await userEvent.click(buttonElement);

+   const [, secondTable] = screen.getAllByRole('table');

+   // Assert
+   const [cookieHeader, purposeHeader] =
+     within(secondTable).getAllByRole('columnheader');
+   expect(cookieHeader).toHaveTextContent('Cookie');
+   expect(purposeHeader).toHaveTextContent('Purpose');
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
