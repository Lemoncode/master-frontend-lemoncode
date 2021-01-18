import { Product } from '@/types'
import { ActionContext } from 'vuex'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export interface CartState {
  items: CartItemRecord
}

const mutationTypes = {
  ADD_ITEM_TO_CART: 'ADD_ITEM_TO_CART',
}

const state: () => CartState = () => ({ items: {} })

const actions = {
  addItemToCart(
    { commit }: ActionContext<CartState, unknown>,
    product: Product
  ) {
    commit(mutationTypes.ADD_ITEM_TO_CART, product)
  },
}

const mutations = {
  [mutationTypes.ADD_ITEM_TO_CART](state: CartState, product: Product) {
    if (state.items[product.id]) {
      state.items[product.id].quantity += 1
    } else {
      state.items[product.id] = {
        data: { ...product },
        quantity: 1,
      }
    }
  },
}

const getters = {
  items: (state: CartState) => state.items,
}

const CartModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default CartModule
