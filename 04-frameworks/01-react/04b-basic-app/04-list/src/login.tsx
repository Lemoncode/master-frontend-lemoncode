import React from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { loginSchema, type Credentials } from "./login.schema";

interface User {
  username: string;
  name: string;
}

type FieldErrors = Partial<Record<keyof Credentials, string[]>>;

interface Props {
  onLogin: (user: User) => void;
}

export const LoginPage = (props: Props) => {
  const { onLogin } = props;
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      onLogin(data);
      navigate("/characters");
    } catch {
      setError("No se ha podido conectar con el servidor");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="hero min-h-screen">
      <div className="card bg-base-100 border-base-300 w-full max-w-sm border shadow-2xl">
        <form className="card-body gap-4" onSubmit={handleSubmit}>
          <h1 className="card-title justify-center text-2xl">
            Rick &amp; Morty
          </h1>
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
              <p className="text-error mt-1 text-sm">
                {fieldErrors.username[0]}
              </p>
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
              <p className="text-error mt-1 text-sm">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isPending}
          >
            {isPending && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {isPending ? "Entrando..." : "Entrar"}
          </button>
          <p className="text-sm opacity-60">Prueba con admin / test</p>
        </form>
      </div>
    </main>
  );
};
