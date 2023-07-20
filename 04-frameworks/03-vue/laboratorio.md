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

- Crear una aplicación que muestre, por defecto, el listado de los miembros de `Lemoncode` en Github, utilizando la API de Github.
- Añadir un campo de búsqueda y un botón para buscar por nombre de organización. Este campo tiene como valor por defecto `Lemoncode` y la búsqueda se realiza cada vez que se pulsa el botón.
- Mostrar en la lista, al menos, una foto de cada miembro y su nombre.
- Si no se encuentra ningún miembro o dicha organización, mostrar un mensaje de error.
- El usuario puede teclear otro nombre de organizacíon, por ejemplo, "microsoft" en el campo de búsqueda; y al pulsar el botón, te muestra los miembros de dicha organización.
- Al clickar en uno de los miembros, navegar a una vista de detalle de ese miembro.
- En la vista de detalle, mostrar la foto del miembro, su nombre, mail, bio, y el nombre de la organización (esto no viene en la info del usuario, habrá que compartir este dato en la app).
- Al volver a la vista de listado, se debería seguir mostrando el listado que había, sin necesidad de tener que realizar la búsqueda de nuevo y el formulario debería conservar el valor de búsqueda que se había usado.

## Recomendado

- Hacer el ejercicio con Nuxt 3 (y Pinia para conservar los datos del campo de búsqueda y el listado).

## Opcional

- Añadir tests unitarios de componentes de Vue o composables.
