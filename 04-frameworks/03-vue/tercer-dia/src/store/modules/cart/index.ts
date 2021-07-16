import { Product } from '@/types'
import { ActionContext } from 'vuex'

export type CartItem = { quantity: number; data: Product }

export interface CartState {
  items: Record<Product['id'], CartItem>
}

const state: () => CartState = () => ({
  items: {},
})

const mutations = {
  ADD_ITEM_TO_CART(state: CartState, product: Product): void {
    if (state.items[product.id]) {
      state.items[product.id].quantity += 1
    } else {
      state.items[product.id] = { quantity: 1, data: product }
    }
  },
}

const actions = {
  addItemToCart: (
    { commit }: ActionContext<CartState, unknown>,
    product: Product
  ): void => {
    commit('ADD_ITEM_TO_CART', product)
  },
}

const getters = {
  totalItemsInCart: (state: CartState): number => {
    let total = 0
    for (const item in state.items) {
      total += state.items[item].quantity
    }
    return total
    /* const cartItems = Object.values(state.items)
    return cartItems.reduce((total, item) => total + item.quantity, 0) */
  },
}

const CartModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default CartModule
