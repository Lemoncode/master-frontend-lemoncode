import { Outlet, useNavigate } from "react-router";

interface Props {
  onLogout: () => void;
}

export const AppLayout = (props: Props) => {
  const { onLogout } = props;

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="navbar bg-base-200 px-6">
        <div className="flex-1 text-lg font-bold">Rick &amp; Morty</div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Salir
        </button>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
};
