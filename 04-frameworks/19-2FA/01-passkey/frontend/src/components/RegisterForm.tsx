import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { registerStart, registerFinish } from "../api/register";

export function RegisterForm() {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const options = await registerStart(email);
      const credential = await startRegistration({ optionsJSON: options });
      await registerFinish(email, credential);

      setSuccess("Registro exitoso. Ya puedes iniciar sesión con tu Passkey.");
      setShowInput(false);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido en el registro"
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
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              className="btn btn-primary flex-1"
              onClick={handleRegister}
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
          className="btn btn-primary w-full"
          onClick={() => setShowInput(true)}
        >
          Registrarse
        </button>
      )}
    </div>
  );
}
