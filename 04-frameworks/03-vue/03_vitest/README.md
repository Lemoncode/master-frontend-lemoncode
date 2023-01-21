# ecommerce-app

## Vitest

Vamos a testear los componentes de nuestra aplicación con la librería Vitest. Vitest está basada en Vite y Jest, por lo que es muy rápida y fácil de configurar.

### Instalación

Para instalar Vitest, ejecutamos el siguiente comando:

```bash
yarn add -D vitest
```

Pero antes de empezar a testear, necesitamos instalar las dependencias de desarrollo que necesitamos para testear componentes de Vue y Nuxt. Para ello, ejecutamos el siguiente comando:

```bash
yarn add -D vitest-environment-nuxt @testing-library/vue
```

### Configuración

Para configurar Vitest, creamos un archivo `vitest.config.mjs` (importante, tiene que ser `.mjs`) en la raíz del proyecto. Utilizaremos la función `defineConfigWithNuxtEnv` para configurar Vitest. Esta función nos permite configurar Vitest para que entienda los componentes y el contexto de Nuxt.

```ts
import { defineConfigWithNuxtEnv } from 'vitest-environment-nuxt/config'

export default defineConfigWithNuxtEnv({
  test: {
    globals: true,
  },
})
```

Con `globals: true`, estamos indicando que queremos que los métodos de Vitest sean accesibles de manera global.

También tenemos que indicarlo en nuestro `tsconfig.json`:

```json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Gracias a que usamos `vitest-environment-nuxt`, podemos testear los componentes de Vue sin necesidad de configurar los `auto-imports` de Nuxt. Por ejemplo, vamos a testear nuestro componente `Header.vue` que utilizaba el composable `useCartStore`:

```ts
import { render } from '@testing-library/vue'
import Header from './Header.vue'

describe('Header', () => {
  it('renders the header', () => {
    const { getByText } = render(Header)

    getByText('Cart 0')
  })
})
```

Para comprobar que funciona, ejecutamos el siguiente comando:

```bash
yarn vitest
```

Pero, en realidad, lo recomendado es que añadamos un alias para ejecutar los tests. Para ello, añadimos el siguiente script en nuestro `package.json`:

```json
{
  "scripts": {
    "test": "vitest --config vitest.config.mjs"
  }
}
```

La próxima vez que ejecutemos `yarn test`, se ejecutarán los tests de Vitest con nuestra configuración.

Vamos a añadir otro caso en el test de `Header.vue` para comprobar que el número de productos en el carrito se actualiza correctamente:

```ts
it('reflects correctly the number of products in the cart after the store has been updated', async () => {
  const cart = useCartStore()
  const { getByText } = render(Header)

  getByText('Cart 0')

  const fakeProduct = {
    id: 1,
    title: 'Product 1',
    price: 10,
    description: '',
    discountPercentage: 1,
    rating: 2,
    stock: 1,
    brand: '',
    category: '',
    thumbnail: '',
    images: [],
  }

  await cart.addItem(fakeProduct)

  getByText('Cart 1')
})
```

Hemos utilizado el composable `useCartStore` para añadir un producto al carrito. Como podemos ver, Vitest nos permite utilizar los _composables_ de Nuxt sin necesidad de configurar los `auto-imports`.

Vamos a testear otro componente para practicar un poco más. Vamos a testear el componente `StaticPrice.vue`.

Primero añadiremos el caso más sencillo. Vamos a comprobar que el componente muestra el precio en euros:

```ts
import StaticPrice from './StaticPrice.vue'
import { render } from '@testing-library/vue'

describe('StaticPrice', () => {
  it('should render euros by default', () => {
    const { getByText } = render(StaticPrice, {
      props: {
        quantity: 15.4,
      },
    })

    getByText('15,40 €')
  })
})
```

El segundo parámetro de `render` es la configuración. En este caso, estamos pasando el precio a través de la prop `quantity`.

Con `getByText`, estamos comprobando que el componente muestra el precio en euros. Ahora vamos a añadir un caso para comprobar que el componente muestra el precio en dólares, con la prop opcional `coin`:

```ts
it('renders dollars if coin USD is passed', () => {
  const { getByText } = render(StaticPrice, {
    props: {
      quantity: 15.4,
      coin: 'USD',
    },
  })

  getByText('$15.40')
})
```

Vamos a ver otro ejemplo de testeo de un componente con Vitest. En este caso, vamos a comprobar que el componente tiene la estructura esperada. Para ello, vamos a utilizar el método `toMatchInlineSnapshot`:

```ts
it('produces the expected snapshot for euros', () => {
  const { container } = render(StaticPrice, {
    props: {
      quantity: 1_000_000_000,
    },
  })

  expect(container).toMatchInlineSnapshot()
})
```

Cuando le demos a guardar, se va a generar un snapshot en el argumento de la función `toMatchInlineSnapshot`. Si ejecutamos el test, veremos que el snapshot se ha generado correctamente auto-mágicamente.
