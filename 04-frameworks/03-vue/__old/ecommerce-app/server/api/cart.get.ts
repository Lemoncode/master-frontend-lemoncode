import { CartItemRecord } from '@/composables/useCartStore'

export default defineEventHandler(async () => {
  const cart = (await useStorage().getItem('db:cart')) as CartItemRecord

  return cart
})
