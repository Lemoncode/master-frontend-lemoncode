import { Product } from "./create-product.model-api";

export const saveProduct = async (product: Product) => {
  const url = `http://localhost:3000/api/products`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
