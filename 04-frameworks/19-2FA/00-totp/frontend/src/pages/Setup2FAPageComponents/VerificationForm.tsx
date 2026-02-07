interface VerificationFormProps {
  verificationCode: string;
  onCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  verifying: boolean;
}

export const VerificationForm = ({
  verificationCode,
  onCodeChange,
  onSubmit,
  verifying,
}: VerificationFormProps) => {
  return (
    <>
      <div className="divider">Verifica tu configuración</div>
      <form onSubmit={onSubmit}>
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
            onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            required
          />
        </div>

        <div className="form-control mt-4">
          <button
            type="submit"
            className={`btn btn-primary ${verifying ? "loading" : ""}`}
            disabled={verifying || verificationCode.length !== 6}
          >
            {verifying ? "Verificando..." : "Habilitar 2FA"}
          </button>
        </div>
      </form>
    </>
  );
};
