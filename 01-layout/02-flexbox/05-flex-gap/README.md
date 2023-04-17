# Flex gap

Una interesante opcion que se ha introducido en flexbox is la propierdad gap (Esta opcion viene de CSS grid) esto permite añadir un espacio entre cada elemento. 

Vamos a probar como funciona:

```diff
.my-flex-container {
  border: 5px solid black;
  display: flex;
  flex-flow: row wrap;
+ gap: 15px;
}
```