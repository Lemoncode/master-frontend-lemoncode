# 03 Storage

In this example we will login an user using a JWT token with headers + local storage and session storage.

## Install dependencies

`npm install` to install packages:

```bash
cd back
npm install
```

```bash
cd front
npm install
```

## Start apps

Start `back` app:

```bash
cd ./back
npm start
```

> NOTE: We added `.env` file only for demo purpose. We should ignore this one and add a `.env.example` as example.

Start `front` app:

```bash
cd ./front
npm start
```

## Demo

- Open Chrome Dev tools > Network tab.

- Login with `admin` credentials

- Open Chrome Dev tools > Application tab > Local storage

- Load client list

- Load order list

- Logout

- Navigate to `http://localhost:8080/#/list` without LOGIN

- Load client list.

## Demo open new tab

- Open Chrome Dev tools > Network tab.

- Login with `admin` credentials

- Load client list in new tab.

## Code

The backend is exactly the same as the `01-headers` example.

Frontend, check the following files:

  - `front/src/core/api/api.helpers.ts`
  - `front/src/pods/login/api/login.api.ts`
  - `front/src/app.ts`

## Session Storage

We can use session storage for auto-clean this one when users will close browsers:

_./front/src/core/api/api.helpers.ts_

```diff
import axios from 'axios';

export const setHeader = (header: string, value: string) => {
  axios.defaults.headers.common[header] = value;
- localStorage.setItem(header, value);
+ sessionStorage.setItem(header, value);
};

export const restoreHeader = (header: string) => {
- const value = localStorage.getItem(header);
+ const value = sessionStorage.getItem(header);
  if (value) {
    axios.defaults.headers.common[header] = value;
  }
};

```

> NOTE: Session storage is not loaded in other tabs.
>
> https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
