import type { Product } from '@/types'
import { defineStore } from 'pinia'
import type { PiniaCustomStateProperties } from 'pinia'
export type CartItem = { quantity: number; product: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

type state = {
  items: CartItemRecord
} & PiniaCustomStateProperties<{
  items: CartItemRecord
}>

export const useCartStore = defineStore<
  'cart',
  {
    items: CartItemRecord
    filterValue: string
  },
  {
    totalItems: (state: state) => number
  },
  {
    addItemToCart: (product: Product) => void
  }
>({
  id: 'cart',
  state: () => ({
    items: {},
    filterValue: '',
  }),
  getters: {
    totalItems: (state: state) => {
      return Object.values(state.items)
        .map((item: CartItem) => item.quantity)
        .reduce(
          (accumulator: number, current: number) => accumulator + current,
          0
        )
    },
  },
  actions: {
    addItemToCart(product: Product) {
      this.items[product.id] = {
        product,
        quantity: this.items[product.id]?.quantity + 1 || 1,
      }
    },
  },
})
