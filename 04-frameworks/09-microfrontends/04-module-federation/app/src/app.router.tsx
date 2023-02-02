import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { MicroappLoader, routes } from "./core";
import { AppFrame } from "./pods/app-frame";
import { Dashboard } from "./pods/dashboard";

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <AppFrame>
        <Routes>
          <Route path={routes.home} element={<Dashboard />} />
          <Route path={routes.clock} element={<MicroappLoader microapp="clock" />} />
          <Route path={routes.quote} element={<MicroappLoader microapp="quote" />} />
        </Routes>
      </AppFrame>
    </HashRouter>
  );
};
