type Price = string
type ProductId = number

declare interface Product {
  id: ProductId
  author: string
  published: string
  title: string
  category: string
  publisher: string
  price: Price
}
