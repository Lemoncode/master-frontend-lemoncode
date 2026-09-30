import React from "react";
import { z } from "zod";
import { loginSchema, type Credentials } from "./login.schema";

type FieldErrors = Partial<Record<keyof Credentials, string[]>>;

interface Props {
  error: string;
  isPending: boolean;
  onLogin: (credentials: Credentials) => void;
}

export const LoginComponent = (props: Props) => {
  const { error, isPending, onLogin } = props;

  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors({});
    onLogin(result.data);
  };

  return (
    <div className="card bg-base-100 border-base-300 w-full max-w-sm border shadow-2xl">
      <form className="card-body gap-4" onSubmit={handleSubmit}>
        <h1 className="card-title justify-center text-2xl">Rick &amp; Morty</h1>
        <div>
          <label className="floating-label">
            <span>Usuario</span>
            <input
              className="input aria-invalid:input-error w-full"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              aria-invalid={Boolean(fieldErrors.username)}
            />
          </label>
          {fieldErrors.username && (
            <p className="text-error mt-1 text-sm">{fieldErrors.username[0]}</p>
          )}
        </div>
        <div>
          <label className="floating-label">
            <span>Contraseña</span>
            <input
              className="input aria-invalid:input-error w-full"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
          </label>
          {fieldErrors.password && (
            <p className="text-error mt-1 text-sm">{fieldErrors.password[0]}</p>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={isPending}>
          {isPending && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
          {isPending ? "Entrando..." : "Entrar"}
        </button>
        <p className="text-sm opacity-60">Prueba con admin / test</p>
      </form>
    </div>
  );
};
