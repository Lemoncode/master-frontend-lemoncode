import { CartItemRecord } from '~~/types'

export default defineEventHandler(async (event) => {
  let cart: CartItemRecord = await useStorage().getItem('db:cart')
  return cart
})
