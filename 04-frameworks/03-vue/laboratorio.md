# 🥗 Ejercicio: Meal Planner App

## Intro

El laboratorio del módulo de Vue lo hemos dividido en dos secciones:

- **Básico**: aplicar las técnicas que hemos visto en la parte práctica de Vue en una aplicación sencilla, pero dejando espacio para que podáis experimentar libremente.
- **Opcional**: para explorar funcionalidades más avanzadas o similares a lo que os podríais encontrar en un entorno real.

**IMPORTANTE:** estas prácticas debéis subirlas a vuestro repositorio público de Github (o si lo preferís, Gitlab o Bitbucket).

---

## 🍽️ Ejercicio: Meal Planner App

En este ejercicio, deberás crear una aplicación web utilizando [Vue 3](https://vuejs.org/) (con la plantilla de [`create-vue`](https://github.com/vuejs/create-vue)) que permita planificar las comidas de una semana.

La interfaz de usuario debe tener los siguientes elementos:

- Un formulario que permita añadir un plato, indicando:
  1. El nombre del plato (campo de texto).
  2. El día de la semana (`select` o menú desplegable).
  3. Comida o cena (input tipo `radio` o selector o menú desplegable).
  4. Un botón **"Agregar"** que añada el plato al plan semanal.
- El formulario puede estar en un modal o en la parte superior de la página principal.
- En la vista principal se muestren los días de 1 semana con los platos que vamos añadiendo.
  - Cada día puede mostrar **una lista de platos** (por ejemplo: "Comida" o "Cena").
  - Cada plato debe tener un botón **"Eliminar"** para borrarlo del plan.
  - Cada plato debe tener un botón para **"Editar"** para modificar el nombre o el día de un plato.
  - Cada plato debe tener un botón para **"Marcar como favorito"** para añadirlo a la lista de platos favoritos.
  - Deberíamos tener un botón para **"Limpiar"** el plan semanal completo, pero que te pida confirmación antes de hacerlo.
- El estado de la aplicación (lista de platos planificados) debe gestionarse con **Pinia** o podemos usar un `composable` con variables reactivas (`ref` o `computed`).
- Una vez se añada un plato, el formulario debe limpiarse automáticamente (o cerrarse el modal, en caso de que hayáis elegido hacerlo en un modal).

---

## 🔧 Requisitos básicos

- Usar **Vue Router** para organizar la aplicación con al menos **dos vistas**:
  - Una vista principal de "Plan semanal" (lista de comidas por día).
  - Una vista "Lista de platos favoritos" (opcionalmente, platos frecuentes para reutilizar).
  - (Opcionalmente) que en cada uno de estos platos tengamos un botón para añadirlo al plan semanal actual.
- Gestionar el estado global de las comidas con **Pinia** o podemos usar un `composable`.
- Mantener una estructura clara de componentes (por ejemplo: `MealForm.vue`, `MealList.vue`, `DayCard.vue`, etc.).
- El diseño puede hacerse con **Tailwind CSS** (recomendado por rapidez) o con **CSS propio**. No recomiendo usar una librería de componentes a no ser que la conozcáis bien de antemano, ya que os va a retrasar más que ayudaros.

---

## 🌱 Requisitos adicionales (Opcional)

- 💾 **Persistencia del estado**:
  - Si habéis elegido usar **Pinia**, usar el plugin [`pinia-plugin-persistedstate`](https://codeberg.org/praz/pinia-plugin-persistedstate/) para que el plan semanal no se pierda al recargar la página.
  - Si habéis elegido usar un `composable`, usar el `localStorage` para guardar el plan semanal.
- 🔍 **Filtrar o buscar platos** por nombre o por día en la vista principal o en la vista de platos favoritos o en las dos.
- 🗓️ **Añadir filtro de categorías de comidas** (por ejemplo: "Desayuno", "Comida", "Cena") y permitir mostrar solo los platos de una categoría específica en la semana.
- 📱 **Diseño responsive**, para que se vea bien en móviles.
- 🧺 **Funcionalidades extra**:
  - Navegación adicional: "Plan semanal" / "Platos favoritos" / "Configuración" (opcional).

---

Las funcionalidades adicionales son opcionales: no es necesario implementarlas todas.
Podéis añadir algunas o incluso proponer otras que se os ocurran.

¡Buena suerte con el ejercicio y que aproveche! 😋
