# CSS @starting-style

> "Muchas veces hemos deseado que los elementos aparezcan con una transición suave al cargar la página. Tradicionalmente, **no se podía conseguir con CSS puro** - necesitábamos JavaScript para añadir clases después del render."

**`@starting-style`** es una nueva característica CSS que permite animar elementos desde su primer renderizado, solucionando el problema clásico de las "transiciones en el primer render".

Es parte de una evolución hacia **CSS más declarativo** - menos JavaScript, más expresividad nativa.

**El problema clásico**:

```css
/* ❌ No funciona en el primer render */
.content {
  opacity: 1;
  transition: opacity 2s ease-out;
}
```

> "El navegador no puede hacer transición desde un estado (`opacity: 0`) que nunca existió."

**La solución tradicional (JavaScript)**:

```javascript
// ❌ Requiere JS
setTimeout(() => {
  element.classList.add("visible");
}, 10);
```

```css
// En CSS cambiamos opacity en funciónd de la clase "visible"
.content {
  opacity: 0;
  transition: opacity 2s ease-out;

  &.visible {
    opacity: 1;
  }
}
```

## ✨ La Solución: @starting-style

> "`@starting-style` permite definir **estilos iniciales** que solo existen en el primer renderizado del elemento."

Otra forma de entenderlo es pensar en `@starting-style` como **el estado 'fantasma'** del elemento - existe solo en el primer frame para permitir la transición.

La sintaxis es simple y declarativa:

```css
.content {
  transition: opacity 2s ease-out;

  @starting-style {
    opacity: 0;
  }
}
```

> "¡Eso es todo! Al cargar la página, verán un fade-in suave de todo el contenido."

**🔍 Cómo funciona:**

1. **Render inicial**: `opacity: 0` (desde `@starting-style`)
2. **Inmediatamente después**: `opacity: 1` (valor normal)
3. **Resultado**: Transición automática de 0 → 1

## 🎨 Variaciones Creativas

### Fade + Scale:

```css
.content {
  transition: opacity 2s ease-out, transform 2s ease-out;

  @starting-style {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

### Slide from top:

```css
.content {
  transition: opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);

  @starting-style {
    opacity: 0;
    transform: translateY(-2rem);
  }
}
```

### Blur entrance:

```css
.content {
  transition: opacity 1.5s ease-out, filter 1.5s cubic-bezier(0.4, 0, 0.2, 1);

  @starting-style {
    opacity: 0;
    filter: blur(0.5rem);
  }
}
```

## ⚠️ Compatibilidad

**Detección de soporte y fallback strategy**:

```css
/* Estado por defecto visible */
.content {
  opacity: 1;
}

/* Solo aplicar starting-style si hay soporte */
@supports (transition-behavior: allow-discrete) {
  .content {
    transition: opacity 2s ease-out;

    @starting-style {
      opacity: 0;
    }
  }
}
```
