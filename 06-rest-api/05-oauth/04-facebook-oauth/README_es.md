# OAUTH2 + Facebook Passport + Cookie + JWT

En este ejemplo vamos a ver como autenticarnos usando Meta for Developers/Facebook (OAUTH2) y crear una cookie y token JWT para seguir autenticados.

# Pasos

Empezamos por copiarnos el ejemplo _02-cookie-and-jwt_

Hacemos un _npm install_

```bash
npm install
```

- Necesitamos instalar la estrategia de Passport para Facebook y sus typings

```bash
npm i passport-facebook
npm i -D @types/passport-facebook
```

- Añadimos al fichero .env el App ID y el App Secret de Facebook

```diff
NODE_ENV=development
PORT=3000
GOOGLE_CLIENT_ID = <pega aquí tu client Id de tu panel de Google accounts>
GOOGLE_CLIENT_SECRET = <pega aquí tu client Secret de tu panel de Google accounts>
+ FACEBOOK_APP_ID = <pega aquí tu App Id>
+ FACEBOOK_APP_SECRET = <pega aquí App Secret>
```

- Y añadimos los nuevos valores al _./src/env.constants.ts_

```diff
export const envConstants = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
+ FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
+ FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
};
```

- Antes de configurar la estrategia de Passport para Facebook necesitamos hacer unos pequeños cambios en nuestra capa de acceso a datos.
  - En primer lugar, añadiremos el campo `facebookId` a nuestra interfaz `User` (_./src/dals/user.model.ts_)

    ```diff
    export interface User {
      id: number;
      googleId: string;
    + facebookId: string;
      displayName: string;
      firstName: string;
      lastName: string;
      image: string;
      email: string;
    }
    ```

  - A la interfaz del contrato, `ProfileRepositoryContract`, le añadimos una nueva función `getUserByFacebookId` que recuperará el usuario según su `facebookId`. También tendremos que modificar la función `userProfileExists`, para que haga el check de ambos proveedores (_./src/dals/repository/profile.contract.ts_)

    ```diff
    import { User } from "dals/user.model";

    export interface ProfileRepositoryContract {
    - userProfileExists: (googleProfileId: string) => Promise<boolean>;
    + userProfileExists: (providerId: string) => Promise<boolean>;
      addNewUser: (user: User) => Promise<User>;
      getUser: (id: number) => Promise<User>;
      getUserByGoogleId: (id: string) => Promise<User>;
    + getUserByFacebookId: (id: string) => Promise<User>;
    }
    ```

  - Por último, aplicaremos a la implementación mock de este contrato los cambios necesarios (_./src/dals/repository/profile.mock.ts_)

    ```diff
    export const userProfileExists = async (
    - googleProfileId: string
    + providerId: string
    ): Promise<boolean> => {
      const index =
        userCollection.findIndex(
    -     (user) => user.googleId === googleProfileId
    +     (user) => user.googleId === providerId || user.facebookId === providerId
        );

      return index !== -1;
    };
    ```

    ```ts
    // (...)

    export const getUserByFacebookId = async(id: string): Promise<User> => {
      const user = userCollection.find((user) => user.facebookId === id);

      return user;
    };
    ```

- Ahora si, nos vamos al setup de Passport para configurar la estrategia de Facebook (_./src/setup/passport.config.ts_)

```diff
import passportGoogle from 'passport-google-oauth20';
+ import passportFacebook from 'passport-facebook';
import { envConstants } from '../env.constants';
import { User, profileRepository } from '../dals';

const googleStrategy = passportGoogle.Strategy;
+ const facebookStrategy = passportFacebook.Strategy;

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
+           facebookId: undefined,
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
+ passport.use(
+   new facebookStrategy(
+   // (...) - Check other changes below
+ );
};
```

```ts
// (...)
  passport.use(
    new facebookStrategy(
      {
        clientID: envConstants.FACEBOOK_APP_ID,
        clientSecret: envConstants.FACEBOOK_APP_SECRET,
        callbackURL: '/api/facebook/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        const sessionExists = await profileRepository.userProfileExists(
          profile.id
        );
        if (sessionExists) {
          // Extract user logged in session from repository
          const user = await profileRepository.getUserByFacebookId(profile.id);
          done(null, user);
        } else {
          let user: User = {
            id: -1,
            googleId: undefined,
            facebookId: profile.id,
            displayName: profile.displayName,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1],
            image: undefined,
            email: undefined,
          };

          // Create new session an store it into the repo
          user = await profileRepository.addNewUser(user);

          done(null, user);
        }
      }
    )
  );
```

- Modificamos también nuestra API (_./src/api.ts_), añadiendo dos nuevos endpoints: `/facebook` y `facebook/callback`

```diff
api.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false, // Default value: true
  })
);

+ api.get(
+   '/facebook',
+   passport.authenticate('facebook', {
+     scope: ['public_profile', 'email'],
+     session: false, // Default value: true
+   })
+ );
```

```ts
// (...)

api.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log('Ha llegado la respuesta de Facebook');
    console.log(req.user);
    const user = req.user as User;
    const token = createAccessToken(user.id);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // TODO: Enable in production
    });
    res.redirect('/mainapp.html');
  },
);
```

- Por último, añadiremos en nuestro index.html un nuevo enlace para usar el login de Facebook, _./src/static/index.html_:

```diff
<!DOCTYPE html>
<html>
  <head>
    <title>Prueba Login</title>
  </head>
  <body>
    <section>
      <a id="login-button" href="/api/google">Login using Google</a>
+     <a id="login-button" href="/api/facebook">Login using Facebook</a>
    </section>
  </body>
</html>
```

- Vamos a probar esto

```bash
npm start
```

# ¿Con ganas de ponerte al día con Backend?

Apuntate a nuestro [Bootcamp Backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
