import { Product } from "./product-list.api-model";

export const getProductList = async (): Promise<Product[]> => {
  const url = "http://localhost:3000/api/products";
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
