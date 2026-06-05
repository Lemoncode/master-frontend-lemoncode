import type { Product } from '~/types/product';

export const products: Product[] = [
  {
    id: 1,
    name: '👕 Camiseta Lemoncode',
    description:
      'Hecha con limones de Murcia y con amor. Sólo en color amarillo.',
    price: 20,
  },
  {
    id: 2,
    name: '☕ Taza de Vue',
    description:
      'Edición limitada como las limitadas ofertas de trabajo de Vue.',
    price: 10,
  },
  {
    id: 3,
    name: '🖼️ Nitro Sticker Pack',
    description:
      'Pegatinas del mejor Server Engine para l@s mejores Engineers.',
    price: 5,
  },
  {
    id: 4,
    name: '⌨️ Tecla de TypeScript',
    description: 'Tecla de TypeScript que añade ": any" en cada press',
    price: 10,
  },
];
