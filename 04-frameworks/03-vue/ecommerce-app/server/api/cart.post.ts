import { CartItemRecord } from 'composables/useCartStore'

export default defineEventHandler(async (event) => {
  const body = await readBody<CartItemRecord>(event)

  await useStorage().setItem('db:cart', body)

  return new Response('OK')
})
