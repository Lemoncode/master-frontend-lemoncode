# 06 Material UI

En un proyecto real es muy normal utilizar librerías de componentes que
implementan estándares como Material Design. En este ejemplo vamos a ver como trabajar con componentes que lleven `material-ui`.

Tomamos como punto de partida `05-router`.

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Vamos a hacer uso de componente `Dialog` de `material-ui`, para ello
  nos creamos el típico dialogo de cookies que aparece la primera vez
  que entramos en una web.

### ./src/cookies-dialog.tsx

```javascript
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

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

- Y vamos a darle uso en nuestra aplicación:

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

- Es hora de añadir pruebas unitarias a este componente, creamos la estructura vacía.

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

- Vamos a comprobar que se muestra un botón con el texto "Learn more about our cookies", para ello:
  - Definimos unos valores para pasarle como propiedad a nuestro componente.
  - Se lo pasamos haciendo uso del spread operator.
  - Utilizando _getByRole_, buscamos el botón con el texto "Learn more about our cookies".

### ./src/cookies-dialog.spec.tsx

```diff
...

describe('CookiesDialog component specs', () => {
- it('', () => {
+ it('should display a button with text "Learn more about our cookies"', () => {
    // Arrange
+   const props = {
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

- Vamos ahora a comprobar que al hacer click se muestra el diálogo (si quieres intentarlo tu
  mismo, lo único como pista que en una vez disparado el evento click tienes que en el getByRole
  buscar _dialog_)

### ./src/cookies-dialog.spec.tsx

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

> Nota: siempre que podamos tenemos que intentar obtener el elemento por role en vez de por contenido de texto

- Vamos a probar que cuando se pincha en el botón de _agree_ se ejecuta _onAgreeClick_, para ello
  usamos un espía sobre _onAgreeClick_

```diff
...

+ it('should call onAgreeClick when it clicks on "Agree" button', async () => {
+   // Arrange
+   const props = {
+     onAgreeClick: jest.fn(),
+   };

+   // Act
+   render(<CookiesDialog {...props} />);

+   const buttonElement = screen.getByRole('button', {
+     name: /learn more about our cookies/i,
+   });
+   await userEvent.click(buttonElement);

+   const agreeButtonElement = screen.getByRole('button', { name: /agree/i });
+   await userEvent.click(agreeButtonElement);

+   // Assert
+   expect(props.onAgreeClick).toHaveBeenCalled();
+ });

```

- En el caso anterior estábamos buscando el botón de agreen en toda la pantalla, una mejora
  que podemos implementar es buscarlo solo en el diálogo, para ello utilizaremos el método
  `within`

```diff
import React from 'react';
- import { render, screen } from '@testing-library/react';
+ import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookiesDialog } from './cookies-dialog';

...



  it('should call onAgreeClick when it clicks on "Agree" button', async () => {
    // Arrange
    const props = {
      onAgreeClick: jest.fn(),
    };

    // Act
    render(<CookiesDialog {...props} />);

-   const buttonElement = screen.getByRole('button', {
-     name: /learn more about our cookies/i,
-   });
+   // The only button available at this moment
+   const buttonElement = screen.getByRole('button');
    await userEvent.click(buttonElement);

+   const dialogElement = screen.getByRole('dialog');

-   const agreeButtonElement = screen.getByRole('button', { name: /agree/i });
+   const agreeButtonElement = within(dialogElement).getByRole('button');
    await userEvent.click(agreeButtonElement);

    // Assert
    expect(props.onAgreeClick).toHaveBeenCalled();
  });

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
