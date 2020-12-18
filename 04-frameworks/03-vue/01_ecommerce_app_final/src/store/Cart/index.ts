import { Product } from '@/types'
import {
  Module,
  MutationTree,
  ActionTree,
  GetterTree,
  ActionContext,
} from 'vuex'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export interface CartState {
  items: CartItemRecord
}

export interface CartGetters {
  items(state: CartState): CartItemRecord
  totalItemsInCart(state: CartState): number
}

export enum CartMutationTypes {
  ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART',
  REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART',
  DECREMENT_QUANTITY = 'DECREMENT_QUANTITY',
}

export type CartMutations<S = CartState> = {
  [CartMutationTypes.ADD_ITEM_TO_CART](state: S, product: Product): void
  [CartMutationTypes.REMOVE_ITEM_FROM_CART](state: S, id: string): void
}

export enum CartActionTypes {
  ADD_ITEM_TO_CART = 'addItemToCart',
  REMOVE_ITEM_FROM_CART = 'removeItemFromCart',
  DECREMENT_QUANTITY = 'decrementQuantity',
}

export type CartActions<S = CartState> = {
  [CartActionTypes.ADD_ITEM_TO_CART](
    { commit }: ActionContext<S, unknown>,
    product: Product
  ): void
  [CartActionTypes.REMOVE_ITEM_FROM_CART](
    { commit }: ActionContext<S, unknown>,
    id: string
  ): void
}

export type Mutations<S = CartState> = {
  [CartMutationTypes.ADD_ITEM_TO_CART](state: S, product: Product): void
  [CartMutationTypes.REMOVE_ITEM_FROM_CART](state: S, id: string): void
}

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

const mutations: MutationTree<CartState> & CartMutations = {
  [CartMutationTypes.ADD_ITEM_TO_CART](state: CartState, product: Product) {
    if (state.items[product.id]) {
      state.items[product.id].quantity += 1
    } else {
      state.items[product.id] = {
        data: { ...product },
        quantity: 1,
      }
    }
  },
  [CartMutationTypes.REMOVE_ITEM_FROM_CART](
    state: CartState,
    id: Product['id']
  ) {
    delete state.items[id]
  },
  [CartMutationTypes.DECREMENT_QUANTITY](state: CartState, id: Product['id']) {
    if (state.items[id].quantity > 1) {
      state.items[id].quantity--
    }
  },
}
const actions: ActionTree<CartState, unknown> & CartActions = {
  [CartActionTypes.ADD_ITEM_TO_CART](
    { commit }: ActionContext<CartState, unknown>,
    product: Product
  ) {
    if (!product) return
    commit(CartMutationTypes.ADD_ITEM_TO_CART, product)
  },
  [CartActionTypes.REMOVE_ITEM_FROM_CART](
    { commit }: ActionContext<CartState, unknown>,
    id: Product['id']
  ) {
    if (!id) return
    commit(CartMutationTypes.REMOVE_ITEM_FROM_CART, id)
  },
  [CartActionTypes.DECREMENT_QUANTITY](
    { commit }: ActionContext<CartState, unknown>,
    id: Product['id']
  ) {
    if (!id) return
    commit(CartMutationTypes.DECREMENT_QUANTITY, id)
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
