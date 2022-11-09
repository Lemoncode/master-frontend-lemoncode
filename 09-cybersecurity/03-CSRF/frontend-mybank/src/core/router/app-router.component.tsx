import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { switchRoutes } from "./routes";
import { AccountListScene, MovementsScene, EditEmailScene } from "scenes";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={switchRoutes.root} element={<AccountListScene />} />
        <Route path={switchRoutes.movementList} element={<MovementsScene />} />
        <Route path={switchRoutes.editEmail} element={<EditEmailScene />} />
      </Routes>
    </Router>
  );
};
