# Intro

El laboratorio del módulo de Vue, lo hemos divido en dos secciones.

- **Básico**: Aplicar las técnicas que hemos visto en la parte práctica de Vue a una aplicación, pero dejando espacio
  por si queréis centraros en otro framework.
- **Opcional**: Para experimentar con requrerimientos cercanos a los que os podéis encontrar en el mundo real.

**IMPORTANTE:** estas prácticas las tenéis que subir a vuestro repositorio de Github (o si lo prefirís Gitlab o Bitbucket público).

## Ejercicio: ToDo App

En este ejercicio, deberás crear una aplicación web utilizando [Nuxt](https://nuxt.com/) que permita a los usuarios administrar una lista de tareas ("ToDo list"). La interfaz de usuario debe tener los siguientes elementos:

- Un campo de texto donde los usuarios puedan ingresar el nombre de una tarea.
- Un botón "Agregar" que agregue la tarea ingresada a la lista.
- Una lista de tareas, donde cada tarea tenga:
  - un botón para marcar una tarea como completada, que pueda ser activado o desactivado.
  - un botón "Eliminar" que permita eliminarla de la lista.

La lista de tareas debe ser almacenada en el estado de la aplicación utilizando un store de Pinia.

### Requisitos Adicionales (Opcional):

- Agrega estilos CSS para mejorar la apariencia de la aplicación.
- Puedes hacer la app _responsive_ y para poder verla bien en dispositivos móviles.
- Añade la persistencia de datos utilizando el mismo plugin de Pinia que utilizamos en el ejercicio del ChatGPT para que no se pierdan tus tareas: https://github.com/prazdevs/pinia-plugin-persistedstate
- Para los botonos de "Agregar" y "Eliminar", puedes utilizar los iconos o emojis, pero intenta que sea lo más accesible posible (usando atributos ARIA o texto "escondido", solo visible para lectores de pantalla).
- Puedes agregar funcionalidades adicionales, como poder editar el contenido de una tarea existente.

¡Buena suerte con el ejercicio!
