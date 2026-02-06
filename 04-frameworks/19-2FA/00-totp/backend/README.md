# Backend - API REST

API REST con Node.js, Express y TypeScript para autenticación.

## Instalación

```bash
cd backend
npm install
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Ejecuta el servidor compilado

## Endpoints

### POST /api/login

Autenticación de usuario.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "email": "user@example.com",
      "name": "Usuario de ejemplo"
    },
    "token": "ejemplo-token-jwt"
  }
}
```

### POST /api/signup

Registro de nuevo usuario.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nombre Usuario"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "email": "user@example.com",
      "name": "Nombre Usuario"
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
  "timestamp": "2025-12-04T10:00:00.000Z"
}
```

## Configuración

El servidor escucha en el puerto 3000 por defecto.
