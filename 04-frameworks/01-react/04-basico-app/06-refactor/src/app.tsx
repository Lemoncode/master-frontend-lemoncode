import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {LoginPage, ListPage, DetailPage} from './pages';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
};
