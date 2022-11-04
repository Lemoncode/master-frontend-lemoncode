import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginScene } from "scenes";

export const AuthRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<LoginScene />} />
      </Routes>
    </Router>
  );
};
