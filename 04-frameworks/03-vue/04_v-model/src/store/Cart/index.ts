import { Product } from '@/types'
import { ActionContext } from 'vuex'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export interface CartState {
  items: CartItemRecord
  textFilter: string
}

const mutationTypes = {
  ADD_ITEM_TO_CART: 'ADD_ITEM_TO_CART',
  SET_TEXT_FILTER: 'SET_TEXT_FILTER',
}

const state: () => CartState = () => ({ items: {}, textFilter: '' })

const actions = {
  addItemToCart(
    { commit }: ActionContext<CartState, unknown>,
    product: Product
  ) {
    commit(mutationTypes.ADD_ITEM_TO_CART, product)
  },
  setTextFilter(
    { commit }: ActionContext<CartState, unknown>,
    newFilter: string
  ) {
    commit(mutationTypes.SET_TEXT_FILTER, newFilter)
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
  [mutationTypes.SET_TEXT_FILTER](state: CartState, newFilter: string) {
    state.textFilter = newFilter
  },
}

const getters = {
  items: (state: CartState) => state.items,
  textFilter: (state: CartState) => state.textFilter,
  totalItemsInCart: (state: CartState) =>
    Object.values(state.items)
      .map((item: CartItem) => item.quantity)
      .reduce((acc, curr) => acc + curr, 0),
}

const CartModule = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default CartModule
