import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "#layouts";
import { CharacterDetailScene, CharacterListScene, LoginScene } from "#scenes";
import { PrivateRoutes } from "./private-routes.component";
import { ROUTES } from "./routes";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginScene />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<AppLayout />}>
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
