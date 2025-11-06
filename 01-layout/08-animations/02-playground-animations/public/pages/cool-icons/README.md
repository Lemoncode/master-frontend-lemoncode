# Microinteracciones

🎯 El objetivo de este ejercicio es crear **microinteracciones profesionales** usando CSS puro, explorando la función **cubic-bezier** y el patrón **label + checkbox** para iconos interactivos sin JavaScript.

> "Las microinteracciones son esos **pequeños detalles** que hacen que una interfaz se sienta profesional y responsiva. Hoy crearemos iconos animados que responden al usuario de forma fluida y natural."

### ¿Por qué son importantes?

- ✅ **Feedback visual inmediato** al usuario
- ✅ **Sensación de calidad** y pulimento
- ✅ **Guían la atención** del usuario
- ✅ **Mejoran la UX** sin añadir complejidad

## 🎨 Patrón: Label + Checkbox (5 min)

> "El truco para iconos interactivos sin JavaScript: usar **`<label>` + `<input type='checkbox'>`**"

Estructura básica en HTML:

```html
<label class="icon expand">
  <input name="helper" type="checkbox"></input>
</label>
```

Complementado con un selector de CSS:

```css
input:checked ~ & {
  /* Estilos aplicados sobre el sibling (elemento) que viene despues del input cuando está activado */
}
```

**🔍 Cómo funciona:**

1. **Click en label** → activa el checkbox
2. **`:checked`** → estado CSS nativo
3. **`~` combinator** → selecciona hermanos siguientes
4. **Sin JavaScript** → CSS puro y accesible

## ❯ Ejercicio 1: Chevron expandible

> "Un chevron que rota para indicar _expand_/_collapse_ - microinteracción básica pero efectiva."

Probemos primero una implementación básica con funcion `linear` para la transición:

```css
.chevron {
  rotate: 90deg;
  transition: rotate 400ms linear;

  input:checked ~ & {
    rotate: -90deg;
  }
}
```

La nota de calidad la daremos con una función más elaborada como _cubic-bezier_ que nos permitirá simular movimientos más realistas, menos artificiales. Un generador simple de este tipo de funciones es [cubic-bezier.com](https://cubic-bezier.com/).

Cambiemos a una cubic-bezier con un rebote natural al final:

```css
transition: rotate 400ms cubic-bezier(0.4, 0.2, 0.12, 1.6);
```

> 🚀 "¿Notas la sutil diferencia? Fíjate en el parámetro 1.6 - ¡permite que la curva vaya más allá de 1! Esto crea un efecto de rebote natural."

**🎯 Puntos clave:**

- `rotate: 90deg` → estado inicial (apunta abajo)
- `rotate: -90deg` → estado checked (apunta arriba)
- `cubic-bezier(0.4, 0.2, 0.12, 1.6)` → curva con "bounce" suave, muy amortiguado

## 🍔 Ejercicio 2: Hamburger menu

> "El _hamburguer menu_ es **LA microinteracción** más reconocible. Tres líneas que se transforman en X."

Atención al HTML donde tenemos 3 elementos que representan las 3 líneas horizontales del icono:

```html
<label class="icon hamburger">
  <input name="helper" type="checkbox" />
  <div class="line" id="l1"></div>
  <div class="line" id="l2"></div>
  <div class="line" id="l3"></div>
</label>
```

Vamos a componer una **transición múltiple** con diferentes movimientos para cada línea:

```css
.hamburger .line {
  transition-property: rotate, translate, opacity;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.4, 0.2, 0.12, 1.6);

  /* La línea superior rota y se desplaza para formar un aspa de la X */
  input:checked ~ &#l1 {
    rotate: -45deg;
    translate: 0 0.24em;
  }
  /* La línea central desapaarece, fade-out */
  input:checked ~ &#l2 {
    opacity: 0;
  }
  /* La línea inferior rota (media vuelta mas de la necesaria) y se desplaza, para formar el otro aspa de la X */
  input:checked ~ &#l3 {
    rotate: 225deg;
    translate: 0 -0.24em;
  }
}
```

**🔍 Desglose del efecto:**

- **Línea 1**: Rota -45° y sube
- **Línea 2**: Desaparece (opacity: 0)
- **Línea 3**: Rota 225° y baja
- **Resultado**: Perfecto icono X

## 💫 Cubic-Bezier

> "La diferencia entre animaciones 'amateur' y 'profesionales' está en el **timing function**."

### Bezier breakdown:

```css
cubic-bezier(0.4, 0.2, 0.12, 1.6)
/*          P1x  P1y   P2x   P2y */
```

### Efectos comunes:

```css
/* Suave y natural */
cubic-bezier(0.4, 0, 0.2, 1)

/* Con rebote */
cubic-bezier(0.4, 0.2, 0.12, 1.6)

/* Más dramático */
cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Snap rápido */
cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

> ℹ️ Usad generadores como [cubic-bezier.com](https://cubic-bezier.com) para crear y visualizar curvas sencillas.

## 🚀 Conclusión

> "Las microinteracciones son **detalles que importan**. Cada click, hover y interacción es una **oportunidad de deleitar** al usuario. Una microinteraccion bien hecha es invisible pero **se siente genial**."
