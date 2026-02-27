import { useEffect, useState } from "react";
import { RegisterForm } from "./components/RegisterForm";
import { LoginForm } from "./components/LoginForm";

interface HelloResponse {
  message: string;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHello = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/api/hello");
      if (!response.ok) throw new Error("Error al conectar con el servidor");
      const json: HelloResponse = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl w-96">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl">Frontend + Backend</h2>

          {loading && <span className="loading loading-spinner loading-lg" />}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {data && (
            <>
              <p className="text-lg py-4">{data.message}</p>
              <p className="text-sm opacity-60">
                Timestamp: {new Date(data.timestamp).toLocaleString()}
              </p>
            </>
          )}

          <div className="divider" />

          <div className="card-actions flex-col gap-2 w-full">
            <RegisterForm />
            <LoginForm />
            <button className="btn btn-primary btn-outline btn-sm" onClick={fetchHello}>
              Refrescar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
