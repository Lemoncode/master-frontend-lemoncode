export interface Product {
  name: string;
  price: string;
  description: string;
  image: string;
}

export const createEmptyProduct = (): Product => ({
  name: "",
  price: "",
  description: "",
  image: "",
});
