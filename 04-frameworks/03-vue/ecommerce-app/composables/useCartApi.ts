import { CartItemRecord } from './useCartStore'

export const useCartApi = () => {
  const getCart = async () => {
    const items = await $fetch('/api/cart')
    return items as CartItemRecord
  }
  const setCart = async (product: CartItemRecord) => {
    return $fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  return {
    getCart,
    setCart,
  }
}
