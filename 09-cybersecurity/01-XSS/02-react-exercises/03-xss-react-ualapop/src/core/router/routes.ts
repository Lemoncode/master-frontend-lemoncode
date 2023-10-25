import { generatePath } from "react-router-dom";

interface SwitchRoutes {
  root: string;
  productList: string;
  product: string;
  createProduct: string;
  payment: string;
}

export const switchRoutes: SwitchRoutes = {
  root: "/",
  productList: "/product-list/",
  product: "/product/:id",
  createProduct: "/create-product",
  payment: "/payment/:id",
};

interface Routes {
  root: string;
  productList: string;
  createProduct: string;
  product: (id: string) => string;
  payment: (id: string) => string;
}

export const routes: Routes = {
  ...switchRoutes,
  product: (id) => generatePath(switchRoutes.product, { id }),
  payment: (id) => generatePath(switchRoutes.payment, { id }),
};
