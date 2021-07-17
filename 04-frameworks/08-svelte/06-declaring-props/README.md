Start from **03-svelte-typescript**

Hasta ahora, hemos tratado exclusivamente el estado interno, es decir, los valores sólo son accesibles dentro de un componente determinado.

En cualquier aplicación real, necesitarás pasar datos de un componente a sus hijos (_children_). Para ello, necesitamos declarar propiedades, generalmente abreviadas como "props". En Svelte, lo hacemos con la palabra clave **export**.

Vamos a crear un nuevo component, llamado HelloComponent, para trabajar las _props_:

_hello.component.svelte_

```html
<script lang="typescript">
  export let name: string; // con 'export' estamos definiendo 'name' como propiedad (props) del componente
</script>

<h1>Hello {name}!</h1>
```

Vamos a utilizarlo desde _app.svelte_:

```js
<script>
  import HelloComponent from "./hello.component.svelte";
</script>

<HelloComponent name="Lemoncoders" />
```

Si lo utilizamos sin pasarle la _prop_ name, el resultado nos renderiza _Hello undefined!_ en nuestro DOM. Podemos utilizar valores por defecto para las props:

```html
<script lang="typescript">
  export let name: string = "Svelte"; // Si el componente padre no pasa valor al hijo, se utilizará el valor por defecto
</script>

<h1>Hello {name}!</h1>
```

## Spread props

Si tenemos un objeto de propiedades, podemos "repartirlas" en un componente en lugar de especificar cada una, con _spread operator_:

_hello.component.svelte_

```html
<script lang="typescript">
  export let name: string;
     export let lastName: string;
</script>

<h1>Hello {name} {lastName}!</h1>
```

_app.svelte_

```html
<script>
  import HelloComponent from "./hello.component.svelte";

  const user = {
    name: "Master",
    lastName: "Frontenders",
  };
</script>

<HelloComponent {...user} />
```
