import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const WelcomePage = () => {
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUserData(data.data.user);
        setLoading(false);
      } catch (err) {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // Ignorar errores de logout
    }
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleFetchProtectedData = async () => {
    setLoadingData(true);
    setDataError("");
    setProtectedData(null);

    try {
      const response = await fetch("/api/protected/data", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setDataError(
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
          );
          setTimeout(() => {
            handleLogout();
          }, 2000);
        } else {
          setDataError(data.message || "Error al obtener datos protegidos");
        }
        setLoadingData(false);
        return;
      }

      setProtectedData(data);
      setLoadingData(false);
    } catch (err) {
      setDataError("Error de conexión con el servidor");
      setLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-3xl mb-4">
            ¡Bienvenido! 🎉
          </h2>

          {userData && (
            <div className="space-y-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-24">
                  <span className="text-3xl">
                    {userData.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold">{userData.name}</h3>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          )}

          <div className="divider"></div>

          <p className="text-sm text-gray-600">
            Has iniciado sesión exitosamente
          </p>

          <div className="card-actions justify-center mt-4 flex-col gap-2">
            {!userData?.twoFactorEnabled && (
              <button
                onClick={() => navigate("/setup-2fa")}
                className="btn btn-primary"
              >
                Configurar autenticación de dos factores
              </button>
            )}
            <button
              onClick={handleFetchProtectedData}
              className={`btn btn-info ${loadingData ? "loading" : ""}`}
              disabled={loadingData}
            >
              {loadingData ? "Cargando..." : "Obtener datos protegidos"}
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-error"
            >
              Cerrar sesión
            </button>
          </div>

          {dataError && (
            <div className="alert alert-error mt-4">
              <span>{dataError}</span>
            </div>
          )}

          {protectedData && (
            <div className="alert alert-success mt-4">
              <div className="flex flex-col items-start">
                <span className="font-bold">{protectedData.message}</span>
                <span className="text-sm mt-2">
                  {protectedData.data.secretMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
