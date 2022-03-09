# OAUTH2 + Google Passport + TypeScript

En este ejemplo vamos a ver como autenticarnos usando Google Accounts (OAUTH2)

# Pasos

Empezamos por copiarnos el ejemplo anterior _01-boilerpate_

Hacemos un _npm install_

```bash
npm install
```

Si arrancamos el proyecto:

```bash
npm start
```

Podemos ver que hay dos endpoints interesantes:

http://localhost:8081

http://localhost:8081/api

En uno se muestra una página, en la otra tenemos un endpoint que devuelve json

Vamos a arrancar por instalar las dependencias que necesitamos:

En este caso:

- Vamos a trabajar con sesión en express.
- Vamos a usar passport para gestionar la autenticación.
- Vamos a usar la extension de passport para gestionar la autenticación con Google

```bash
npm install express-session passport passport-google-oauth20 --save
```

Y sus typings:

```bash
npm install @types/express-session @types/passport @types/passport-google-oauth20 --save-dev
```

Pasamos a configurar las variables de entorno, creamos un fichero env

**No mostrar esto por pantalla, ni almacenar O:-)**

_./env_

```env
NODE_ENV=development
PORT=8081
GOOGLE_CLIENT_ID = <pega aquí tu client Id de tu panel de Google accounts>
GOOGLE_CLIENT_SECRET = <pega aquí tu client Secret de tu panel de Google accounts>
```

Y añadimos los nuevos valores al _env.constants.ts_

_./src/env.constants.ts_

```diff
export const envConstants = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
+  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
+  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
};
```

Vamos a crearnos un repo mock (en memoria) para almacenar
el perfil del usuario:

_./src/dals/user.model.ts_

```typescript
export interface User {
  id: number;
  googleId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
}
```

_./src/dals/repository/profile.contract.ts_

```typescript
import { User } from '../user.model';

export interface ProfileRepositoryContract {
  userProfileExists: (googleProfileId: string) => Promise<boolean>;
  addNewUser: (user: User) => Promise<User>;
  getUser: (id: number) => Promise<User>;
  getUserByGoogleId: (id: string) => Promise<User>;
}
```

_./src/dals/repository/profile.mock.ts_

```typescript
import { User } from '../user.model';

// Just a dumb memory implementation just use for local dev purpose
// later on migrate to a MongoDb or whatever Db implementation

let lastId: number = 1;
let userCollection: User[] = [];

export const userProfileExists = async (
  googleProfileId: string
): Promise<boolean> => {
  const index =
    userCollection.findIndex(
      (user) => user.googleId === googleProfileId
    ) ?? null;

  return index !== -1;
};

export const addNewUser = async (user: User): Promise<User> => {
  const newUser = {
    ...user,
    id: lastId,
  };

  userCollection = [...userCollection, newUser];

  lastId++;

  return newUser;
};

export const getUserByGoogleId = async (googleId: string): Promise<User> => {
  const user =
    userCollection.find((user) => user.googleId === googleId) ?? null;

  return user;
};

export const getUser = async (id: number): Promise<User> => {
  const user = userCollection.find((user) => user.id === id) ?? null;

  return user;
};
```

Y su barrel

_./src/dals/repository/index.ts_

```typescript
import * as mockRepository from './profile.mock';
import { ProfileRepositoryContract } from './profile.contract';
// TODO: add here real repository

// TODO: Check here env variable if we are in mock mode or not
// and choose whether use the mock or the real version
export const profileRepository: ProfileRepositoryContract = mockRepository;
```

Y exponemos con un barrel a nivel de DAL los modulos que necesitemos:

_./src/dals/index.ts_

```typescript
export * from './user.model';
export * from './repository';
```

Vamos a hacer el setup de _Passport_ y definir la estrategia para trabajar
con la autenticación contra Google:

- Recibimos la respuesta de google cuando se ha autenticado con éxito.
- Ahí tenemos la info de la cuenta, profile Id, EMail...
- Lo guardamos en una supuesta base de datos de usuarios (si no éxiste ya).
- El identificador del usuario lo almacena en la sesión de express passport
  (es transparente para nosotros).
- Después tenemos dos métodos para:
  - Grabar el id del usuario que se ha grabado en "base de datos"
  - Recuperar los datos del perfil de usuario en base a ese perfil.

_./src/setup/passport-config.ts_

```ts
import passportGoogle from 'passport-google-oauth20';
import { envConstants } from '../env.constants';
import { User, profileRepository } from '../dals';

const googleStrategy = passportGoogle.Strategy;

export const configPassport = function (passport) {
  passport.use(
    new googleStrategy(
      {
        clientID: envConstants.GOOGLE_CLIENT_ID,
        clientSecret: envConstants.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const sessionExists = await profileRepository.userProfileExists(
          profile.id
        );
        if (sessionExists) {
          // Extract user logged in session from repository
          const user = await profileRepository.getUserByGoogleId(profile.id);
          done(null, user);
        } else {
          let user: User = {
            id: -1,
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
          };

          // Create new session an store it into the repo
          user = await profileRepository.addNewUser(user);

          done(null, user);
        }
      }
    )
  );

  // used to serialize the user for the session
  // Here we just save the ID it will be store in the express session object
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  // We get the id of the user from the express session object (previously serialized using SerializeUser)
  // now we restore that details from a permanent storage (in this case a mock memory storage, it could be mongo or whatever...)
  passport.deserializeUser(async (id, done) => {
    // retrieve user by Id
    // ID contains session Id numeber 1 first user added !!!
    // in some case :)
    let user: User = {
      id: -1,
      displayName: 'Anonymous',
      lastName: '',
      email: '',
      firstName: 'Anonymous',
      googleId: '',
      image: '',
    };
    if (profileRepository.userProfileExists(id)) {
      user = await profileRepository.getUser(id);
    }
    done(null, user);
  });
};
```

Añadimos un barrel

_./src/setup/index.ts_

```ts
export * from './passport-config';
```

Es hora de tocar el HTML:

Vamos a añadir un enlace en index para que se vaya a la página de _index.html_

_./src/static/index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Prueba Login</title>
  </head>
  <body>
    <section>
      <a id="login-button" href="/api/google">Login using Google</a>
    </section>
  </body>
</html>
```

Y vamos a crear una página en la que ya asumimos que estamos logados, que hacemos aquí

- Hacemos un fetch
- Mostramos por consola el perfil del usuario que se ha logado (¿Alguien se anima
  a hacer algo más bonito? Fork :))

_./src/static/mainapp.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <title>User already logged in using Google</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
  </head>
  <body>
    <img id="profilepic" />
    <p id="username">user name</p>
    <section>
      <h1>My site: info about user logged in (F12 open console :))</h1>
    </section>
    <script type="text/javascript">
      fetch('/api/user-profile', {
        method: 'GET',
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (session) {
          document.getElementById('profilepic')['src'] = session.image;
          document.getElementById('username')['innerHTML'] =
            session.displayName;

          console.log(session);
        })
        .catch(function (error) {
          console.error('Error:', error);
        });
    </script>
  </body>
</html>
```

- Vamos ahora a por los endpoints de la API (añadir al final del fichero):
  - Añadimos los imports de passport, dal...

_./src/api.ts_

```diff
import { Router } from 'express';
+ import passport from 'passport';
export const api = Router();
```

- Añadimos el endpoint _/google_ que es donde arrancamos
  el proceso con passport para que conecte con google account
  (redirect a su página).

_./src/api.ts_

```typescript
api.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
```

- Añadimos un segundo el de _callback_ que será el que
  Google Accounts invocará cuando de la respuesta al login
  (ojo, que este endpoint lo tenemos que tener como valido
  en nuestra consola de administración de Google)

_./src/api.ts_

```typescript
api.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(req.user);
    console.log('Llego respuesta de google');
    res.redirect('/mainapp.html');
  }
);
```

- Añadimos un tercer endpoint que va a ser
  el que nos de la información del usuario logado cuando
  la pidamos vía fetch desde nuestra página principal
  (una vez que ya nos hemos logado)

_./src/api.ts_

```typescript
// (...)
api.get('/user-profile', async (req, res) => {
  let user = null;
  // user Id can be found in: req.session['passport'].user
  // you can find whole user Info in req.user (passport middleware serialize and deserialize takes care of this)
  /*
  if (req.session['passport'].user) {
    user = await profileRepository.getUser(req.session['passport'].user);
  }*/

  res.json(req.user);
});
```

Para finalizar vamos hacer configurar la sesión y passport en nuestro punto
de entrada (app.ts)

_./src/app.ts_

```diff
import { createApp } from './express.server';
import { envConstants } from './env.constants';
import { api } from './api';
import express from 'express';
import path from 'path';
+ import { configPassport } from './setup';
+ import passport from 'passport';
+ import expressSession from 'express-session';


const app = createApp();

+ configPassport(passport);
+
+ // Let's have a sessión (stored in memory by default, it could be serialized in a mongodb)
+ // TODO: in the future we could store info in JWT token
+ app.use(
+  expressSession({
+    secret: 'rather store secret in dotenv',
+    resave: false,
+    saveUninitialized: false,
+  })
+ );
+
+ // We need to setup the middleware
+ app.use(passport.initialize());
+ // If we setup session we need serializeUser and deserializeUser
+ app.use(passport.session());

app.use('/', express.static(path.join(__dirname, 'static')));

app.use('/api', api);

app.listen(envConstants.PORT, () => {
  console.log(`Server ready at http://localhost:${envConstants.PORT}/api`);
});
```

- Vamos a ver si esto funciona

```bash
npm start
```

# ¿Con ganas de ponerte al día con Backend?

Apuntate a nuestro [Bootcamp Backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
