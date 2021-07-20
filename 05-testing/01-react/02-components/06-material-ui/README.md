# 06 Material UI

In this example we will test components using material-ui library.

We will start from `05-router`.

# Steps

- `npm install` to install previous sample packages:

```bash
npm install
```

- Let's create a simple material-ui `Dialog`:

### ./src/cookies-dialog.tsx

```javascript
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  onAgreeClick: () => void;
}

export const CookiesDialog: React.FunctionComponent<Props> = (props) => {
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
            the information was provided to us. In addition, communication
            exchanges on this website are public (not private) communications.
            Therefore, any message that you post on this website will be
            considered and treated as available for public use and distribution.
          </DialogContentText>
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

- Use it:

### ./src/app.tsx

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

- Let's add some specs:

### ./src/cookies-dialog.spec.tsx

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

- should display a button with text "Learn more about our cookies":

### ./src/cookies-dialog.spec.tsx

```diff
...

describe('CookiesDialog component specs', () => {
- it('', () => {
+ it('should display a button with text "Learn more about our cookies"', () => {
    // Arrange
+   const props = {
+     onAgreeClick: jest.fn(),
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

- should open a dialog when click on "learn more..." button:

### ./src/cookies-dialog.spec.tsx

```diff
...

+ it('should open dialog when click on "Learn more about our cookies" button', () => {
+   // Arrange
+   const props = {
+     onAgreeClick: jest.fn(),
+   };

+   // Act
+   render(<CookiesDialog {...props} />);

+   const buttonElement = screen.getByRole('button', {
+     name: /learn more about our cookies/i,
+   });
+   userEvent.click(buttonElement);

+   const dialogElement = screen.getByRole('dialog');

+   // Assert
+   expect(dialogElement).toBeInTheDocument();
+ });

```

> Instead of get title element text, we should get element by role when it's available.

- should call onAgreeClick when it clicks on "Agree" button:

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookiesDialog } from './cookies-dialog';

...

+ it('should call onAgreeClick when it clicks on "Agree" button', () => {
+   // Arrange
+   const props = {
+     onAgreeClick: jest.fn(),
+   };

+   // Act
+   render(<CookiesDialog {...props} />);

+   // The only button available at this moment
+   const buttonElement = screen.getByRole('button');
+   userEvent.click(buttonElement);

+   const dialogElement = screen.getByRole('dialog');

+   const agreeButtonElement = within(dialogElement).getByRole('button');
+   userEvent.click(agreeButtonElement);

+   // Assert
+   expect(props.onAgreeClick).toHaveBeenCalled();
+ });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
