import type { Product, ProductId } from '~/types/product';

type CartItem = {
  product: Product;
  quantity: number;
};

export function useCart() {
  // Global state: shared across SSR + client. Nuxt will hydrate it automatically.
  const items = useState<CartItem[]>('cart-items', () => []);

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  function addToCart(product: Product, quantity = 1) {
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      return;
    }
    items.value.push({ product, quantity });
  }

  function removeFromCart(productId: ProductId) {
    items.value = items.value.filter((i) => i.product.id !== productId);
  }

  return { items, totalItems, totalPrice, addToCart, removeFromCart };
}
