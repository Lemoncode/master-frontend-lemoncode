import { products } from '#server/data/products';
import { Product } from '~/types/product';

export default defineEventHandler((event) => {
  const rawId = getRouterParam(event, 'id');
  const id = Number(rawId);

  // 400 si el id no es válido (vacío, NaN, no entero, negativo...)
  if (!rawId || Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product id',
    });
  }

  const product = products.find((p: Product) => p.id === id);

  // 404 si no existe
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  return product;
});
