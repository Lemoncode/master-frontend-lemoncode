# Normalize CSS, Reset CSS y Clamp().

## 1. Normalize vs Reset CSS

### ¿Qué es Normalize CSS?

**Normalize.css** hace que los navegadores rendericen todos los elementos de manera más consistente y en línea con los estándares modernos. Solo corrige los estilos que necesitan normalización.

### ¿Qué es Reset CSS?

**Reset CSS** es un conjunto de reglas CSS diseñadas para eliminar las inconsistencias en los estilos predeterminados de los navegadores, proporcionando una base uniforme para el desarrollo web.

### 🔍 Diferencias Clave

| Normalize CSS               | Reset CSS                    |
| --------------------------- | ---------------------------- |
| ✅ Preserva estilos útiles  | ✅ Elimina todos los estilos |
| ✅ Corrige bugs específicos | ✅ Enfoque de "tabla rasa"   |
| ✅ Mejora la usabilidad     | ✅ Requiere redefinir todo   |

### ¿Cuál Elegir?

- **Proyectos rápidos**: Reset básico
- **Proyectos avanzados**: Normalize + Reset personalizado

---

## 2. Normalize CSS

Raramente lo crearemos nosotros, vamos a seleccionar uno ya existente, debido a que tendríamos que saber todas las diferencias entre navegadores para poder crearlo. Vamos a usar el reset de Nicolas Gallagher.

- **Página de descarga**:
  https://necolas.github.io/normalize.css/

### ¿Por qué usar Normalize CSS?

- **Compatibilidad**: Mejora la consistencia entre navegadores.

### 🌐 Ejemplo Práctico: Diferencias entre Navegadores

![Ejemplo Práctico](./01-normalize-css/)

---

## 3. Reset

### ¿Por qué usar un Reset CSS?

- **Consistencia**: Asegura que todos los elementos HTML tengan el mismo punto de partida en todos los navegadores.
- **Control Total**: Permite a los desarrolladores definir sus propios estilos sin interferencias de los estilos predeterminados del navegador.
- **Simplificación**: Reduce la necesidad de sobrescribir estilos predeterminados, facilitando el diseño y la maquetación.

### Reset Básico (Minimalista)

Lo mínimo para trabajar en un proyecto sencillo o de ejemplo rápido.

```css
/* Reset Muy Básico */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

img {
  max-width: 100%;
  display: block;
}
```

### Ejemplo Reset

![Ejemplo Práctico](./02-reset-css/)

## Recursos Adicionales Normalize y Reset

- **Normalize.css**: [https://necolas.github.io/normalize.css/](https://necolas.github.io/normalize.css/)
- **Josh W. Comeau's CSS Reset**: [https://www.joshwcomeau.com/css/custom-css-reset/](https://www.joshwcomeau.com/css/custom-css-reset/)
- **CSS Reset by Andy Bell**: [https://piccalil.li/blog/a-modern-css-reset/](https://piccalil.li/blog/a-modern-css-reset/)
- **Bootstrap reset**: [https://github.com/twbs/bootstrap/blob/main/scss/\_reboot.scss#L58](https://github.com/twbs/bootstrap/blob/main/scss/_reboot.scss#L58)
- **Tailwind Preflight**: [https://tailwindcss.com/docs/preflight](https://tailwindcss.com/docs/preflight)
- **Can I Use**: [https://caniuse.com/](https://caniuse.com/)
- **MDN Web Docs**: [https://developer.mozilla.org/](https://developer.mozilla.org/)

## 4. CSS Responsivo con `clamp()`

Este es un ejemplo práctico de cómo utilizar la función `clamp()` en CSS para crear diseños responsivos y fluidos.
A continuación, veremos qué es `clamp()`, cómo funciona y cómo puedes usar herramientas como Utopia.fyi para generar valores automáticamente.

### ¿Qué es `clamp()`?

`clamp()` es una función CSS que permite establecer un valor que se escala fluidamente entre un mínimo y un máximo, basado en un valor preferido. Es una de las funciones matemáticas más poderosas para crear diseños responsivos sin necesidad de media queries.

```css
/* Sintaxis: clamp(mínimo, preferido, máximo) */
font-size: clamp(1rem, 2.5vw, 2rem);
```

### ¿Cómo funciona?

- **Valor mínimo**: El valor más pequeño que puede tomar la propiedad
- **Valor preferido**: El valor ideal (generalmente una unidad relativa como `vw`, `vh`, etc.)
- **Valor máximo**: El valor más grande que puede tomar la propiedad

El navegador evaluará los tres valores y usará:

- El mínimo si el valor preferido es menor que el mínimo
- El máximo si el valor preferido es mayor que el máximo
- El valor preferido si está entre el mínimo y máximo

### Ventajas de usar `clamp()`

✅ **Menos código**: Elimina la necesidad de múltiples media queries  
✅ **Fluidez**: Transiciones suaves entre diferentes tamaños de pantalla  
✅ **Flexibilidad**: Funciona con cualquier propiedad CSS que acepta valores numéricos  
✅ **Mantenimiento**: Código más limpio y fácil de mantener

Hay diferentes páginas que nos ayudan a generar estos valores de forma automática.

### Introducción a Utopia.fyi

**Utopia.fyi** es una herramienta fantástica para generar escalas tipográficas y espaciales fluidas.
https://utopia.fyi/

### Configuración Básica en Utopia:

1. **Viewport mínimo**: 360px (móvil)
2. **Viewport máximo**: 1440px (desktop)
3. **Escala tipográfica**: Depende de tu diseño, pero una escala común es 1.2 o 1.25
4. **Tamaños base**: Define los tamaños base para móvil y desktop. Por ejemplo, 18px para móvil y 21px para desktop

### ¿Cómo usar Utopia.fyi?

1. **Accede a la calculadora**: Visita [utopia.fyi/type/calculator](https://utopia.fyi/type/calculator)
2. **Configura los parámetros**:
   - Tamaño mínimo del viewport (ej: 360px)
   - Tamaño máximo del viewport (ej: 1440px)
   - Tamaño base para móvil (ej: 18px)
   - Tamaño base para desktop (ej: 21px)
   - Escala tipográfica deseada
3. **Copia las variables CSS** generadas
4. **Úsalas en tu proyecto**

## Compatibilidad de Navegadores

- **Soporte moderno**: Compatible con todos los navegadores modernos
- **Fallback**: Considera fallbacks para navegadores antiguos

```css
/* Fallback para navegadores sin soporte */
font-size: 1.5rem; /* Fallback */
font-size: clamp(1rem, 2.5vw, 2rem); /* Moderno */
```

### Ejemplo Clamp

![Ejemplo Práctico](./03-clamp/)

### Recursos

- **MDN clamp()**: [https://developer.mozilla.org/en-US/docs/Web/CSS/clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- **Can I Use clamp()**: [https://caniuse.com/?search=clamp](https://caniuse.com/?search=clamp)
