# ecommerce-app

## Vitest

Vamos a testear los componentes de nuestra aplicación con la librería Vitest. Vitest está basada en Vite y Jest, por lo que es muy rápida y fácil de configurar.

### Instalación

Para instalar [Vitest](https://vitest.dev/guide/), ejecutamos el siguiente comando:

```bash
yarn add -D vitest
```

Pero antes de empezar a testear, necesitamos instalar las dependencias de desarrollo que necesitamos para testear componentes de Vue y Nuxt. Para ello, ejecutamos el siguiente comando:

```bash
yarn add -D vitest-environment-nuxt @testing-library/vue
```

- `vitest-environment-nuxt`: nos permite testear componentes de Nuxt sin necesidad de configurar los `auto-imports` u otras opciones del framework: https://github.com/danielroe/vitest-environment-nuxt/
- `@testing-library/vue`: nos permite testear componentes de Vue de una manera más sencilla a `@vue/test-utils` y asemejando la interacción del usuario con la app: https://testing-library.com/docs/

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

Con `globals: true`, estamos indicando que queremos que los métodos de Vitest (`describe`, `it`, `expect`...) sean accesibles de manera global.

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

### `vitest-environment-nuxt`

Gracias a que usamos `vitest-environment-nuxt`, podemos testear los componentes de Vue sin necesidad de configurar los `auto-imports` de Nuxt.

Pero una cosa a tener en cuenta es que esta librería existe de momento de [manera temporal](https://twitter.com/danielcroe/status/1616939322921390082?s=20). El equipo de Nuxt está trabajando en la experiencia de testing para mejorarla y dar una solución oficial: https://nuxt.com/docs/getting-started/testing

## Testear componentes

Por ejemplo, vamos a testear nuestro componente `Header.vue` que utilizaba el composable `useCartStore`:

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

Todos los tests tienen la misma estructura:

```ts
describe('Nombre del componente', () => {
  it('describe el caso de test', () => {
    // ...
  })
})
```

A veces, si queremos realizar una acción antes de ejecutar el test o reutilizar una misma instancia de algún objeto, podemos utilizar el método `beforeEach`:

```ts
// EJEMPLO
describe('Header', () => {
  let getByText: any

  beforeEach(() => {
    const renderResult = render(Header)
    getByText = renderResult.getByText
  })

  it('renders the header', () => {
    getByText('Cart 0')
  })
})
```

Y si necesitamos realizar una acción después de ejecutar el test, podemos utilizar el método `afterEach`:

```ts
// EJEMPLO
describe('Header', () => {
  let getByText: any

  beforeEach(() => {
    const renderResult = render(Header)
    getByText = renderResult.getByText
  })

  afterEach(() => {
    getByText = null
  })

  it('renders the header', () => {
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

Aprovecharemos para decirle dónde está nuestro archivo de configuración, ya que es como lo indican en la guía de Vitest: https://vitest.dev/config/#configuration

La próxima vez que ejecutemos `yarn test` (o `npm t`), se ejecutarán los tests de Vitest con nuestra configuración.

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

Hemos utilizado el composable `useCartStore` para añadir un producto al carrito. Como podemos ver, Vitest y `vitest-environment-nuxt` nos permiten utilizar los _composables_ de Nuxt sin necesidad de configurar los `auto-imports`.

## Testear componentes con props

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

El segundo parámetro de `render` es la _configuración_ ("mount options"). En realidad, es la misma configuración que se pasa a `mount` de `@vue/test-utils`: https://v1.test-utils.vuejs.org/api/options.html#mounting-options

En este caso, estamos pasando el precio a través de la prop `quantity`.

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

Vamos a ver otro ejemplo de testeo de un componente con Vitest. En este caso, comprobaremos que el componente tiene la estructura esperada. Para ello, utilizamos el método `toMatchInlineSnapshot`:

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

Cuando le demos a guardar, se va a generar un snapshot en el argumento de la función `toMatchInlineSnapshot`. Si ejecutamos el test, veremos que el snapshot se ha generado correctamente auto-mágicamente, cambiando nuestro test:

```diff
- expect(container).toMatchInlineSnapshot()
+ expect(container).toMatchInlineSnapshot(`
+ expect(container).toMatchInlineSnapshot(`
+   <div>
+     <div>
+       1.000.000.000,00 €
+     </div>
+   </div>
+ `)
```

Si ejecutamos el test de nuevo, veremos que el snapshot se ha generado correctamente. Si cambiamos el precio en las `props` del test, el test fallará porque el snapshot no coincide con el resultado actual.
