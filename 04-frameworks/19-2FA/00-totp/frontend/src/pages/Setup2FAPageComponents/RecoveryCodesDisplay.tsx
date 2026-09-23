interface RecoveryCodesDisplayProps {
  recoveryCodes: string[];
  onFinish: () => void;
}

export const RecoveryCodesDisplay = ({
  recoveryCodes,
  onFinish,
}: RecoveryCodesDisplayProps) => {
  return (
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
          Guarda estos códigos de recuperación en un lugar seguro. ¡Solo se
          mostrarán una vez!
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Códigos de recuperación:</p>
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
          Estos códigos pueden ser usados una sola vez si pierdes acceso a tu
          aplicación de autenticación.
        </p>
      </div>

      <div className="card-actions justify-center mt-6">
        <button onClick={onFinish} className="btn btn-primary">
          Entendido, continuar
        </button>
      </div>
    </div>
  );
};
