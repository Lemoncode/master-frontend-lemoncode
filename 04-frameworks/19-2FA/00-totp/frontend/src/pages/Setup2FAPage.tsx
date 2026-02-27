import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  QRCodeDisplay,
  VerificationForm,
  RecoveryCodesDisplay,
} from "./Setup2FAPageComponents";

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
            <div className="space-y-4">
              <QRCodeDisplay qrCode={qrCode} secret={secret} />

              {showVerification && (
                <VerificationForm
                  verificationCode={verificationCode}
                  onCodeChange={setVerificationCode}
                  onSubmit={handleEnableVerification}
                  verifying={verifying}
                />
              )}
            </div>
          )}

          {!showRecoveryCodes && (
            <div className="card-actions justify-center mt-6">
              <button onClick={handleBack} className="btn btn-outline">
                Volver
              </button>
            </div>
          )}

          {showRecoveryCodes && (
            <RecoveryCodesDisplay
              recoveryCodes={recoveryCodes}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>
    </div>
  );
};
