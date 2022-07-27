# 03 Styles

Let's add styles to pages and how it works with Nextjs.

We will start from `02-navigation`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Nextjs has built-in [css](https://nextjs.org/docs/basic-features/built-in-css-support) (or [sass](https://nextjs.org/docs/basic-features/built-in-css-support#sass-support)) support with css modules:

_./src/components/car-list.module.css_

```css
.root {
  list-style: none;
  background-color: chocolate;
  color: white;
}
```

> Important the `module`.css suffix

_./src/components/car-list.component.tsx_

```javascript
import React from 'react';
import classes from './car-list.module.css';

export const CarListComponent: React.FunctionComponent = (props) => {
  return (
    <ul className={classes.root}>
      <li>Audi Q8</li>
      <li>BMW X7</li>
    </ul>
  );
};
```

- Add barrel file:

_./src/components/index.ts_

```javascript
export * from './car-list.component';
```

- Update `cars` page:

_./src/pages/cars.tsx_

```diff
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
+ import { CarListComponent } from '../components';

const CarListPage = () => {
  const router = useRouter();
  const onNavigateBack = () => {
    router.push('/'); // or router.back()
  };

  return (
    <>
      <Head>
        <title>Rent a car - Car list</title>
      </Head>
      <h2>Car list page</h2>
+     <CarListComponent />
-     <ul>
-       <li>Audi Q8</li>
-       <li>BMW X7</li>
-     </ul>
...

```

> Check Chrome Devtools > Network > Slow 3G

- It looks great but let's try on production mode:

```bash
npm run build
npm run start:prod
```

> Check Chrome Devtools > Network > Slow 3G

- That means that styles are supported by server side rendering.

- Let's install [emotion](https://emotion.sh/docs/introduction) to works with CSS-in-JS:

```bash
npm i @emotion/css --save
npm i @emotion/babel-plugin --save-dev
```

> [@emotion/babel-plugin](https://emotion.sh/docs/@emotion/babel-plugin)

- Configure it:

_./.babelrc_

```json
{
  "presets": ["next/babel"],
  "plugins": ["@emotion"]
}
```

- Update styles (rename to `car-list.styles.ts`):

_./src/components/car-list.styles.ts_

```diff
+ import { css } from '@emotion/css';

- .root {
+ export const root = css`
    list-style: none;
    background-color: chocolate;
    color: white;
- }
+ `;

```

_./src/components/car-list.component.tsx_

```diff
import React from 'react';
- import classes from './car-list.module.css';
+ import * as classes from './car-list.styles';

...

```

> Check Chrome Devtools > Network > Slow 3G

- It looks great but let's try on production mode:

```bash
npm run build
npm run start:prod

```

> Open `http://localhost:8080/cars` with
> Check Chrome Devtools > Network > Slow 3G

- In this case, Nextjs will apply styles after render page on client.

- Let's add some configuration for this case:

```bash
npm install @emotion/server --save
```

> [@emotion/server](https://emotion.sh/docs/@emotion/server) > [SSR Docs](https://emotion.sh/docs/ssr) and [Nextjs-emotion example](https://emotion.sh/docs/ssr#nextjs) > [Nextjs custom document](https://nextjs.org/docs/advanced-features/custom-document)
> Note: If we use `@emotion/react` it supports SSR by default (without install @emotion/server) but you need to provide css prop instead of standard classNames. [@emotion/react examples](https://emotion.sh/docs/@emotion/react)

- Let's create a Nextjs custom document:

_./src/pages/\_document.tsx_

```javascript
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
```

> NOTE: Default value.

- Let's updated it:

_./src/pages/\_document.tsx_

```diff
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
+ import { extractCritical } from '@emotion/server';

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
+   const styles = extractCritical(initialProps.html);
-   return { ...initialProps };
+   return {
+     ...initialProps,
+     styles: (
+       <>
+         {initialProps.styles}
+         <style
+           data-emotion-css={styles.ids.join(' ')}
+           dangerouslySetInnerHTML={{ __html: styles.css }}
+         />
+       </>
+     ),
+   };
  }
...

```

- Run again:

```bash
npm run build
npm run start:prod

```

> Take a look that if we render `Home page` first, we don't have cars styles yet.

- We can follow similar approach for `material-ui` styles. Let's add an `app layout`:

_./src/components/app.layout.styles.ts_

```javascript
import { css } from '@emotion/css';

export const toolbar = css`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  row-gap: 1rem;
`;

export const content = css`
  margin: 2rem;
`;
```

_./src/components/app.layout.tsx_

```javascript
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as classes from './app.layout.styles';

export const AppLayout: React.FunctionComponent = (props) => {
  const { children } = props;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar} variant="dense">
          <Typography variant="h6" color="inherit">
            Rent a car
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar variant="dense" />
        {children}
      </main>
    </>
  );
};
```

- Update barrel file:

_./src/components/index.ts_

```diff
export * from './car-list.component';
+ export * from './app.layout';

```

- Let's use it:

_./src/pages/cars.tsx_

```diff
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
- import { CarListComponent } from '../components';
+ import { AppLayout, CarListComponent } from '../components';

const CarListPage = () => {
...

  return (
-   <>
+   <AppLayout>
      ...
-   </>
+   </AppLayout>
  );
};

export default CarListPage;

```

- Start dev:

```bash
npm run start:dev
```

- Start prod:

```bash
npm run build
npm run start:prod
```

- Let's add SSR for `material-ui`:

_./src/pages/\_document.tsx_

```diff
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { extractCritical } from '@emotion/server';
+ import { ServerStyleSheets } from '@material-ui/core/styles';

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
+   const sheets = new ServerStyleSheets();
+   const originalRenderPage = ctx.renderPage;
+   ctx.renderPage = () =>
+     originalRenderPage({
+       enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
+     });

    const initialProps = await Document.getInitialProps(ctx);
    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
+         {sheets.getStyleElement()}
          <style
            data-emotion-css={styles.ids.join(' ')}
            dangerouslySetInnerHTML={{ __html: styles.css }}
          />
        </>
      ),
    };
  }
...

```

> [SSR material-ui docs](https://material-ui.com/guides/server-rendering/#server-rendering) > [Nextjs-material-ui SSR example](https://github.com/mui-org/material-ui/tree/master/examples/nextjs)

- Start prod:

```bash
npm run build
npm run start:prod
```

- A common feature using `material-ui` is define our custom theme:

_./src/common/theme/theme.ts_

```javascript
import { createTheme, Theme } from '@material-ui/core/styles';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#008C86',
    },
  },
});

export const theme: Theme = defaultTheme;
```

> We can use this object in our component's styles that it uses `emotion`.

- Implement the `ThemeProvider`:

_./src/common/theme/theme-provider.component.tsx_

```javascript
import React from 'react';
import StylesProvider from '@material-ui/styles/StylesProvider';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from './theme';

export const ThemeProviderComponent = (props) => {
  const { children } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StylesProvider>
  );
};
```

- Add barrel file:

_./src/common/theme/index.ts_

```javascript
export * from './theme-provider.component';
export * from './theme';
```

- But we need the app entry point to use `ThemeProvider` only once, in this case [pages/\_app.tsx](https://nextjs.org/docs/advanced-features/custom-app) (recommended for global styles):

_./src/pages/\_app.tsx_

```javascript
import React from 'react';
import { AppProps } from 'next/app';

const App: React.FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
};

export default App;
```

> Default value.

- Add `ThemeProvider`:

_./src/pages/\_app.tsx_

```diff
import React from 'react';
import { AppProps } from 'next/app';
+ import { ThemeProviderComponent } from '../common/theme';

const App: React.FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;

- return <Component {...pageProps} />;
+ return (
+   <ThemeProviderComponent>
+     <Component {...pageProps} />
+   </ThemeProviderComponent>
+ );
};

export default App;

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
