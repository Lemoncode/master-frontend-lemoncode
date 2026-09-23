# Evitando CSS _jitter_

🎯 En este breve ejercicio pondremos en práctica lo aprendido en el anterior sobre CSS _jitter_ con un caso ligeramente distinto y muy común: animar la selección de una lista de elementos de texto.

> "Es habitual resaltar con transiciones aquellos elementos que queremos seleccionar."

Una implementación segura, haciendo uso de lo aprendido, debe tener en cuenta el espacio final que ocupará el elemento transformado para evitar que tape a otros bloqueando su _hover_:

```css
.list {
  /* ⚠️ WARNING HERE */
  row-gap: 1em;
}
```

Con esto y el patrón _placeholder_ podemos animar de forma segura sin interferir con los otros elementos de la lista:

```css
.placeholder {
  & .text {
    transition: all 125ms ease-in-out;
    transform-origin: 0 50%;
  }

  &:hover .text {
    font-weight: 700;
    scale: 3;

    /* Es mala idea cambiar font size, incluso con placholders, modifica layout */
    /* font-size: 2em; */
  }
}
```

## 🎛️ Solución alternativa sin recurrir a gaps

Otra posibilidad es jugar con el posicionamiento relativo de los elementos `.text`.

> Cuando un `.text` es transformado (debido al `:hover` de su `.placeholder`) podemos colocarlo en una capa `z-index` por debajo del resto de elementos `.text`:

```css
.placeholder {
  position: relative;

  & .text {
    position: relative;
    z-index: 0;
    transition: all 125ms ease-in-out;
    transform-origin: 0 50%;
  }

  &:hover .text {
    z-index: -1;
    font-weight: 700;
    scale: 3;

    /* Es mala idea cambiar font size, incluso con placholders, modifica layout */
    /* font-size: 2em; */
  }
}
```
