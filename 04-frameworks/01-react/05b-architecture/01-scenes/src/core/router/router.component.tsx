import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useAuth } from "#core/auth";
import { AppLayout } from "#layouts";
import { CharacterDetailScene, CharacterListScene, LoginScene } from "#scenes";
import { PrivateRoutes } from "./private-routes.component";
import { ROUTES } from "./routes";

export const Router = () => {
  const { userSession, isChecking, setUserSession, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={<LoginScene onLogin={setUserSession} />}
        />
        <Route
          element={
            <PrivateRoutes
              isLogged={Boolean(userSession)}
              isChecking={isChecking}
            />
          }
        >
          <Route
            element={
              <AppLayout userName={userSession?.name ?? ""} onLogout={logout} />
            }
          >
            <Route path={ROUTES.CHARACTERS} element={<CharacterListScene />} />
            <Route
              path={ROUTES.CHARACTER_DETAIL}
              element={<CharacterDetailScene />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
