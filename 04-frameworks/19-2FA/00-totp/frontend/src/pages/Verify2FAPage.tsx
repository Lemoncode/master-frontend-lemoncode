import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const Verify2FAPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener datos del usuario y token temporal del state de navegación
  const userData = location.state?.user;
  const tempToken = location.state?.tempToken;

  // Si no hay datos de usuario o token temporal, redirigir al login
  if (!userData || !tempToken) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/2fa/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempToken: tempToken,
          code: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Código incorrecto");
        setLoading(false);
        return;
      }

      // La sesión se establece mediante httpOnly cookie
      // Redirigir a la página de bienvenida
      navigate("/welcome");
    } catch (err) {
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            Autenticación de dos factores
          </h2>

          <p className="text-sm text-gray-600 text-center mb-4">
            Introduce el código de 6 dígitos generado por tu aplicación de
            autenticación o un código de recuperación.
          </p>

          {error && (
            <div className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Código de verificación</span>
              </label>
              <input
                type="text"
                placeholder="000000 o código de recuperación"
                className="input input-bordered text-center text-xl tracking-wider"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
                  )
                }
                maxLength={8}
                required
                autoFocus
              />
              <label className="label">
                <span className="label-text-alt">
                  Acepta códigos de 6 u 8 caracteres
                </span>
              </label>
            </div>

            <div className="form-control mt-6 flex flex-col gap-2">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading || (code.length !== 6 && code.length !== 8)}
              >
                {loading ? "Verificando..." : "Verificar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
