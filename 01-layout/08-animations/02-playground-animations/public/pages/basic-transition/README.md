# Transiciones de css básicas

## 🧩 ¿Qué es `transition`?

La propiedad `transition` en CSS permite **animar cambios graduales** entre dos estados de un elemento (por ejemplo, al hacer `hover`, `focus` o incluso al cambiar una clase con JavaScript).

Sin `transition`, los cambios de estilo son **instantáneos**.  
Con `transition`, esos cambios ocurren **de forma suave y progresiva** durante un tiempo determinado.

## ⚙️ Sintaxis general

```css
#selector {
  transition: <propiedad css> <duración> <función-de-tiempo> <retardo>;
}
```

Parámetros:

1. Propiedad de css: La propiedad CSS que se va a animar (por ejemplo: background-color, transform, opacity, etc.). También se puede usar `all` para animar todos los cambios posibles.

2. Duración: Tiempo que dura la transición (por ejemplo: 200ms, 1s).

3. Función-de-tiempo (timing function): Controla cómo cambia la velocidad de la animación. [easings.net](https://easings.net/)

4. Retardo (opcional): Tiempo de espera antes de que empiece la transición (por ejemplo: 200ms).

> 🧠 Reglas clave
>
> - Las transiciones solo se aplican cuando el valor de la propiedad css usada en el `transition` cambia (por ejemplo, en un `:hover`, `:focus`).
> - No todas las propiedades son animables (por ejemplo, display no lo es).
> - Se pueden animar múltiples propiedades separándolas con comas o usando `all` como primer parámetro del `transition` (en lugar de una propiedad específica de css).

## Ejemplos

```css
/* Change color */
#sq1 {
  transition: background-color 500ms ease;
  &:hover {
    background-color: var(--highlight);
  }
}

/* Change shape */
#sq2 {
  transition: border-radius 400ms ease-in-out;
  &:hover {
    border-radius: 50%;
  }
}

/* Change size */
#sq3 {
  transition: transform 250ms ease-out;
  &:hover {
    transform: scale(1.1);
  }
}

/* Change opacity */
#sq4 {
  transition: opacity 200ms ease;
  &:hover {
    opacity: 0.5;
  }
}

/* Multiple changes / all changes*/
#sq5 {
  --item-size: 6em;
  transition: transform 300ms ease, background-color 300ms ease-out,
    box-shadow 300ms ease-in-out;
  /* transition: all 300ms ease-in-out; */

  &:hover {
    transform: scale(1.3);
    background-color: var(--highlight);
    box-shadow: 0 0 20px 0px rgba(255, 255, 255, 0.35);
  }
}
```

> 🔍 **Curiosidad: controlar la transición al volver al estado normal**
>
> Por defecto, una transición definida fuera del `:hover` solo controla **la animación de entrada** (de estado normal a `hover`).  
> Si queremos controlar **también la transición de salida** (de `hover` a estado normal), debemos definir otra transición **dentro del propio `:hover`**.
>
> Lo curioso es que, cuando se hace esto, **la transición activa es siempre la que existe en el estado por defecto del elemento**.  
> Es decir, mientras el cursor está sobre el elemento, se aplica la transición definida dentro de `:hover` y cuando el cursor sale, el navegador aplica la transición definida en el estado base (fuera del `:hover`).
>
> Este comportamiento se debe a **cómo funciona el modelo de cascada y herencia en CSS**.
