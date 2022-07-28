# 08.0 - Handler de Eventos

## Resumen

Como regla general, el flujo de datos en Svelte es de arriba hacia abajo: un componente principal puede setear _props_ en un componente hijo, y un componente puede setear atributos en un elemento, pero no al revés.

A veces es útil romper esa regla.

Vamos a partir del ejemplo [01-clean-boiler](../../01-clean-boiler/).

## Paso a paso

### Manejadores (handlers) de Eventos

Ya lo hemos hecho en otros ejemplos, pero tomemos el caso de un elemento _input_ dentro de un componente. Podríamos agregar un _handler_ de eventos **on:input** que establece el valor de un estado interno _name_ con `event.target.value`:

_App.svelte_

```diff
<script lang="ts">
+  let name: string = 'Lemoncoders';

+  const handleInput = e => {
+    name = e.target.value;
+  };
</script>

<main>
-  <h1>Hello Svelte!</h1>
+  <h1>Hello {name}!</h1>
+  <input value={name} on:input={handleInput} />
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

Pero es un poco... repetitivo. Y se pone aún peor con otros elementos de formulario, por ejemplo un _input_ numérico:

```diff
<script lang="ts">
  let name: string = 'Lemoncoders';
+  let a: number = 0,
+    b: number = 0;

  const handleInput = e => {
    name = e.target.value;
  };

+  const handleChangeA = e => {
+    a = e.target.value;
+  };

+  const handleChangeB = e => {
+    b = e.target.value;
+  };
</script>

<main>
  <h1>Hello {name}!</h1>
  <input value={name} on:input={handleInput} />

+  <div>
+    <input type="number" value={a} on:input={handleChangeA} min="0" max="10" />
+    <input type="range" value={a} on:input={handleChangeA} min="0" max="10" />
+  </div>

+  <div>
+    <input type="number" value={b} on:input={handleChangeB} min="0" max="10" />
+    <input type="range" value={b} on:input={handleChangeB} min="0" max="10" />
+  </div>

+  <p>Resultado: {a} + {b} = {a + b}</p>
</main>

<style>
  h1 {
    color: #ff3e00;
  }
</style>
```

Aunque declaramos las variables de tipo `number`, vemos que el resultado de **a + b** es la concatenación del valor de los _inputs_ (pasaron a ser `string`) y no la suma. ¿Qué hacemos? ¿Utilizar `parseInt` en los _handlers_ para convertir el valor del _input_ a tipo numérico? ¿Puede ayudarnos _Svelte_ con esto?

Con la directiva `bind` podemos bindear propiedades de los elementos como:

- bind:value
- bind:checked
- bind:group
- bind:this
- ...

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End guiado por un grupo de profesionales ¿Por qué no te apuntas a nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria con clases en vivo, como edición continua con mentorización, para que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner).

Y si tienes ganas de meterte una zambullida en el mundo _devops_ apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio).
