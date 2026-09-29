import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./app-layout";
import { CharacterDetailPage } from "./character-detail";
import { CharacterListPage } from "./character-list";
import { LoginPage } from "./login";
import { PrivateRoutes } from "./private-routes";

const App = () => {
  const [isLogged, setIsLogged] = React.useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsLogged(true)} />}
        />

        <Route element={<PrivateRoutes isLogged={isLogged} />}>
          <Route element={<AppLayout onLogout={() => setIsLogged(false)} />}>
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
