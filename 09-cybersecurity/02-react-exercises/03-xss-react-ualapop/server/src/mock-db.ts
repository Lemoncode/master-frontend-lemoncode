interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

let mockProductList: Product[] = [
  {
    id: 1,
    name: "Play Stalin 4",
    price: 250,
    description:
      "play 4 con dos mandos, último juego call of duty digital y con plus para siempre gratis",
    image:
      "http://drive.google.com/uc?export=view&id=1mBLxE6f5d3gz3nXPcR8c16GuF0PQLBrY",
  },
  {
    id: 2,
    name: "Placa base de un router",
    price: 0.99,
    description:
      "No sirve de nada pero si alguien entra en tu cuarto y ve esto pensará que eres hacker y te tendrá respeto",
    image:
      "http://drive.google.com/uc?export=view&id=1oRlnpUYmcrAvJIA3rKnu07yjWMUd-ISk",
  },
  {
    id: 3,
    name: "Test de embarazo positivo",
    price: 30,
    description:
      "Vendo test de embarazo positivo para broma a marido, novio o amante",
    image:
      "http://drive.google.com/uc?export=view&id=1UDSBEZ9gKa9-d6xGGNSG2brwotQqkPMj",
  },
  {
    id: 4,
    name: "Vendo coche marronero",
    price: 40,
    description:
      "Como nuebo, 113 cv aunk parecen 280, de 0 100 a lo k le pises. Tirale sin miedo, 10 años de uso y no me ha parado la Guardia civil desde los 15. Se vende pork tengo 7 hijos y como se lo dejé a alguno me viene con otros 7. Este coche ... solo.",
    image:
      "http://drive.google.com/uc?export=view&id=1Kn3Voxh0C6vHhhsez8VayzpQT3HOxRph",
  },
];

export const getProductList = async () => mockProductList;

export const getProduct = async (id: number) => {
  const product = mockProductList.filter((product) => product.id === id);
  return product[0];
};

export const insertProduct = async (newProduct: Product) => {
  mockProductList = [newProduct, ...mockProductList];
};

export const deleteProduct = async (id: number) => {
  mockProductList = mockProductList.filter((product) => product.id !== id);
  true;
};
