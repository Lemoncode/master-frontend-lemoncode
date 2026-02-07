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
      // Llama a tu backend (/start) para que:
      // compruebe/cree el usuario
      //  genere el challenge
      // construya las Registration Options (rpID, rpName, user, residentKey, etc.)
      //guarde temporalmente el challenge (por ejemplo en DB en currentChallenge)
      const options = await registerStart(email);

      // Esto es la llamada “mágica” a WebAuthn desde el navegador, usando SimpleWebAuthn:
      // // Abre el prompt del sistema (TouchID/FaceID/Android/Windows Hello, etc.)
      // El autenticador genera:
      //   - El par de claves
      //   - El credentialID
      // Devuelve al JS un objeto credential (attestation) con:
      // id (credentialID)
      // response (attestationObject, clientDataJSON, etc.)
      // otros metadatos
      // Importante: aquí no hay red (más allá de lo que haga el navegador/OS); es interacción local con el autenticador.
      const credential = await startRegistration({ optionsJSON: options });

      // Envías ese credential al backend (/finish) para que el servidor:
      // verifique criptográficamente la respuesta:
      // - que el challenge coincide con el guardado
      // - que el origin y rpID son correctos
      // - que la firma/attestation es válida
      //
      // extraiga y guarde en tu DB:
      //
      // - credentialID
      // - publicKey
      // - counter
      // - transports, deviceType, backedUp, etc.
      //
      // elimine currentChallenge
      // Si la verificación pasa, ya puedes decir “registro exitoso”.
      await registerFinish(email, credential);

      setSuccess("Registro exitoso. Ya puedes iniciar sesión con tu Passkey.");
      setShowInput(false);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error desconocido en el registro",
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
