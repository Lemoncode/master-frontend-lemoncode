type Price = string
type ProductId = string

export interface Product {
  id: ProductId
  author: string
  published: string
  title: string
  category: string
  publisher: string
  price: Price
}
