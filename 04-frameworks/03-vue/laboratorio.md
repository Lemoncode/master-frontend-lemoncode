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
  - El nombre del plato (campo de texto).
  - El día de la semana (selector o menú desplegable).
- Un botón **"Agregar"** que añada el plato al plan semanal.
- Una vista principal donde se muestren los días de la semana con los platos planificados.
  - Cada día puede mostrar **una lista de platos** (por ejemplo: "Comida" o "Cena").
  - Cada plato debe tener un botón **"Eliminar"** para borrarlo del plan.
- El estado de la aplicación (lista de platos planificados) debe gestionarse con **Pinia**.
- Una vez se añada un plato, el formulario debe limpiarse automáticamente.

---

## 🔧 Requisitos básicos

- Usar **Vue Router** para organizar la aplicación con al menos **dos vistas**:
  - Una vista "Plan semanal" (lista de comidas por día).
  - Una vista "Lista de platos favoritos" (opcionalmente, platos frecuentes para reutilizar).
- Gestionar el estado global de las comidas con **Pinia**.
- Mantener una estructura clara de componentes (por ejemplo: `MealForm.vue`, `MealList.vue`, `DayCard.vue`, etc.).
- El diseño puede hacerse con **Tailwind CSS** (recomendado por rapidez) o con **CSS propio**.

---

## 🌱 Requisitos adicionales (Opcional)

- 💾 **Persistencia del estado**: usar el plugin [`pinia-plugin-persistedstate`](https://codeberg.org/praz/pinia-plugin-persistedstate/) para que el plan semanal no se pierda al recargar la página.
- ✏️ **Editar platos existentes**: permitir modificar el nombre o el día de un plato.
- 🔍 **Filtrar o buscar platos** por nombre o por día.
- 🗓️ **Añadir categorías de comidas** (por ejemplo: "Desayuno", "Comida", "Cena") y permitir filtrarlas.
- 🎨 **Mejorar la apariencia** con Tailwind o CSS personalizado:
  - Mostrar los días en tarjetas o columnas.
  - Usar colores, espaciados y tipografía para hacerlo más legible.
- 📱 **Diseño responsive**, para que se vea bien en móviles.
- 🧺 **Funcionalidades extra**:
  - Botón para limpiar el plan semanal completo.
  - Contador de platos planificados.
  - Exportar el menú semanal como texto (para copiar o imprimir).
  - Navegación adicional: "Plan semanal" / "Platos favoritos" / "Configuración".

---

Las funcionalidades adicionales son opcionales: no es necesario implementarlas todas.
Podéis añadir algunas o incluso proponer otras que se os ocurran.

¡Buena suerte con el ejercicio y que aproveche! 😋
