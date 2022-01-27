import { Product } from '@/types'
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from 'vuex'

type CartItem = { quantity: number; data: Product }
type CartItemRecord = Record<Product['id'], CartItem>

interface CartState {
  items: CartItemRecord
}

enum CartMutationsEnums {
  ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART',
}

export enum CartActionEnums {
  ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART',
}

const state: () => CartState = () => ({
  items: {},
})

type CartMutations<S = CartState> = {
  [CartMutationsEnums.ADD_ITEM_TO_CART]: (state: S, payload: Product) => void
}

const mutations: MutationTree<CartState> & CartMutations = {
  [CartMutationsEnums.ADD_ITEM_TO_CART]: (
    state: CartState,
    payload: Product
  ) => {
    if (state.items[payload.id]) {
      state.items[payload.id].quantity += 1
    } else {
      state.items[payload.id] = { quantity: 1, data: { ...payload } }
    }
  },
}

type CartActions<S = CartState> = {
  [CartActionEnums.ADD_ITEM_TO_CART]: (
    { commit }: ActionContext<CartState, S>,
    payload: Product
  ) => void
}

const actions: ActionTree<CartState, unknown> & CartActions = {
  [CartActionEnums.ADD_ITEM_TO_CART]: (
    { commit }: ActionContext<CartState, unknown>,
    payload: Product
  ) => {
    if (!payload) return
    commit(CartMutationsEnums.ADD_ITEM_TO_CART, payload)
  },
}

interface CartGetters {
  totalItemsInCart(state: CartState): number
}

const getters: GetterTree<CartState, unknown> & CartGetters = {
  totalItemsInCart: (state: CartState) => {
    const cartItems: CartItem[] = Object.values(state.items)
    return cartItems.reduce(
      (acc: number, current: CartItem) => acc + current.quantity,
      0
    )
  },
}

const CartModule: Module<CartState, unknown> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default CartModule
