# Intro

El laboratorio del módulo de Vue, lo hemos divido en dos secciones.

- **Básico**: Aplicar las técnicas que hemos visto en la parte práctica de Vue a una aplicación, pero dejando espacio por si queréis centraros en otro framework.
- **Opcional**: Para experimentar con requrerimientos cercanos a los que os podéis encontrar en el mundo real.

**IMPORTANTE:** estas prácticas las tenéis que subir a vuestro repositorio de Github (o si lo prefirís Gitlab o Bitbucket público).

## Ejercicio: ToDo App

En este ejercicio, deberás crear una aplicación web utilizando [Nuxt](https://nuxt.com/) que permita a los usuarios administrar una lista de tareas ("ToDo tasks list"). La interfaz de usuario debe tener los siguientes elementos:

- Un formulario con un campo de texto donde los usuarios puedan ingresar el nombre de una tarea.
- También debe contener un botón "Agregar" que agregue una tarea a la lista.
- Una lista de tareas, donde cada tarea tenga:
  - un botón para marcar una tarea como completada, que pueda ser activado o desactivado.
  - un botón "Eliminar" que permita eliminarla de la lista.

La lista de tareas debe ser almacenada en el estado de la aplicación utilizando un store de Pinia.

Una vez se aña una tarea, el campo de texto debe limpiarse automáticamente.

### Requisitos Adicionales (Opcional):

- Agregar estilos CSS para mejorar la apariencia de la aplicación.
- Hacer la app _responsive_ y para poder verla bien e interactuar con ella en dispositivos móviles.
- Añadir la persistencia de estado utilizando el mismo plugin de Pinia que utilizamos en el ejercicio del ChatGPT para que no se pierdan las tareas al refrescar o salir y volver a entrar: https://github.com/prazdevs/pinia-plugin-persistedstate
- Para los botonos de "Agregar" y "Eliminar", se pueden utilizar iconos o emojis, pero intentando que sea lo más accesible posible (usando atributos ARIA o texto "escondido", solo visible para lectores de pantalla en caso de añadir botones que no contengan texto visible y sólo muestren iconos o emojis).
- Agregar funcionalidades adicionales, como poder editar el contenido de una tarea ya existente y guardar los cambios.
- Agregar una funcionalidad de filtrado para mostrar solo las tareas completadas, solo las tareas pendientes o todas las tareas.
- Agregar una funcionalidad de búsqueda para filtrar las tareas por su contenido.
- Agregar una funcionalidad para reordenar las tareas por su contenido o por su estado (completadas primero o pendientes primero).
- Agregar una funcionalidad para marcar todas las tareas como completadas o para borrar todas las tareas completadas.
- Añadir la posibilidad de añadir múltiples listas con un nombre y un menú para navegar entre ellas y que cada una esté separada de las demás por rutas en la aplicación.

Las funcionalidades adicionales son opcionales y no es necesario implementarlas todas. Se pueden añadir algunas de ellas o cualquier otra que se os ocurra.

¡Buena suerte con el ejercicio!
