import { useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { loginStart, loginFinish } from "../api/login";

export function LoginForm() {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // 1) Pedimos al backend que inicie el proceso de login:
      //    - Busca al usuario por email
      //    - Genera un challenge nuevo
      //    - Construye las opciones de autenticación WebAuthn (rpID, allowCredentials, etc.)
      //    - Guarda temporalmente el challenge en el servidor
      const options = await loginStart(email);

      // 2) Llamamos a la WebAuthn API del navegador para autenticar:
      //    - El navegador muestra el prompt (huella, PIN, o móvil por QR)
      //    - El autenticador elige una de las credenciales permitidas
      //    - Firma el challenge con la clave privada
      //    - Devuelve una assertion (credential) con el credentialID usado y la firma
      const credential = await startAuthentication({ optionsJSON: options });

      // 3) Enviamos la assertion al backend para finalizar el login:
      //    - Verifica criptográficamente la firma usando la publicKey guardada
      //    - Comprueba que el challenge y el origin coinciden
      //    - Actualiza el counter de la credencial si aplica
      //    - Crea la sesión del usuario y limpia el challenge temporal
      await loginFinish(email, credential);

      setSuccess(`Login exitoso. Bienvenido/a, ${email}`);
      setShowInput(false);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido en el login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {showInput ? (
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="tu@email.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              className="btn btn-accent flex-1"
              onClick={handleLogin}
              disabled={loading || !email}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Confirmar"
              )}
            </button>
            <button
              className="btn btn-ghost flex-1"
              onClick={() => {
                setShowInput(false);
                setEmail("");
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-accent w-full"
          onClick={() => setShowInput(true)}
        >
          Login con Passkey
        </button>
      )}
    </div>
  );
}
