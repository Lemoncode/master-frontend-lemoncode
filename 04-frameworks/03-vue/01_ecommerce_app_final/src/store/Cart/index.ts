import {
  Module,
  MutationTree,
  ActionTree,
  GetterTree,
  ActionContext,
} from 'vuex'

import { Product } from '@/types'
import {
  CartState,
  CartGetters,
  CartMutationsType,
  CartActionsType,
  CartItem,
  CartMutationEnums,
  CartActionEnums,
} from './types'

const state: () => CartState = () => ({ items: {} })

const getters: GetterTree<CartState, unknown> & CartGetters = {
  items: (state: CartState) => state.items,
  totalItemsInCart: (state: CartState) => {
    const cartItems: CartItem[] = Object.values(state.items || {})
    return cartItems.reduce((acc: number, item: CartItem) => {
      return item.quantity + acc
    }, 0)
  },
}

const mutations: MutationTree<CartState> & CartMutationsType = {
  [CartMutationEnums.ADD_ITEM_TO_CART](state: CartState, product: Product) {
    if (state.items[product.id]) {
      state.items[product.id].quantity += 1
    } else {
      state.items[product.id] = {
        data: { ...product },
        quantity: 1,
      }
    }
  },
  [CartMutationEnums.REMOVE_ITEM_FROM_CART](
    state: CartState,
    id: Product['id']
  ) {
    delete state.items[id]
  },
  [CartMutationEnums.DECREMENT_QUANTITY](state: CartState, id: Product['id']) {
    if (state.items[id].quantity > 1) {
      state.items[id].quantity--
    }
  },
}
const actions: ActionTree<CartState, unknown> & CartActionsType = {
  [CartActionEnums.ADD_ITEM_TO_CART](
    { commit }: ActionContext<CartState, unknown>,
    product: Product
  ) {
    if (!product) return
    commit(CartMutationEnums.ADD_ITEM_TO_CART, product)
  },
  [CartActionEnums.REMOVE_ITEM_FROM_CART](
    { commit }: ActionContext<CartState, unknown>,
    id: Product['id']
  ) {
    if (!id) return
    commit(CartMutationEnums.REMOVE_ITEM_FROM_CART, id)
  },
  [CartActionEnums.DECREMENT_QUANTITY](
    { commit }: ActionContext<CartState, unknown>,
    id: Product['id']
  ) {
    if (!id) return
    commit(CartMutationEnums.DECREMENT_QUANTITY, id)
  },
}

const CartModule: Module<CartState, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}

export default CartModule
