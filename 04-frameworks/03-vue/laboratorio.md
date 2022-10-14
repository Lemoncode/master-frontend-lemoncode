# Intro

Laboratorio del módulo de Vue, lo hemos divido en dos secciones

- **Básico**: Aplicar las tecnicas que hemos visto en la parte práctica de Vue a una aplicación, pero dejando espacio
  por si queréis centraros en otro framework.
- **Opcional**: Para hincar el diente con herramientas más avanzadas.

**IMPORTANTE:** estas prácticas las tenéis que subir a vuestro repositorio de Github (o si lo prefirís Gitlab o Bitbucket público).

# Filtrado de organización miembros Github

Mostrar un listado de miembros que pertenencen a una organización en Github. Para ello, vamos a usar la [API de Github](https://docs.github.com/es/rest).

## Básico

## Enunciado

- Crear una aplicación que muestre un listado de miembros de `Lemoncode` en Github, utilizando la API de Github.
- Añadir un campo de búsqueda para buscar por nombre de organización, este campo tiene como valor por defecto "Lemoncode".
- Y un botón para realizar la búsqueda cuando se pulse.
- Mostrar, al menos, una foto de cada miembro y su nombre cuando se obtenga respuesta.
- Si no se encuentra ningún miembro o dicha organización, mostrar un mensaje de error.
- El usuario puede teclear otro nombre de organizacíon, por ejemplo, "microsoft"; y al pulsar el botón
  de busqueda, te muestra los miembros de dicha organización.
- Al clickar en uno de los miembros, navegar a una vista de detalle de ese miembro.
- En la vista de detalle, mostrar la foto del miembro, su nombre, mail, bio, y el nombre de la organización.
- Al volver a la vista de listado, se debería seguir mostrando el listado que había, sin necesidad de tener que realizar la búsqueda de nuevo.

## Opcional

- Hacer el mismo ejercicio pero con Nuxt\* (versión [2](https://nuxtjs.org/docs/get-started/installation) o 3, pero os recomiendo la [3](https://v3.nuxtjs.org/getting-started/quick-start#new-project), que es la más reciente, aunque esté en RC todavía).

\* Nuxt es un framework de Vue, que nos ayuda a crear webapps de manera más rápida.
