# 03 Login with zod — validate before hitting the network

**Starts from:** `02-login`.

The login already works, but if you submit an empty form **the request goes out anyway** and the server answers with a generic error. We want to check the data **before** the `fetch` and say **which field** is wrong.

For that we use **zod**: we describe what the data must look like in a **schema**, and three things come out of it at once: validation, error messages and the TypeScript type.

## What this step touches

```
src/
  login.schema.ts   ← new: what the credentials must look like
  login.tsx         ← validates before sending and shows each field's error
```

`zod` is already installed since `00-boilerplate` (the server uses it too).

# Steps

## 1. The schema

_./src/login.schema.ts_ — **new file**

```ts
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(4, "La contraseña necesita al menos 4 caracteres"),
});

export type Credentials = z.infer<typeof loginSchema>;
```

- Each field has its rule and **its message**: the text the user will see lives next to the rule.
- **`z.infer`** extracts the type from the schema: `Credentials` is `{ username: string; password: string }`. You don't write the type by hand, so it **can't get out of sync** with the validation.
- It lives in its own file because it isn't a component: it describes a piece of data.

## 2. Import and prepare the errors state

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

`FieldErrors` means "for each field of `Credentials`, optionally, a list of messages". That's exactly the shape zod returns, as you'll see in the next step.

The form now has **two kinds of error**:

| State | What it holds | Where it comes from |
| --- | --- | --- |
| `fieldErrors` | One message per field | From zod, **before** sending |
| `error` | One general message | From the server, **after** sending |

## 3. Validate before the `fetch`

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
+     setFieldErrors({});
      setIsPending(true);

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
-         body: JSON.stringify({ username, password }),
+         body: JSON.stringify(result.data),
        });
```

- **`safeParse`** doesn't throw: it returns `{ success: true, data }` or `{ success: false, error }`. One `if` is enough.
- **`z.flattenError(...).fieldErrors`** turns the zod error into `{ username?: string[], password?: string[] }`, ready to render.
- The `return` stops the submit: **if it isn't valid, there's no request**.
- We send **`result.data`**, the validated data, not the loose variables.
- **`setFieldErrors({})`** clears the field errors when validation passes. Without it, if you fail, fix the password and submit, the red message would stay there while logging in.

## 4. Render each field's error

Each `label` is wrapped in a `div` so the message can go below it:

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

And the same for the password:

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

- **`aria-invalid`** tells screen readers the field has an error, and it also drives the style: **`aria-invalid:input-error`** is a Tailwind variant that makes the border red only when the attribute is `true`. One attribute for both accessibility and styling.
- We show **`[0]`**, the first message: a field may break several rules, but one is enough.

## Result

```
src/
  App.tsx
  app-layout.tsx
  character-detail.tsx
  character-list.tsx
  index.css
  login.schema.ts     ← new
  login.tsx           ← validates with zod
  main.tsx
  private-routes.tsx
  session.tsx
```

## Try it

```bash
pnpm start
```

- Clear the username and submit: **"El usuario es obligatorio"** appears with a red border, and the **Network** tab shows no request.
- Password `abc`: **"La contraseña necesita al menos 4 caracteres"**.
- Password `mala`: validation passes, the request goes out and the server answers **"Usuario o contraseña no válidos"** (the other kind of error).
- `admin` / `test`: you're in.

**Next:** `04-list` — fetch the characters from the server and render them.
