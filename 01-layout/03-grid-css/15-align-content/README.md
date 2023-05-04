# Align Content

Ahora que hemos llegado tan lejos, alinear el contenido es pan comido, vamos a intentarlo:

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 100px) / repeat(3, 100px);
  border: 1px solid black;
  justify-items: start;
  align-items: center;
  justify-content: space-between;
+ align-content: end;
}
```

Y para usar _justify-content_ y _align-content_ existe un shorthand:

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 100px) / repeat(3, 100px);
  border: 1px solid black;
  justify-items: start;
  align-items: center;
- justify-content: space-between;
- align-content: end;
+ place-content: end space-between;
}
```
