import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, ListPage, DetailPage } from "./pages";
import { AuthProvider, AuthWrapperComponent } from "./core/auth";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/list"
            element={
              <AuthWrapperComponent>
                <ListPage />
              </AuthWrapperComponent>
            }
          />
          <Route
            path="/detail/:id"
            element={
              <AuthWrapperComponent>
                <DetailPage />
              </AuthWrapperComponent>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
