# 03 Login con zod — validar antes de salir a la red

**Parte de:** `02-login`.

El login ya funciona, pero si envías el formulario vacío **la petición sale igual** y es el servidor quien contesta con un error genérico. Queremos comprobar los datos **antes** del `fetch` y decir **qué campo** está mal.

Para eso usamos **zod**: describimos cómo tienen que ser los datos en un **esquema**, y de ese esquema salen tres cosas a la vez: la validación, los mensajes de error y el tipo de TypeScript.

## Qué toca este paso

```
src/
  login.schema.ts   ← nuevo: cómo tienen que ser las credenciales
  login.tsx         ← valida antes de enviar y pinta el error de cada campo
```

`zod` ya está instalado desde el `00-boilerplate` (lo usa también el servidor).

# Pasos

## 1. El esquema

_./src/login.schema.ts_ — **fichero nuevo**

```ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(4, "La contraseña necesita al menos 4 caracteres"),
});

export type Credentials = z.infer<typeof loginSchema>;
```

- Cada campo lleva su regla y **su mensaje**: el texto que verá el usuario vive junto a la regla.
- **`z.infer`** saca el tipo del esquema: `Credentials` es `{ username: string; password: string }`. No escribes el tipo a mano, así que **no se puede desincronizar** de la validación.
- Va en su propio fichero porque no es un componente: es la descripción de un dato.

## 2. Importar y preparar el estado de errores

_./src/login.tsx_

```diff
  import React from "react";
  import { useNavigate } from "react-router";
+ import { z } from "zod";
+ import { loginSchema, type Credentials } from "./login.schema";

  interface User {
    username: string;
    name: string;
  }

+ type FieldErrors = Partial<Record<keyof Credentials, string[]>>;
+
  interface Props {
    onLogin: (user: User) => void;
  }
```

```diff
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isPending, setIsPending] = React.useState(false);
+   const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
```

`FieldErrors` es "para cada campo de `Credentials`, opcionalmente, una lista de mensajes". Es justo la forma que devuelve zod, como verás en el paso siguiente.

Ahora hay **dos tipos de error** en el formulario:

| Estado | Qué guarda | De dónde sale |
| --- | --- | --- |
| `fieldErrors` | Un mensaje por campo | De zod, **antes** de enviar |
| `error` | Un mensaje general | Del servidor, **después** de enviar |

## 3. Validar antes del `fetch`

```diff
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError("");
+
+     const result = loginSchema.safeParse({ username, password });
+
+     if (!result.success) {
+       setFieldErrors(z.flattenError(result.error).fieldErrors);
+       return;
+     }
+
      setIsPending(true);

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
-         body: JSON.stringify({ username, password }),
+         body: JSON.stringify(result.data),
        });
```

- **`safeParse`** no lanza excepciones: devuelve `{ success: true, data }` o `{ success: false, error }`. Con un `if` lo tienes resuelto.
- **`z.flattenError(...).fieldErrors`** convierte el error de zod en `{ username?: string[], password?: string[] }`, listo para pintar.
- El `return` corta el envío: **si no es válido, no hay petición**.
- Se envía **`result.data`**, lo validado, no las variables sueltas.

⚠️ **En este código los errores de campo no se limpian** cuando la validación pasa: no hay ningún `setFieldErrors({})`. Si corriges la contraseña y envías, el mensaje rojo sigue ahí mientras se hace el login. Se corrige en `../05-architecture/03-pods`. Si quieres arreglarlo ya, añade `setFieldErrors({})` justo después del `if`.

## 4. Pintar el error de cada campo

Cada `label` se envuelve en un `div` para poder poner el mensaje debajo:

```diff
-         <label className="floating-label">
-           <span>Usuario</span>
-           <input
-             className="input w-full"
-             name="username"
-             value={username}
-             onChange={(event) => setUsername(event.target.value)}
-           />
-         </label>
+         <div>
+           <label className="floating-label">
+             <span>Usuario</span>
+             <input
+               className="input aria-invalid:input-error w-full"
+               name="username"
+               value={username}
+               onChange={(event) => setUsername(event.target.value)}
+               aria-invalid={Boolean(fieldErrors.username)}
+             />
+           </label>
+           {fieldErrors.username && (
+             <p className="text-error mt-1 text-sm">
+               {fieldErrors.username[0]}
+             </p>
+           )}
+         </div>
```

Y lo mismo con la contraseña:

```diff
-         <label className="floating-label">
-           <span>Contraseña</span>
-           <input
-             className="input w-full"
-             name="password"
-             type="password"
-             value={password}
-             onChange={(event) => setPassword(event.target.value)}
-           />
-         </label>
+         <div>
+           <label className="floating-label">
+             <span>Contraseña</span>
+             <input
+               className="input aria-invalid:input-error w-full"
+               name="password"
+               type="password"
+               value={password}
+               onChange={(event) => setPassword(event.target.value)}
+               aria-invalid={Boolean(fieldErrors.password)}
+             />
+           </label>
+           {fieldErrors.password && (
+             <p className="text-error mt-1 text-sm">
+               {fieldErrors.password[0]}
+             </p>
+           )}
+         </div>
```

- **`aria-invalid`** le dice al lector de pantalla que el campo tiene un error, y de paso sirve para el estilo: **`aria-invalid:input-error`** es una variante de Tailwind que pone el borde rojo solo cuando el atributo es `true`. Un solo atributo para accesibilidad y estilo.
- Se enseña **`[0]`**, el primer mensaje: un campo puede incumplir varias reglas, pero con uno basta.

## Cómo queda

```
src/
  App.tsx
  app-layout.tsx
  character-detail.tsx
  character-list.tsx
  index.css
  login.schema.ts     ← nuevo
  login.tsx           ← valida con zod
  main.tsx
  private-routes.tsx
  session.tsx
```

## Pruébalo

```bash
pnpm start
```

- Borra el usuario y envía: aparece **"El usuario es obligatorio"** con el borde rojo, y en la pestaña **Red** no sale ninguna petición.
- Contraseña `abc`: **"La contraseña necesita al menos 4 caracteres"**.
- Contraseña `mala`: pasa la validación, sale la petición y el servidor contesta **"Usuario o contraseña no válidos"** (el otro tipo de error).
- `admin` / `test`: entras.

**Siguiente:** `04-list` — traer los personajes del servidor y pintarlos.
