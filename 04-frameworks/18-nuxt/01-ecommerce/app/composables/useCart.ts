import type { Product } from '~/types/product';

export const useCart = () => {
  const items = useState<Product[]>('cart-items', () => []);

  const addToCart = (product: Product) => {
    items.value.push(product);
  };

  const remove = (id: number) => {
    const idx = items.value.findIndex((p) => p.id === id);
    if (idx !== -1) items.value.splice(idx, 1);
  };

  const totalItems = computed(() => items.value.length);
  const totalPrice = computed(() =>
    items.value.reduce((sum, p) => sum + p.price, 0),
  );

  return { items, addToCart, remove, totalItems, totalPrice };
};
