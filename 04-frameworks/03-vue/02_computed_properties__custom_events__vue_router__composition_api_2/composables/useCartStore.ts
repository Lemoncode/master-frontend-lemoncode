import { defineStore } from 'pinia'
import { Product } from '~~/types'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: {} as CartItemRecord,
  }),
  getters: {
    totalItems: (state) => {
      return Object.values(state.items).reduce((acc, item) => {
        return acc + item.quantity
      }, 0)
    },
  },
  actions: {
    addToCart(item: Product) {
      this.items[item.id] = {
        quantity: this.items[item.id]?.quantity + 1 || 1,
        data: item,
      }
    },
  },
})
