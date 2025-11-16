# Formulario

Vamos a meternos a maquetar algo con más empaque, un formulario.

Queremos el típico que tenga los campos:

- Nombre
- Email
- Mensaje

Y un botón de enviar.

si lo hacemos a pelo podría tener esta pinta:

```html
<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <form class="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">
      Formulario de contacto
    </h2>

    <!-- Nombre -->
    <div>
      <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">
        Nombre
      </label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tu nombre"
      />
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="tucorreo@ejemplo.com"
      />
    </div>

    <!-- Mensaje -->
    <div>
      <label for="mensaje" class="block text-sm font-medium text-gray-700 mb-1">
        Mensaje
      </label>
      <textarea
        id="mensaje"
        name="mensaje"
        rows="4"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tu mensaje..."
      ></textarea>
    </div>

    <!-- Botón primary -->
    <button
      type="submit"
      class="w-full inline-flex justify-center items-center
             px-4 py-2 border border-transparent text-sm font-medium
             rounded-md shadow-sm text-white bg-blue-600
             hover:bg-blue-700 focus:outline-none
             focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Enviar
    </button>
  </form>
</div>
```

Esto es el "chorizaco" de tailwind, ¿Y si nos creamos "componetes" de tailwind para no repetir tanto código?

_./src/
style.css_

```diff
@import "tailwindcss";
@source not "../Readme.md";

@theme {
  --h1-size: 2rem;
  --h1-line: 1.2;
  --h1-decoration: underline;
}

+ @layer components {
+  .form-container {
+    @apply w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4;
+  }
+
+  .form-label {
+    @apply block text-sm font-medium text-gray-700 mb-1;
+  }
+
+  .form-input {
+    @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
+           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
+  }
+
+  .btn-primary {
+    @apply w-full inline-flex justify-center items-center
+           px-4 py-2 border border-transparent text-sm font-medium
+           rounded-md shadow-sm text-white bg-blue-600
+           hover:bg-blue-700 focus:outline-none
+           focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
+  }
+}
```

