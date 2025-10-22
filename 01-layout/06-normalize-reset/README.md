# Normalize y Reset

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

## 📚 Recursos Adicionales

- **Normalize.css**: https://necolas.github.io/normalize.css/
- **Josh W. Comeau's CSS Reset**: https://www.joshwcomeau.com/css/custom-css-reset/
- **Modern CSS Reset**: https://piccalil.li/blog/a-modern-css-reset/
- **CSS Reset by Andy Bell**: https://andy-bell.co.uk/a-modern-css-reset/
- **Bootstrap reset**: https://github.com/twbs/bootstrap/blob/main/scss/_reboot.scss#L58
- **Tailwind Preflight**: https://tailwindcss.com/docs/preflight
- **Can I Use**: https://caniuse.com/
- **MDN Web Docs**: https://developer.mozilla.org/
