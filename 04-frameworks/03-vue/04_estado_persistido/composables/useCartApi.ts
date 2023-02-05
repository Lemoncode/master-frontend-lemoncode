import { CartItemRecord } from '~~/types'

export const useCartApi = () => {
  const getCart = async () => {
    const value = await $fetch('/api/cart')
    return value as CartItemRecord
  }

  const setCart = async (value: CartItemRecord) => {
    return $fetch<CartItemRecord>('/api/cart', {
      method: 'POST',
      body: JSON.stringify(value),
    })
  }

  return {
    getCart,
    setCart,
  }
}
