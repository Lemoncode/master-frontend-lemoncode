# 05 Component update render

## Resumen

Este ejemplo toma como punto de partida el ejemplo \_04-component-unmount.

En este ejemplo vamos a ver como usar React.useEffect para ejecutar
un código justo después de cada renderizado.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos abrir el fichero _demo.tsx_ y creamos un componente simple con un input y un estado.

```tsx
import React from "react";

export const Demo: React.FC = () => {
  const [value, setValue] = React.useState("John");

  return (
    <>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    </>
  );
};
```

- Ahora viene la parte interesante, vamos a llamar a _React.useEffect_ sólo
  informando el primer parámetro (sin dependencias).

_./src/demo.tsx_

```diff
const MyChildComponent = () => {
  const [value, setValue] = React.useState("John");

+ React.useEffect(() => {
+    console.log("A. Called right after every render");
+  });
+
  return (
```

- Si ejecutamos podemos ver que este código se ejecuta después de cada renderizado del componente.

- También podemos añadir una función de limpieza (clean-up function) para liberar recursos justo antes de que se ejecute el siguiente render.

```diff
React.useEffect(() => {
     console.log("A. Called right after every render");
+    return () => console.log("B. Cleanup function called after every render");
+  });
```

- Si introducimos un cambio en el input podemos ver como se invocan las dos funciones.

Como hemos visto, si no pasamos un segundo argumento a _useEffect_, el effect o callback que pasamos por primer parámetro se ejecutará en cada re-ejecución. Sin embargo, si queremos controlar cuándo se ejecuta el efecto y su función de limpieza, debemos indicar explícitamente las dependencias en el segundo parámetro.

Para comprobar este comportamiento, eliminamos el useEffect del ejemplo anterior y creamos uno nuevo que se dispare cada vez que cambie _value_:

```diff
const MyChildComponent = () => {
  const [value, setValue] = React.useState("John");

-   React.useEffect(() => {
-     console.log("A. Called right after every render");
-     return () => console.log("B. Cleanup function called after every render");
-   });

+   React.useEffect(() => {
+     console.log("EFFECT", value);
+     return () => console.log("CLEAN-UP", value);
+   }, [value]);
```

Cuando modificamos el input, React primero ejecuta la función de limpieza del efecto anterior con el valor antiguo y, a continuación, ejecuta el efecto con el nuevo valor.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si lo que te gusta es el mundo del _backend_ también puedes apuntante a nuestro [Bootcamp backend Online Lemoncode](https://lemoncode.net/bootcamp-backend#bootcamp-backend/inicio)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
