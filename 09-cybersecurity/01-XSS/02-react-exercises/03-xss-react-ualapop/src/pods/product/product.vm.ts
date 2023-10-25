export interface ProductVm {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const createEmptyProduct = (): ProductVm => ({
  id: 0,
  name: "",
  price: 0,
  description: "",
  image: "",
});
