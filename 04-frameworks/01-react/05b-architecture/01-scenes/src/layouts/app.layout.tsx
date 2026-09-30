import { Outlet, useNavigate } from "react-router";
import { ROUTES } from "#core/router";

interface Props {
  userName: string;
  onLogout: () => Promise<void>;
}

export const AppLayout = (props: Props) => {
  const { userName, onLogout } = props;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen">
      <header className="navbar bg-base-200 px-6">
        <div className="flex-1 text-lg font-bold">Rick &amp; Morty</div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70">{userName}</span>
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
