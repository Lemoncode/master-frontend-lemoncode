import { Product } from '@/types'
import { ActionContext } from 'vuex'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export interface CartState {
  items: CartItemRecord
}

export interface CartGetters {
  items(state: CartState): CartItemRecord
  totalItemsInCart(state: CartState): number
}

export enum CartMutationEnums {
  ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART',
  REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART',
  DECREMENT_QUANTITY = 'DECREMENT_QUANTITY',
}

export type CartMutationsType<S = CartState> = {
  [CartMutationEnums.ADD_ITEM_TO_CART](state: S, product: Product): void
  [CartMutationEnums.REMOVE_ITEM_FROM_CART](state: S, id: string): void
}

export enum CartActionEnums {
  ADD_ITEM_TO_CART = 'addItemToCart',
  REMOVE_ITEM_FROM_CART = 'removeItemFromCart',
  DECREMENT_QUANTITY = 'decrementQuantity',
}

export type CartActionsType<S = CartState> = {
  [CartActionEnums.ADD_ITEM_TO_CART](
    { commit }: ActionContext<S, unknown>,
    product: Product
  ): void
  [CartActionEnums.REMOVE_ITEM_FROM_CART](
    { commit }: ActionContext<S, unknown>,
    id: string
  ): void
}
