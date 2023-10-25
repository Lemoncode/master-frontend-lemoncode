import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ProductListScene,
  ProductPage,
  HomeScene,
  CreateProductScene,
  PaymentScene,
} from "scenes";
import { switchRoutes } from "./routes";

export const RouterComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={switchRoutes.root} element={<HomeScene />} />
        <Route path={switchRoutes.productList} element={<ProductListScene />} />
        <Route path={switchRoutes.product} element={<ProductPage />} />
        <Route path={switchRoutes.payment} element={<PaymentScene />} />
        <Route
          path={switchRoutes.createProduct}
          element={<CreateProductScene />}
        />
      </Routes>
    </Router>
  );
};
