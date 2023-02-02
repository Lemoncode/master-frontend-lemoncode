export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const createEmptyProduct = (): Product => ({
  id: 0,
  name: "",
  price: 0,
  description: "",
  image: "",
});