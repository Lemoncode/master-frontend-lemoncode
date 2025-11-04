# Transformación `translate`

`translate` es una función de transformación que **mueve elementos** desde su posición original sin afectar el flujo del documento.

## Sintaxis básica

### 1. Con `transform` (tradicional)

```css
transform: translate(x, y); /* Ambos ejes */
transform: translateX(value); /* Solo eje X */
transform: translateY(value); /* Solo eje Y */
transform: translateZ(value); /* Solo eje Z (3D) */
transform: translate3d(x, y, z); /* Los 3 ejes */
```

### 2. Con `translate` (moderno)

```css
translate: x; /* Eje x */
translate: x y; /* Ambos ejes */
translate: x y z; /* Los 3 ejes */
```

> ℹ️ **Recomendación**: Usa las propiedades separadas (`translate`, `rotate`, `scale`) para mejor legibilidad, o `transform` cuando necesites compatibilidad con navegadores antiguos.

## Unidades de medida

### Píxeles absolutos

```css
/* Píxeles absolutos */
transform: translate(50px, -100px); /* 50px derecha, 100px arriba */

/* Porcentajes (relativo al propio elemento) */
transform: translate(50%, -50%); /* 50% de su ancho a la derecha, 50% de su alto hacia arriba */

/* Otras unidades */
transform: translate(2em, 1rem); /* Con unidades relativas */
transform: translate(10vw, 5vh); /* Relativo al viewport */
```

## Particularidades

### Múltiples `transform` o `translate` (❌ Solo aplica el último)

```css
/* Múltiples `transform` o `translate` (❌ Solo aplica el último) */

transform: translate(20%, -30%); /* ❌ Se sobrescribe */
transform: translateX(20%) translateY(-50%); /* ❌ Se sobrescribe */
transform: translate(10%); /* ✅ Esta es la que aplica */

translate: 0 -100%; /* ❌ Se sobrescribe */
translate: 100px 50rem; /* ❌ Se sobrescribe */
translate: 10%; /* ✅ Esta es la que aplica */

/* Múltiples funciones en `transform` (✅ Son acumulativas) */
transform: translate(100%, -50%) translateX(-100%); /* ⚠️ El segundo movimiento X deshace al primero */
/* Resultado, 0%, -50% */

/* Combinación `transform` con propiedad explícita (✅ También se acumulan) */
transform: translate(-100%, -50%); /* ✅ Se aplica */
translate: 100%; /* ✅ Esta es la que se acumula junto a la anterior */
/* Resultado, 0%, -50% */
```

## Características interesantes

1. ✅ **No afecta el layout** - otros elementos no se mueven
2. ✅ **Aceleración GPU** - especialmente con `translate3d()`
3. ✅ **Subpíxel rendering** - movimientos más suaves
4. ✅ **Porcentajes relativos** - responsive automático

## 📄 Ejemplo práctico

### Desplazar un elemento, alternativas

```css
#sq1 {
  /* Funcion translate */
  transform: translate(100%, -50%);
}

#sq1 {
  /* Funcion por eje */
  transform: translateX(100%) translateY(-50%);
}

#sq1 {
  /* Propiedad translate */
  translate: 100% -50%;
}
```

# Transformación `rotate`

`rotate` es una función de transformación que **rota elementos** alrededor de un punto (por defecto el centro) sin afectar el flujo del documento.

## Sintaxis básica

### 1. Con `transform` (tradicional)

```css
transform: rotate(angle); /* Rotación 2D (eje Z) */
transform: rotateX(angle); /* Solo eje X */
transform: rotateY(angle); /* Solo eje Y */
transform: rotateZ(angle); /* Solo eje Z (igual que rotate) */
transform: rotate3d(x, y, z, angle); /* Rotación con vector personalizado */
```

### 2. Con `rotate` (moderno)

```css
rotate: angle; /* Rotación 2D (eje Z) */
rotate: x angle; /* Eje X */
rotate: y angle; /* Eje Y */
rotate: z angle; /* Eje Z (explícito) */
rotate: x y z angle; /* Vector 3D */
```

> ℹ️ **Recomendación**: Usa las propiedades separadas (`translate`, `rotate`, `scale`) para mejor legibilidad, o `transform` cuando necesites compatibilidad con navegadores antiguos.

## Unidades de medida

```css
/* Grados (más común) */
transform: rotate(45deg); /* 45 grados en sentido horario */
transform: rotate(-90deg); /* 90 grados en sentido antihorario */

/* Radianes */
transform: rotate(1.57rad); /* π/2 radianes = 90 grados */
transform: rotate(-3.14rad); /* -π radianes = -180 grados */

/* Turns (vueltas completas) */
transform: rotate(0.25turn); /* 1/4 de vuelta = 90 grados */
transform: rotate(1turn); /* Vuelta completa = 360 grados */
```

## Punto de rotación con `transform-origin`

```css
/* Valores predefinidos */
transform-origin: center; /* Por defecto - centro del elemento */
transform-origin: top left; /* Esquina superior izquierda */
transform-origin: bottom right; /* Esquina inferior derecha */
transform-origin: top; /* Centro superior */

/* Valores personalizados */
transform-origin: 50% 50%; /* Centro (igual que center) */
transform-origin: 0 0; /* Esquina superior izquierda */
transform-origin: 20px 30px; /* Punto específico en píxeles */
```

## Particularidades

```css
/* Múltiples `transform` (❌ Solo aplica el último) */
transform: rotate(30deg); /* ❌ Se sobrescribe */
transform: rotateZ(45deg); /* ✅ Esta es la que aplica */

/* Múltiples funciones en `transform` (✅ Son acumulativas) */
transform: rotate(30deg) rotateX(45deg); /* ✅ Rota 30° en Z y 45° en X */

/* Combinación `transform` con propiedad explícita (✅ También se acumulan) */
transform: rotate(30deg); /* ✅ Se aplica */
rotate: 45deg; /* ✅ Se acumula (75° total) */
```

## Características interesantes

1. ✅ **No afecta el layout** - otros elementos no se mueven
2. ✅ **Rotación suave** - especialmente con transiciones
3. ✅ **Control del punto de rotación** - con `transform-origin`
4. ✅ **Rotaciones 3D** - para efectos avanzados

## 📄 Ejemplo práctico

### Rotar un elemento, alternativas

```css
#sq2 {
  /* Rotación básica 2D */
  transform: rotate(30deg);
}

#sq2 {
  /* Rotación explícita en eje Z */
  transform: rotateZ(30deg);
}

#sq2 {
  /* Propiedad rotate moderna */
  rotate: 30deg;
}

#sq2 {
  /* Con punto de rotación personalizado */
  transform: rotate(30deg);
  transform-origin: top left;
}
```

### Rotaciones 3D

```css
#sq2 {
  /* Rotación en eje X (flip vertical) */
  transform: rotateX(180deg);
}

#sq2 {
  /* Rotación en eje Y (flip horizontal) */
  transform: rotateY(180deg);
}

#sq2 {
  /* Rotación 3D personalizada */
  transform: rotate3d(1, 1, 0, 45deg); /* Rota 45° en diagonal X-Y */
}
```

# Transformación `scale`

`scale` es una función de transformación que **cambia el tamaño** de los elementos desde un punto (por defecto el centro) sin afectar el flujo del documento.

## Sintaxis básica

### 1. Con `transform` (tradicional)

```css
transform: scale(factor); /* Escala uniforme */
transform: scale(x, y); /* Escala por ejes */
transform: scaleX(factor); /* Solo eje X */
transform: scaleY(factor); /* Solo eje Y */
transform: scaleZ(factor); /* Solo eje Z (3D) */
transform: scale3d(x, y, z); /* Los 3 ejes */
```

### 2. Con `scale` (moderno)

```css
scale: factor; /* Escala uniforme */
scale: x y; /* Escala por ejes */
scale: x y z; /* Los 3 ejes */
```

> ℹ️ **Recomendación**: Usa las propiedades separadas (`translate`, `rotate`, `scale`) para mejor legibilidad, o `transform` cuando necesites compatibilidad con navegadores antiguos.

## Valores de escala

```css
/* Números decimales */
transform: scale(1); /* Tamaño original (sin cambio) */
transform: scale(1.5); /* 150% del tamaño original */
transform: scale(0.5); /* 50% del tamaño original */
transform: scale(2, 0.5); /* Doble ancho, mitad alto */

/* Porcentajes */
scale: 70%; /* 70% del tamaño original */
scale: 150% 80%; /* 150% ancho, 80% alto */

/* Valores negativos (flip + escala) */
transform: scale(-1, 1); /* Flip horizontal */
transform: scale(1, -1); /* Flip vertical */
transform: scale(-1, -1); /* Flip horizontal y vertical */
```

## Punto de escala con `transform-origin`

```css
/* Valores predefinidos */
transform-origin: center; /* Por defecto - centro del elemento */
transform-origin: top left; /* Desde esquina superior izquierda */
transform-origin: bottom right; /* Desde esquina inferior derecha */

/* Valores personalizados */
transform-origin: 0 0; /* Desde esquina superior izquierda */
transform-origin: 100% 100%; /* Desde esquina inferior derecha */
```

## Particularidades

```css
/* Múltiples `transform` (❌ Solo aplica el último) */
transform: scale(1.5); /* ❌ Se sobrescribe */
transform: scaleX(2); /* ✅ Esta es la que aplica */

/* Múltiples funciones en `transform` (✅ Son acumulativas) */
transform: scale(1.5) scaleX(2); /* ✅ Escala 1.5 general + 2x en X = 3x en X, 1.5x en Y */

/* Combinación `transform` con propiedad explícita (✅ También se acumulan) */
transform: scale(1.5); /* ✅ Se aplica */
scale: 2; /* ✅ Se acumula (3x total) */
```

## Características interesantes

1. ✅ **No afecta el layout** - otros elementos no se mueven
2. ✅ **Mantiene proporciones** - con un solo valor
3. ✅ **Control del punto de escala** - con `transform-origin`
4. ✅ **Puede crear efectos flip** - con valores negativos

## 📄 Ejemplo práctico

### Escalar un elemento, alternativas

```css
#sq3 {
  /* Escala uniforme */
  transform: scale(1.5);
}

#sq3 {
  /* Escala por ejes */
  transform: scale(150%, 50%);
  transform: scaleX(150%) scaleY(50%);
}

#sq3 {
  /* Propiedad scale moderna */
  scale: 0.7;
}

#sq3 {
  /* Con punto de escala personalizado */
  scale: 0.7;
  transform-origin: bottom left;
}
```

### Efectos especiales con scale

```css
#sq3 {
  /* Flip horizontal */
  transform: scaleX(-1);
}

#sq3 {
  /* Escala diferente por eje */
  transform: scale(2, 0.5); /* Ancho doble, alto mitad */
}

#sq3 {
  /* Escala 3D */
  transform: scale3d(1.5, 1.5, 2);
}
```

# Transformación `skew`

`skew` es una función de transformación que **deforma elementos** inclinándolos en uno o ambos ejes sin afectar el flujo del documento.

## Sintaxis básica

### 1. Con `transform` (tradicional)

```css
transform: skew(x-angle, y-angle); /* Ambos ejes */
transform: skewX(angle); /* Solo eje X */
transform: skewY(angle); /* Solo eje Y */
```

### 2. No hay propiedad `skew` moderna

A diferencia de `translate`, `rotate` y `scale`, **no existe** una propiedad `skew` independiente. Solo se puede usar con `transform`.

## Unidades de medida

```css
/* Grados (más común) */
transform: skew(15deg, 0deg); /* 15° en X, sin inclinación en Y */
transform: skewX(10deg); /* 10° de inclinación horizontal */
transform: skewY(-5deg); /* -5° de inclinación vertical */

/* Radianes */
transform: skewX(0.26rad); /* ~15 grados en radianes */
```

## Particularidades

```css
/* Múltiples `transform` (❌ Solo aplica el último) */
transform: skewX(10deg); /* ❌ Se sobrescribe */
transform: skewY(5deg); /* ✅ Esta es la que aplica */

/* Múltiples funciones en `transform` (✅ Son acumulativas) */
transform: skewX(10deg) skewY(5deg); /* ✅ Inclina 10° en X y 5° en Y */

/* ⚠️ No se puede combinar con propiedad independiente */
transform: skewX(10deg); /* ✅ Se aplica */
/* skew: 5deg; */ /* ❌ Esta propiedad NO existe */
```

## Características interesantes

1. ✅ **No afecta el layout** - otros elementos no se mueven
2. ⚠️ **Puede distorsionar texto** - usar con cuidado en contenido legible
3. ✅ **Efectos de perspectiva** - simula profundidad 2D
4. ✅ **Se combina bien** - con otras transformaciones

## 📄 Ejemplo práctico

### Inclinar un elemento

```css
#sq4 {
  /* Inclinación solo en X (efecto itálica) */
  transform: skewX(10deg);
}

#sq4 {
  /* Inclinación en ambos ejes */
  transform: skew(10deg, 5deg);
}

#sq4 {
  /* Inclinación solo en Y (menos común) */
  transform: skewY(-10deg);
}
```

### Efectos creativos con skew

```css
#sq4 {
  /* Efecto de perspectiva */
  transform: skewY(10deg) rotateX(30deg);
}

#sq4 {
  /* Combinado con escala */
  transform: skewX(15deg) scale(1.2, 0.8);
}
```

## ⚠️ Consideraciones importantes

- **Texto legible**: Usa ángulos pequeños (< 20°) para mantener la legibilidad
- **Accesibilidad**: Los usuarios con dislexia pueden tener dificultades con texto inclinado
- **Combinaciones**: Funciona muy bien con `rotate` y `scale` para efectos complejos
