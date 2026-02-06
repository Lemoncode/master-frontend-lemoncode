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
    - IMPORTANTE: en este ejemplo el secreto TOTP lo tenemos en base de datos ¡¡ sin encriptar !! lo ideal sería tenerlo encriptado, y desencriptarlo aquí para generar el código temporal y compararlo con el que nos ha enviado el usuario.
  
  - Una vez que está todo Ok, creamos la cookie de sesión.

## Crear 2FA

Vamos ahora a ver el paso de habilitar el 2FA para un usuario.

En la aplicación veremos que tenemos una opción para habilitarlo en una cuenta que ya está logada.

En back se llaman a los endpoints:

_backend/src/controllers/twoFactor.controller.ts_

```ts
export const setup2FA = async (req: Request, res: Response) => {
```



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
