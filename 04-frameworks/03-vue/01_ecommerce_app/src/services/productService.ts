export const productService = {
  async get() {
    const books = await fetch('./books.mock.json', {
      headers: {
        Accept: 'application/json',
      },
    }).then(m => m.json())
    return books
  },
}
