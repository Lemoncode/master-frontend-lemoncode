export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  await useStorage().setItem('db:cart', body)

  return new Response('OK')
})
