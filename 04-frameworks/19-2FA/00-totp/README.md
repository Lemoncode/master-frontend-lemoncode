# Proyecto Full Stack 2FA - TOTP + React + Express + MongoDB

En este ejemplo puedes ver una impleentación básica de autenticación 2 Factor usando TOTP (Time-based One-Time Password) con React en el frontend, Express con TypeScript en el backend y MongoDB para almacenar los usuarios.

## Partes

Este proyecto se divide en tres partes principales:

- **Base de datos MongoDB**: la tenemos corriendo en un contenedor de Docker para facilitar su uso y evitar configuraciones locales.
- **Backend con Express y TypeScript**: que expone una API REST para manejar el registro y login de usuarios, así como la generación y validación de códigos TOTP.
- **Frontend con React, TypeScript, Vite y Tailwind CSS**: que proporciona una interfaz de usuario para simular:
  - Registro de nuevos usuarios
  - Inicio de sesión con email y contraseña
  - Verificación del código TOTP generado por el backend
  - Acceso a un endpoint protegido que requiere autenticación.

## Arrancando el proyecto

Para arrancar el proyecto, te hace falta tener docker desktop instalado y una versión actual de nodejs instaladas.

Para arrancar el contenedor de MongoDB, puedes usar el comando:

```bash
cd back
```

```bash
npm run docker:up
```

Podemos instalar las dependencias del backend:

```bash
npm run dev
```

Y luego, en otra terminal, instalar las dependencias del frontend:

```bash
cd frontend
```

```bash
npm install
```

Finalmente, para arrancar el frontend:

```bash
npm run dev
```

¿Qué podemos hacer aquí?

Crear una cuenta.

Iniciar sesión.

Habilitar TOTP para esa cuenta.

Deslogarnos

Logarnos con 2FA

Y acceder a un recurso protegido.

# Detalle

Vamos a ir buceando en el detalle del proyecto.

## Contenedor y BBDD

Lo primero veamos el docker compose

_./docker-compose.yml_

Aquí levantamos el Mongo.

Si lo abrimos con Mongo Compass, podemos ver que tenemos nuestra base de datos `authdb` con la colección `users` con la entrada que hemos creado, que hay aquí guardado:

- La clave simple con su hash y sal.
- El flag de twoFactorEnabled a true.
- El secreto de doble factor, encriptado de forma simétrica (con eso y la hora actual generamos los códigos temporales).
- Y el array de recovery codes, que también están encriptados, y esta marcado si están usados o no.

## Backend

El backend es un proyecto de Node.js con Express y TypeScript.

Si nos fijamos en las rutas

_./backend/src/routes_

Tenemos:

- `auth.routes.ts`: Para el registro, login simple y logout.

- `protected.routes.ts`: Para el endpoint protegido que requiere autenticación.

- `twoFactor.routes.ts`: Para habilitar el 2FA, generar el código QR y validar los códigos TOTP.

### Primer paso login

Vamos a por los interesantes:

_backend/src/controllers/auth.controller.ts_

Aquí chequeamos y si el usuario tiene doble factor habilitado, creamos un token temporal JWT, para indicar que el usuario ya ha pasado la primera fase de autenticación, pero no ha validado su código TOTP aún.

### Segundo paso login

En el front se le pide al usuario el código TOTP, y se envía al backend para validarlo.

_backend/src/controllers/twoFactor.controller.ts_

```ts
export const verify2FA = async (req: Request, res: Response) => {
```

Aquí lo que hacemos es que:

- Por un lado verificamos el token temporal que creamos al hacer el primer login (la clave estándar), es válido y no ha expirado.

- Una vez comprobado que todo ok, ahora toca validar el TOTP:

- Una vez que está todo Ok, creamos la cookie de sesión.

## Crear 2FA

Vamos ahora a ver el paso de habilitar el 2FA para un usuario.

En la aplicación veremos que tenemos una opción para habilitarlo en una cuenta que ya está logada.

En back se llaman a los endpoints:

_backend/src/controllers/twoFactor.controller.ts_

```ts
export const setup2FA = async (req: Request, res: Response) => {
```

- Este endpoint ha tenido que pasar primero por el middleware de autenticación, para asegurarnos que el usuario está logado (aquí regemos el userId del token de sesión): `backend/src/middleware/auth.ts``

- De ahí cargamos los datos del usuario, de ahí sacamos el email del usario (se usara para crear el QR con el secreto TOTP).

```diff
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
+      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret,
    });
```

> Aquí hay un tema curioso con el algoritmo `SHA1`, sería mejor usar `SHA256` o `SHA512`, pero la mayoría de las apps de autenticación (Google Authenticator, Authy, etc) solo soportan `SHA1` (sobre todo si metemos el código manual), así que nos quedamos con ese para asegurar compatibilidad.

Usando la librería `otpauth` generamos el string con el secreto y con `qrcode` el QR para poder escanearlo.

Y después grabamos esa info en base de datos en la ficha del usuario.

Y también devolvemos el secreto y el QR en la respuesta para que el frontend pueda mostrarlo.

## Habilitarlo

Una vez que le hemos enviado esa info al usuario, él escaneará el código y a partir de ahí su app de autenticación (Google Authenticator, Authy, etc) empezará a generar códigos TOTP cada 30 segundos.

Para asegurar que lo tiene bien configurado, le pedimos que meta un código TOTP generado por su app, y lo validamos con el backend, ahí es donde llamamos al endpoint (./backend/src/controllers/twoFactor.controller.ts):

```ts
export const enable2FA = async (req: Request, res: Response) => {
```

Ahí leemos de la sesión el Id de usario, y el código TOTP que nos ha enviado el frontend, y validamos que ese código es correcto para el secreto que tenemos guardado en base de datos.

Ahí generamos los recovery codes, que el usuario puede usar en caso de perder acceso a su app de autenticación (perder el móvil, etc), y los guardamos también en base de datos.

Y habilitamos para ese usuario el flag de `twoFactorEnabled` a `true`, para que a partir de ahí, cada vez que se loguee, tenga que pasar por el proceso de validación del código TOTP.

## Front End

Y el front end tenemos el siguiente flujo.

_frontend/src/App.tsx_

Primero el usuario se registra (modo estándar esto nos lo saltamos):

Login Page >> Signup Page >> Login Page

De ahí va a habilitar el two factor:

Login Page >> Welcome Page >> Setup 2FA Page

De aquí cuando el usuario ya tiene el 2FA habilitado, cada vez que intente loguearse, después de meter su email y contraseña, le aparecerá la pantalla para meter el código TOTP:

Login Page >> Verify 2FA Page >> Welcome Page

Veamos los pasos fundamentales:

## Sign up

1. Setup2FAPage

_frontend/src/pages/Setup2FAPage.tsx_

Aquí en el `useEffect` hacemos la llamada al backend para generar el secreto TOTP y el QR, y lo mostramos al usuario para que lo escanee.

Si nos vamos al markup podemos ver el flujo completo (está un poco guarreras), a destacar:

- `QRCodeDisplay`: aquí mostramos como una imagen el QR.
- `VerificationFrom`: aquí mostramos el input para verificar que ha ido bien el setup del QR, el callback ejecuta `handleVerify2FA` que hace la llamada al backend para validar el código TOTP que el usuario ha metido y habalitarlo.

## Login

_frontend/src/pages/LoginPage.tsx_

Si nos vamos a la página de login, en el `handleSubmit`, cuando el usuario ha introducido la clave "normal", preguntamos tiene habilitado el doble factor, en ese caso vamos al página de verificar doble autenticacíon.

_frontend/src/pages/Verify2FAPage.tsx_

Aquí si nos vamos al markup podemos ver el iput para meter el código TOTP, es form tiene una acción por defecto que llama callback `handleSubmit`, si todo va bien navega a la página welcome.

¡¡ Ojo !! todo este flujo de navegación es seguridad por usabilidad, donde realmente se aplica la seguridad es en el servidor inyectando las headers o cookies correspondientes (tokens JWT).

## En la página welcome

_./frontend/src/pages/WelcomePage.tsx_

Aquí lo más interesantes de _handleFetchProtectedData_ al pinchar en el botón para acceder al recurso protegido, hacemos una llamada al backend a un endpoint que solo se puede acceder si el usuario tiene la cookie de sesión (que se le asigna al validar el código TOTP), y ahí el backend valida esa cookie y devuelve la info del recurso protegido.

# Depurando...

Vamos a depurar esto y ver que tal va.

Para ello podemos poner side by side el navegador y Code.

En code ponemos breakpoints en los endpoints:

_./backend/src/controllers/twoFactor.controller.ts_

_setup2FA_

_verify2FA_

_enable2FA_

Y en _protected.controller.ts_

_./backend/src/controllers/protected.controller.ts_

_getProtectedData_

Arrancamos en back javascript debug.

Y en Front End

**_ FIN DEMO _** :)

---

## Estructura del proyecto

```
00-start/
├── frontend/          # Aplicación React con Vite
│   ├── src/
│   │   ├── pages/    # Páginas: Login, Signup, Welcome
│   │   ├── App.tsx   # Configuración de rutas
│   │   └── main.tsx  # Punto de entrada
│   └── package.json
├── backend/           # API REST con Express
│   ├── src/
│   │   ├── models/   # Modelo de Usuario con Mongoose
│   │   ├── db/       # Configuración de MongoDB
│   │   └── index.ts  # Servidor y endpoints
│   ├── .env          # Variables de entorno
│   └── package.json
├── docker-compose.yml # MongoDB en Docker
└── README.md
```

## Inicio rápido

### 1. Instalar dependencias

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 2. Iniciar MongoDB con Docker

Desde la carpeta `frontend/` o `backend/`:

```bash
npm run docker:up
```

Esto levantará un contenedor de MongoDB en `localhost:27017` con las credenciales:

- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `authdb`

### 3. Iniciar la aplicación completa

**Opción 1 - Todo en uno (recomendado):**

Desde la carpeta `frontend/`:

```bash
npm run dev:all
```

Esto iniciará automáticamente:

- MongoDB (si no está corriendo)
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

**Opción 2 - Manualmente:**

Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

### 4. Usar la aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Regístrate en la página de Signup con:
   - Nombre
   - Email
   - Contraseña (mínimo 6 caracteres)
3. Inicia sesión con tus credenciales
4. Serás redirigido a la página de bienvenida

## Tecnologías

### Frontend

- React 19
- TypeScript
- Vite 7
- Tailwind CSS v4
- DaisyUI
- React Router DOM

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB con Mongoose
- bcryptjs (hash de contraseñas)
- CORS
- dotenv

### Base de datos

- MongoDB 7 (Docker)

## Scripts disponibles

### Frontend (`frontend/`)

- `npm run dev` - Inicia solo el frontend
- `npm run dev:all` - Inicia MongoDB + backend + frontend
- `npm run docker:up` - Levanta MongoDB
- `npm run docker:down` - Detiene MongoDB
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción

### Backend (`backend/`)

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila TypeScript
- `npm run start` - Ejecuta el servidor compilado
- `npm run docker:up` - Levanta MongoDB
- `npm run docker:down` - Detiene MongoDB
- `npm run docker:logs` - Ver logs de MongoDB

## Endpoints de la API

### POST /api/signup

Registra un nuevo usuario.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

### POST /api/login

Autentica un usuario existente.

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

### GET /api/health

Health check del servidor.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-07T10:00:00.000Z"
}
```

## Características implementadas

✅ Autenticación completa con MongoDB  
✅ Contraseñas hasheadas con bcryptjs  
✅ Validación de formularios en frontend y backend  
✅ Mensajes de error/éxito con DaisyUI  
✅ Navegación con React Router  
✅ Proxy de Vite configurado (sin CORS)  
✅ MongoDB en Docker  
✅ Variables de entorno configuradas  
✅ TypeScript en todo el proyecto  
✅ Hot reload en desarrollo

## Detener la aplicación

Para detener MongoDB:

```bash
npm run docker:down
```

Para detener el servidor de desarrollo, presiona `Ctrl+C` en las terminales correspondientes.
