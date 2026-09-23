# Doble Factor Passkey - Ejemplo

Aplicación de ejemplo con autenticación mediante Passkeys (WebAuthn).

## Quick Start

```bash
# Terminal 1 - Backend (levanta MongoDB + servidor)
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

Backend: `http://localhost:3000` | Frontend: `http://localhost:5173`

# Pasos

# Intro

Esta aplicación te permite logarte usando una passkey, que es una credencial de autenticación sin contraseña (aquí no implementamos doble factor), veamolos en acción:

El registro:

1. El usuario introduce su email y pulsa "Registrarse" (ojo aqui poner un email que no esté registrado).
2. Aquí nos pide autenticación biómetrica o PIN, dependiendo de lo que tenga el dispositivo.
3. Se guarda clave privada en el dispositivo y clave pública en el backend.
4. Ya estoy listo para logarme con la passkey.

El login

1. El usuario introduce su email y pulsa "Login con Passkey".
2. El navegador muestra el prompt de autenticación (Touch ID, Windows Hello...).
3. El usuario confirma con su método biométrico o PIN.
4. El backend verifica la firma con la clave pública y me logea.

¿Vemos el código?

## Backend

_package.json_

En el backend utilizamos `@simplewebauthn/server` para manejar la lógica de WebAuthn. Tenemos dos endpoints principales.

Teneos dos grupo de rutas:

- Login: Aquí arrancamos la petición de login, y después verificamos la respuesta del navegador.
- Register: Aquí hacemos el sign up del usuario, lo mismo, dos paso, un start y un finish.

## Login

_backend/src/routes/login.ts_

En start lo que hacemos es:

Start

---

1. Buscar el usuario por email en MongoDB.
2. Si no existe o no tiene credenciales, devolvemos un 404.
3. Generamos un challenge con `generateAuthenticationOptions()`, incluyendo las credenciales del usuario en `allowCredentials` para que el navegador sepa qué passkeys buscar.
4. Guardamos el challenge en MongoDB y lo devolvemos al frontend.

Finish

---

Una vez que el usuario recibe las options, el navegador muestra el prompt de autenticación. Cuando el usuario confirma, el navegador firma el challenge con la clave privada y devuelve la respuesta al frontend, en este caso:

- En finish recibimos el email y challenge firmado (credential).
- Recuperamos el challenge guardado y buscamos la credencial por ID.
- Verificamos la firma con `verifyAuthenticationResponse()`, pasándole la clave pública almacenada.
- Si la verificación es correcta, actualizamos el counter en MongoDB y borramos el challenge.

## Register

_backend/src/routes/register.ts_

Start

---

- Primero comprobamos que el email no tenga ya credenciales registradas. Si las tiene, devolvemos un 409.
- Ahora llamamos al método `generateRegistrationOptions()` de `@simplewebauthn/server`, que genera un challenge aleatorio y los parámetros necesarios para crear la passkey.
- Guardamos el challenge en MongoDB y lo devolvemos al frontend.

IMPORTANTE, aquí todavía no guardamos ninguna credencial (clave publica), solo el challenge. La clave pública se guarda en el siguiente paso, una vez que el navegador crea la passkey.

Finish

---

- Buscamos el usuario.
- Ahora tenemos clave pública y challenge encriptado con la privada del cliente.
- Verificamos la respuesta con `verifyRegistrationResponse()`, y la comparamos con el challenge guardado.
- Si la verificación es correcta, guardamos la clave pública en el array `credentials` del usuario y borramos el challenge.

## Front End

### Register

_frontend/src/components/RegisterForm.tsx_

El registro se orquesta en tres pasos:

1. El usuario introduce su email y pulsa "Registrarse". Esto llama a `registerStart(email)`, que hace un POST al backend para iniciar el registro.
2. El backend devuelve las options, que se pasan a `startRegistration()`. Esto muestra el prompt de WebAuthn (Touch ID, Windows Hello...) y el usuario confirma con su método biométrico o PIN. El navegador genera la passkey y devuelve la credencial al frontend.
3. Finalmente, `registerFinish(email, credential)` envía la credencial al backend para verificarla y completar el registro.

### Login

_frontend/src/components/LoginForm.tsx_

El inicio de sesión con Passkey también se orquesta en tres pasos:

1. El usuario introduce su email y pulsa "Iniciar sesión". Esto llama a `loginStart(email)`, que hace un POST al backend para iniciar el proceso de autenticación.
2. El backend devuelve las options de autenticación, que se pasan a `startAuthentication()`. El navegador muestra el prompt de WebAuthn (huella, PIN o uso de otro dispositivo). El autenticador firma el challenge con la passkey correspondiente y devuelve una assertion (credencial) al frontend.
3. Finalmente, `loginFinish(email, credential)` envía la assertion al backend, donde se verifica criptográficamente usando la clave pública almacenada. Si la verificación es correcta, se actualiza el contador de la credencial, se limpia el challenge temporal y se establece la sesión del usuario.

---

# Info acerca del proyecto

## Tecnologías

- **Frontend:** React, TypeScript, Vite, Tailwind CSS 4, DaisyUI 5
- **Backend:** Node.js, Express, TypeScript
- **Base de datos:** MongoDB 7 (via Docker)

## Requisitos previos

- Node.js (v18+)
- Docker y Docker Compose

## Arrancar el proyecto

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Esto levanta MongoDB en Docker y arranca el servidor en `http://localhost:3000`.

> Si ya tienes MongoDB corriendo puedes usar `npm run dev:no-docker`.

Scripts disponibles:

| Script                  | Descripción                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Levanta MongoDB + arranca el backend |
| `npm run dev:no-docker` | Arranca solo el backend              |
| `npm run docker:up`     | Levanta solo MongoDB                 |
| `npm run docker:down`   | Para MongoDB                         |
| `npm run build`         | Compila TypeScript                   |
| `npm start`             | Ejecuta la build compilada           |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Arranca en `http://localhost:5173`.

## Estructura del proyecto

```
├── docker-compose.yml              # MongoDB
├── backend/
│   └── src/
│       ├── index.ts                # Servidor Express
│       ├── db.ts                   # Conexión a MongoDB
│       └── routes/
│           ├── register.ts         # Endpoints de registro
│           └── login.ts            # Endpoints de login
└── frontend/
    └── src/
        ├── App.tsx                 # Componente principal
        ├── main.tsx                # Entry point
        ├── index.css               # Tailwind + DaisyUI
        ├── api/
        │   ├── register.ts         # Fetch al backend (registro)
        │   └── login.ts            # Fetch al backend (login)
        └── components/
            ├── RegisterForm.tsx     # Formulario de registro
            └── LoginForm.tsx        # Formulario de login
```

---

## Flujo de Registro (Passkey)

El registro utiliza el estándar **WebAuthn** para crear una credencial pública
(passkey) vinculada al dispositivo del usuario. El flujo se divide en dos fases:
**start** (el servidor genera un reto) y **finish** (el servidor verifica la
respuesta del navegador).

### Diagrama de secuencia

```
┌─────────┐                    ┌─────────┐                  ┌─────────┐
│ Usuario │                    │Frontend │                  │ Backend │
└────┬────┘                    └────┬────┘                  └────┬────┘
     │  Pulsa "Registrarse"        │                             │
     │  e introduce su email       │                             │
     │ ──────────────────────────► │                             │
     │                             │                             │
     │          ┌──────────────────────────────────────────────┐ │
     │          │ FASE 1: START                                │ │
     │          └──────────────────────────────────────────────┘ │
     │                             │  POST /api/register/start   │
     │                             │  { email }                  │
     │                             │ ──────────────────────────► │
     │                             │                             │
     │                             │                  ┌──────────┴──────────┐
     │                             │                  │ 1. Busca email en   │
     │                             │                  │    MongoDB          │
     │                             │                  │ 2. Si existe → 409  │
     │                             │                  │ 3. Genera challenge │
     │                             │                  │    con              │
     │                             │                  │    generateRegis-   │
     │                             │                  │    trationOptions() │
     │                             │                  │ 4. Guarda challenge │
     │                             │                  │    en el usuario    │
     │                             │                  └──────────┬──────────┘
     │                             │                             │
     │                             │  ◄───────────────────────── │
     │                             │  options (challenge, rpID,  │
     │                             │          rpName, userID...) │
     │                             │                             │
     │          ┌──────────────────────────────────────────────┐ │
     │          │ FASE 2: NAVEGADOR CREA LA PASSKEY            │ │
     │          └──────────────────────────────────────────────┘ │
     │                             │                             │
     │  ◄──────────────────────────│                             │
     │  El navegador muestra el    │                             │
     │  prompt de WebAuthn         │                             │
     │  (Touch ID, Windows Hello)  │                             │
     │                             │                             │
     │  El usuario confirma ──────►│                             │
     │  con huella / PIN / etc.    │                             │
     │                             │                             │
     │          ┌──────────────────────────────────────────────┐ │
     │          │ FASE 3: FINISH                               │ │
     │          └──────────────────────────────────────────────┘ │
     │                             │  POST /api/register/finish  │
     │                             │  { email, credential }      │
     │                             │ ──────────────────────────► │
     │                             │                  ┌──────────┴──────────┐
     │                             │                  │ 1. Recupera el      │
     │                             │                  │    challenge        │
     │                             │                  │ 2. Verifica con     │
     │                             │                  │    verifyRegis-     │
     │                             │                  │    trationResponse()│
     │                             │                  │ 3. Guarda la clave  │
     │                             │                  │    pública en       │
     │                             │                  │    credentials[]    │
     │                             │                  │ 4. Borra el         │
     │                             │                  │    challenge        │
     │                             │                  └──────────┬──────────┘
     │                             │                             │
     │                             │  ◄───────────────────────── │
     │                             │  { verified: true }         │
     │                             │                             │
     │  ◄──────────────────────────│                             │
     │  "Registro exitoso"         │                             │
```

### Paso a paso en el código

#### 1. El usuario pulsa "Registrarse" (`RegisterForm.tsx`)

El componente muestra un input de email. Al confirmar se ejecuta `handleRegister`,
que orquesta las tres llamadas secuenciales:

```typescript
// frontend/src/components/RegisterForm.tsx
const options = await registerStart(email); // Fase 1
const credential = await startRegistration({ optionsJSON: options }); // Fase 2
await registerFinish(email, credential); // Fase 3
```

#### 2. Fase START — El backend genera el reto (`POST /api/register/start`)

El frontend envía el email al backend (`frontend/src/api/register.ts` → `registerStart`).

En el backend (`backend/src/routes/register.ts`):

- **Valida** que el email no tenga ya credenciales en MongoDB (si las tiene → `409`).
- Llama a `generateRegistrationOptions()` de `@simplewebauthn/server`, que genera
  un **challenge** aleatorio y los parámetros que el navegador necesita para crear
  la passkey:

```typescript
const options = await generateRegistrationOptions({
  rpName, // "Passkey Demo" — nombre que ve el usuario
  rpID, // "localhost" — dominio vinculado a la passkey
  userName: email, // identificador del usuario
  attestationType: "none",
  authenticatorSelection: {
    residentKey: "preferred", // passkey descubrible si es posible
    userVerification: "preferred", // biometría si está disponible
  },
});
```

- **Guarda** el `challenge` en el documento del usuario en MongoDB (con `upsert`)
  para verificarlo después.
- **Devuelve** las `options` al frontend como JSON.

#### 3. Fase NAVEGADOR — Se crea la passkey (`startRegistration`)

De vuelta en el frontend, `startRegistration()` de `@simplewebauthn/browser` pasa
las options al navegador. Este muestra el prompt nativo de WebAuthn (Touch ID,
Windows Hello, llave de seguridad...).

Cuando el usuario confirma, el navegador genera un **par de claves asimétricas**:

- **Clave privada**: queda almacenada en el dispositivo (nunca sale de ahí).
- **Clave pública + attestation**: se devuelve como `credential` al frontend.

#### 4. Fase FINISH — El backend verifica (`POST /api/register/finish`)

El frontend envía `{ email, credential }` al backend.

En el backend (`backend/src/routes/register.ts`):

- **Recupera** el `currentChallenge` del usuario en MongoDB.
- Llama a `verifyRegistrationResponse()` que comprueba:
  - Que el `challenge` de la respuesta coincide con el guardado.
  - Que el `origin` es `http://localhost:5173`.
  - Que el `rpID` es `localhost`.
- Si la verificación es correcta, **almacena** la credencial pública en el array
  `credentials` del usuario:

```typescript
{
  credentialID: cred.id,                                        // ID único (base64url)
  publicKey: Buffer.from(cred.publicKey).toString("base64url"), // Clave pública
  counter: cred.counter,                                        // Contador anti-replay
  transports: credential.response.transports ?? [],             // Cómo se comunica el autenticador
}
```

- **Borra** el `currentChallenge` con `$unset` (ya no se necesita, es de un solo uso).
- Devuelve `{ verified: true }`.

### Documento resultante en MongoDB (colección `users`)

```json
{
  "email": "user@example.com",
  "credentials": [
    {
      "credentialID": "x8dF3...",
      "publicKey": "MFkwE...",
      "counter": 0,
      "transports": ["internal"],
      "deviceType": "singleDevice",
      "backedUp": false
    }
  ]
}
```

> **Nota:** La clave privada nunca llega al servidor. Solo se almacena la clave
> pública, que sirve para verificar futuras firmas durante el login.

---

## Flujo de Login (Passkey)

El login utiliza la passkey creada durante el registro para **firmar un reto**
con la clave privada del dispositivo. El servidor verifica esa firma con la
clave pública que guardó en MongoDB. De nuevo, dos fases: **start** y **finish**.

### Diagrama de secuencia

```
┌─────────┐                    ┌─────────┐                  ┌─────────┐
│ Usuario │                    │Frontend │                  │ Backend │
└────┬────┘                    └────┬────┘                  └────┬────┘
     │  Pulsa "Login con Passkey"  │                             │
     │  e introduce su email       │                             │
     │ ──────────────────────────► │                             │
     │                             │                             │
     │          ┌──────────────────────────────────────────────┐ │
     │          │ FASE 1: START                                │ │
     │          └──────────────────────────────────────────────┘ │
     │                             │  POST /api/login/start      │
     │                             │  { email }                  │
     │                             │ ──────────────────────────► │
     │                             │                             │
     │                             │                  ┌──────────┴──────────┐
     │                             │                  │ 1. Busca email en   │
     │                             │                  │    MongoDB          │
     │                             │                  │ 2. Si no existe     │
     │                             │                  │    → 404            │
     │                             │                  │ 3. Genera challenge │
     │                             │                  │    con generate-    │
     │                             │                  │    Authentication-  │
     │                             │                  │    Options()        │
     │                             │                  │ 4. Incluye las      │
     │                             │                  │    credenciales     │
     │                             │                  │    del usuario en   │
     │                             │                  │    allowCredentials │
     │                             │                  │ 5. Guarda challenge │
     │                             │                  └──────────┬──────────┘
     │                             │                             │
     │                             │  ◄───────────────────────── │
     │                             │  options (challenge,        │
     │                             │    allowCredentials[])      │
     │                             │                             │
     │          ┌──────────────────────────────────────────────┐ │
     │          │ FASE 2: NAVEGADOR FIRMA CON LA PASSKEY       │ │
     │          └──────────────────────────────────────────────┘ │
     │                             │                             │
     │  ◄──────────────────────────│                             │
     │  El navegador muestra el    │                             │
     │  prompt de WebAuthn         │                             │
     │  (Touch ID, Windows Hello)  │                             │
     │                             │                             │
     │  El usuario confirma ──────►│                             │
     │  con huella / PIN / etc.    │                             │
     │                             │                             │
     │          ┌──────────────────────────────────────────────┐ │
     │          │ FASE 3: FINISH                               │ │
     │          └──────────────────────────────────────────────┘ │
     │                             │  POST /api/login/finish     │
     │                             │  { email, credential }      │
     │                             │ ──────────────────────────► │
     │                             │                  ┌──────────┴──────────┐
     │                             │                  │ 1. Recupera el      │
     │                             │                  │    challenge        │
     │                             │                  │ 2. Busca la         │
     │                             │                  │    credencial por   │
     │                             │                  │    ID               │
     │                             │                  │ 3. Verifica la      │
     │                             │                  │    firma con        │
     │                             │                  │    verifyAuthenti-  │
     │                             │                  │    cationResponse() │
     │                             │                  │ 4. Actualiza el     │
     │                             │                  │    counter          │
     │                             │                  │ 5. Borra el         │
     │                             │                  │    challenge        │
     │                             │                  └──────────┬──────────┘
     │                             │                             │
     │                             │  ◄───────────────────────── │
     │                             │  { verified: true, email }  │
     │                             │                             │
     │  ◄──────────────────────────│                             │
     │  "Login exitoso.            │                             │
     │   Bienvenido/a, user@..."   │                             │
```

### Paso a paso en el código

#### 1. El usuario pulsa "Login con Passkey" (`LoginForm.tsx`)

El componente muestra un input de email. Al confirmar se ejecuta `handleLogin`,
que orquesta las tres llamadas secuenciales:

```typescript
// frontend/src/components/LoginForm.tsx
const options = await loginStart(email); // Fase 1
const credential = await startAuthentication({ optionsJSON: options }); // Fase 2
await loginFinish(email, credential); // Fase 3
```

#### 2. Fase START — El backend genera el reto (`POST /api/login/start`)

El frontend envía el email al backend (`frontend/src/api/login.ts` → `loginStart`).

En el backend (`backend/src/routes/login.ts`):

- **Busca** el usuario por email en MongoDB. Si no existe o no tiene credenciales → `404`.
- Llama a `generateAuthenticationOptions()` de `@simplewebauthn/server`, que genera
  un **challenge** aleatorio e incluye las credenciales registradas del usuario en
  `allowCredentials` para que el navegador sepa qué passkeys buscar:

```typescript
const options = await generateAuthenticationOptions({
  rpID, // "localhost"
  allowCredentials: user.credentials.map((cred: any) => ({
    id: cred.credentialID, // ID de la credencial registrada
    ...(cred.transports?.length > 0 && { transports: cred.transports }), // transports solo si hay datos, // si no, el navegador prueba todos
  })),
  userVerification: "preferred", // biometría si está disponible
});
```

- **Guarda** el `challenge` en el documento del usuario.
- **Devuelve** las `options` al frontend.

#### 3. Fase NAVEGADOR — Se firma el reto (`startAuthentication`)

`startAuthentication()` de `@simplewebauthn/browser` pasa las options al navegador.
Gracias a `allowCredentials`, el navegador sabe exactamente qué passkey usar y
muestra el prompt nativo (Touch ID, Windows Hello...).

A diferencia del registro, aquí **no se crea** un par de claves nuevo. El navegador
usa la **clave privada existente** para firmar el `challenge`. La respuesta incluye:

- **`authenticatorData`**: datos del autenticador con el nuevo `counter`.
- **`signature`**: la firma del challenge con la clave privada.
- **`clientDataJSON`**: contexto de la petición (origin, challenge, tipo).

#### 4. Fase FINISH — El backend verifica la firma (`POST /api/login/finish`)

El frontend envía `{ email, credential }` al backend.

En el backend (`backend/src/routes/login.ts`):

- **Recupera** el `currentChallenge` y busca la credencial almacenada cuyo ID
  coincide con `credential.id`:

```typescript
const storedCred = user.credentials.find(
  (c: any) => c.credentialID === credential.id,
);
```

- Llama a `verifyAuthenticationResponse()` pasándole la **clave pública** almacenada
  para que verifique la firma:

```typescript
const verification = await verifyAuthenticationResponse({
  response: credential,
  expectedChallenge: user.currentChallenge,
  expectedOrigin: origin, // "http://localhost:5173"
  expectedRPID: rpID, // "localhost"
  credential: {
    id: storedCred.credentialID,
    publicKey: Buffer.from(storedCred.publicKey, "base64url"),
    counter: storedCred.counter,
    transports: storedCred.transports,
  },
});
```

- Si la firma es válida, **actualiza el counter** en MongoDB. El counter es una
  protección anti-replay: cada autenticación lo incrementa y el servidor rechaza
  valores iguales o menores al almacenado.

```typescript
await users.updateOne(
  { email, "credentials.credentialID": storedCred.credentialID },
  {
    $set: {
      "credentials.$.counter": verification.authenticationInfo.newCounter,
    },
    $unset: { currentChallenge: "" },
  },
);
```

- **Borra** el `currentChallenge` y devuelve `{ verified: true, email }`.

### Registro vs Login — Diferencias clave

|                            | Registro                                                         | Login                                                                |
| -------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Qué hace el navegador**  | Crea un par de claves nuevo                                      | Firma un reto con la clave privada existente                         |
| **Qué viaja al servidor**  | Clave pública + attestation                                      | Firma + authenticatorData                                            |
| **Qué guarda el servidor** | La clave pública en `credentials[]`                              | Actualiza solo el `counter`                                          |
| **Función server**         | `generateRegistrationOptions()` / `verifyRegistrationResponse()` | `generateAuthenticationOptions()` / `verifyAuthenticationResponse()` |
| **Función browser**        | `startRegistration()`                                            | `startAuthentication()`                                              |

> **Nota:** En ambos flujos, el `challenge` es de un solo uso. Se genera en el
> `start`, se verifica en el `finish` y se borra inmediatamente después. Esto
> previene ataques de replay.
