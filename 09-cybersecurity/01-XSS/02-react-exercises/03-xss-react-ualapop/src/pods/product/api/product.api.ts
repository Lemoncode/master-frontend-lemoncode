import { Product } from "./product.api-model";

export const getProduct = async (id: string): Promise<Product> => {
  const url = `http://localhost:3000/api/products/${id}`;
  const product = await fetch(url);
  const data = await product.json();
  return data;
};