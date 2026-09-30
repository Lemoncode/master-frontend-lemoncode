import { Outlet, useNavigate } from "react-router";
import { useAuth } from "#core/auth";
import { ROUTES } from "#core/router";

export const AppLayout = () => {
  const { userSession, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen">
      <header className="navbar bg-base-200 px-6">
        <div className="flex-1 text-lg font-bold">Rick &amp; Morty</div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70">{userSession?.name}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
};
