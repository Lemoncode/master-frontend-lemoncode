import { Product } from '~~/types'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export const useCartStore = defineStore('cart', () => {
  const items = reactive<CartItemRecord>({})

  const totalItems = computed(() => {
    return Object.values(items).reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  })

  const addToCart = (item: Product) => {
    items[item.id] = {
      quantity: items[item.id]?.quantity + 1 || 1,
      data: item,
    }
  }

  return {
    items,
    totalItems,
    addToCart,
  }
})
