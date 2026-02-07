interface QRCodeDisplayProps {
  qrCode: string;
  secret: string;
}

export const QRCodeDisplay = ({ qrCode, secret }: QRCodeDisplayProps) => {
  return (
    <>
      <p className="text-sm text-gray-600">
        Escanea este código QR con tu aplicación de autenticación (Google
        Authenticator, Authy, etc.)
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
    </>
  );
};
