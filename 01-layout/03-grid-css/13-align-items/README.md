# Align items

Es hora de jugar con la alineación vertical de los items:

Su valor por defecto es stretch.

Tomaremos como punto de partida el ejemplo anterior pero vamos a eliminar el ruido del _justify-self_ para el item2.

```diff
.item {
border: 1px solid black;
background-color: khaki;
display: flex;
justify-content: center;
align-items: center;
}
#item2 {
- justify-self: start;
}
```

Ahora definimos _align-items_ a _start_ a nivel del contenedor:

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  border: 1px solid black;
  justify-items: center;
+ align-items: start;
}
```

Probamos con los valores de end y center.

Y de igual manera que hicimos con justify-self let's le podemos aplicar a item2 un align-self start

Y tenemos un shorthand para abreviar ambos casos
_place-items_. Se le puede dar dos valores (el primero es el align y el segundo el justify)

```diff
.grid-container {
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(3, 1fr);
  border: 1px solid black;
- justify-items: center;
- align-items: center;
+ place-items: center;
}
```
