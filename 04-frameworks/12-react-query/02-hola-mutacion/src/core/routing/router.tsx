import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes.const";

import {
  DashboardScene,
  GithubMemberCollectionScene,
  GithubMemberScene,
} from "@/scenes/";
import { TODOScene } from "@/scenes/todo.scene";

export const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<DashboardScene />} />
        <Route
          path={ROUTES.GITHUB_MEMBER_COLLECTION}
          element={<GithubMemberCollectionScene />}
        />
        <Route path={ROUTES.GITHUB_MEMBER} element={<GithubMemberScene />} />
        <Route path={ROUTES.TODOS} element={<TODOScene />} />
      </Routes>
    </HashRouter>
  );
};
