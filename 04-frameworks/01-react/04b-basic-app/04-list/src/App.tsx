import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LoginPage } from "./login";
import { CharacterListPage } from "./character-list";
import { CharacterDetailPage } from "./character-detail";
import { PrivateRoutes } from "./private-routes";
import { AppLayout } from "./app-layout";
import { useSession } from "./session";

const App = () => {
  const { user, isChecking, setUser, logout } = useSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route
          element={
            <PrivateRoutes isLogged={Boolean(user)} isChecking={isChecking} />
          }
        >
          <Route
            element={
              <AppLayout userName={user?.name ?? ""} onLogout={logout} />
            }
          >
            <Route path="/characters" element={<CharacterListPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
