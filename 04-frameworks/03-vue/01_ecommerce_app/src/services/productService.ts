export const productService = {
  async get() {
    const books = await import(
      /* webpackChunkName: "books" */ './books.mock.json'
    ).then(m => m.default)
    return books
  },
}
