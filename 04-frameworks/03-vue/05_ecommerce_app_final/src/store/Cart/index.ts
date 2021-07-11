import {
  Module,
  MutationTree,
  ActionTree,
  GetterTree,
  ActionContext,
} from 'vuex'

import { Product } from '@/types'
import {
  ICartState,
  ICartGetters,
  CartMutationsType,
  CartActionsType,
  CartItem,
  CartMutationEnums,
  CartActionEnums,
} from './types'

const state: () => ICartState = () => ({ items: {} })

const getters: GetterTree<ICartState, unknown> & ICartGetters = {
  items: (state: ICartState) => state.items,
  totalItemsInCart: (state: ICartState) => {
    const cartItems: CartItem[] = Object.values(state.items || {})
    return cartItems.reduce((acc: number, item: CartItem) => {
      return item.quantity + acc
    }, 0)
  },
}

const mutations: MutationTree<ICartState> & CartMutationsType = {
  [CartMutationEnums.ADD_ITEM_TO_CART](state: ICartState, product: Product) {
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
    state: ICartState,
    id: Product['id']
  ) {
    delete state.items[id]
  },
  [CartMutationEnums.DECREMENT_QUANTITY](state: ICartState, id: Product['id']) {
    if (state.items[id].quantity > 1) {
      state.items[id].quantity--
    }
  },
}
const actions: ActionTree<ICartState, unknown> & CartActionsType = {
  [CartActionEnums.ADD_ITEM_TO_CART](
    { commit }: ActionContext<ICartState, unknown>,
    product: Product
  ) {
    if (!product) return
    commit(CartMutationEnums.ADD_ITEM_TO_CART, product)
  },
  [CartActionEnums.REMOVE_ITEM_FROM_CART](
    { commit }: ActionContext<ICartState, unknown>,
    id: Product['id']
  ) {
    if (!id) return
    commit(CartMutationEnums.REMOVE_ITEM_FROM_CART, id)
  },
  [CartActionEnums.DECREMENT_QUANTITY](
    { commit }: ActionContext<ICartState, unknown>,
    id: Product['id']
  ) {
    if (!id) return
    commit(CartMutationEnums.DECREMENT_QUANTITY, id)
  },
}

const CartModule: Module<ICartState, unknown> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}

export default CartModule
