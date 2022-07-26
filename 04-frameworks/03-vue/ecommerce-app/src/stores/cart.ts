import type { PiniaCustomStateProperties } from 'pinia'
import type { Product } from '@/types'

import { defineStore } from 'pinia'

export type CartItem = { quantity: number; product: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

interface CartState {
  items: CartItemRecord
  filterValue: string
}

export type state = CartState & PiniaCustomStateProperties<CartState>

export const useCartStore = defineStore<
  'cart',
  CartState,
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
