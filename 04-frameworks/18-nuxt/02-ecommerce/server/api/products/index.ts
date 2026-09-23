import { products } from '#server/data/products';

export default defineEventHandler(() => {
  return products;
});
