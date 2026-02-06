import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Setup2FAPage = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState<boolean>(false);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const response = await fetch("/api/2fa/setup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al generar el código QR");
        }

        setQrCode(data.data.qrCode);
        setSecret(data.data.secret);
        setShowVerification(true);
      } catch (err: any) {
        setError(err.message || "Error al generar el código QR");
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, []);

  const handleEnableVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    try {
      const response = await fetch("/api/2fa/enable", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Código incorrecto");
        setVerifying(false);
        return;
      }

      // Guardar recovery codes para mostrarlos
      if (data.data && data.data.recoveryCodes) {
        setRecoveryCodes(data.data.recoveryCodes);
        setShowRecoveryCodes(true);
      }
    } catch (err: any) {
      setError(err.message || "Error al habilitar 2FA");
      setVerifying(false);
    }
  };

  const handleFinish = () => {
    navigate("/welcome");
  };

  const handleBack = () => {
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            Configurar autenticación de dos factores
          </h2>

          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && qrCode && (
            <>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Escanea este código QR con tu aplicación de autenticación
                  (Google Authenticator, Authy, etc.)
                </p>

                <div className="flex justify-center bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                </div>

                <div className="divider">O</div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Introduce manualmente este código:
                  </p>
                  <div className="bg-base-200 p-3 rounded text-center font-mono text-sm break-all">
                    {secret}
                  </div>
                </div>

                {showVerification && (
                  <>
                    <div className="divider">Verifica tu configuración</div>
                    <form onSubmit={handleEnableVerification}>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            Introduce el código de 6 dígitos de tu app
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="000000"
                          className="input input-bordered text-center text-2xl tracking-widest"
                          value={verificationCode}
                          onChange={(e) =>
                            setVerificationCode(
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          maxLength={6}
                          required
                        />
                      </div>

                      <div className="form-control mt-4">
                        <button
                          type="submit"
                          className={`btn btn-primary ${
                            verifying ? "loading" : ""
                          }`}
                          disabled={verifying || verificationCode.length !== 6}
                        >
                          {verifying ? "Verificando..." : "Habilitar 2FA"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </>
          )}

          {!showRecoveryCodes && (
            <div className="card-actions justify-center mt-6">
              <button onClick={handleBack} className="btn btn-outline">
                Volver
              </button>
            </div>
          )}

          {showRecoveryCodes && (
            <div className="space-y-4">
              <div className="alert alert-success">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>2FA habilitado correctamente</span>
              </div>

              <div className="alert alert-warning">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>
                  Guarda estos códigos de recuperación en un lugar seguro. ¡Solo
                  se mostrarán una vez!
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">
                  Códigos de recuperación:
                </p>
                <div className="bg-base-200 p-4 rounded space-y-2">
                  {recoveryCodes.map((code, index) => (
                    <div
                      key={index}
                      className="font-mono text-center text-lg tracking-wider"
                    >
                      {code}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Estos códigos pueden ser usados una sola vez si pierdes acceso
                  a tu aplicación de autenticación.
                </p>
              </div>

              <div className="card-actions justify-center mt-6">
                <button onClick={handleFinish} className="btn btn-primary">
                  Entendido, continuar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
