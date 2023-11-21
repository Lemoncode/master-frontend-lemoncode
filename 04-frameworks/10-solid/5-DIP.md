# Principio de inversión de dependencias

No dependas de los detalles, depende de abstracciones.

La mejor manera de conseguir esto es utilizando interfaces, clases abstractas, etc, en lugar de utilizar clases. Está muy ligado (aunque no es lo mismo) con los conceptos de inyección de dependencias o inyección de servicios.

El objetivo del Dependency Inversion Principle (DIP) consiste en reducir las dependencias entre los módulos del código, es decir, alcanzar un **bajo acoplamiento** de las clases.

## Ejemplo

Consideremos el siguente pago de un pedido por parte de un cliente:

```typescript
class Customer
{
    private currentOrder: Order = null;

    addItem(item: Item): boolean {
        if(!this.currentOrder) {
            this.currentOrder = new Order();
        }
        return this.currentOrder.addItem(item: Item);
    }

    deleteItem(item: Item): boolean {
        if(is_null(this.currentOrder)) {
            return false;
        }
        return this.currentOrder.deleteItem(item: Item);
    }

    buyItems(): boolean {
        if(!this.currentOrder) {
            return false;
        }
        const processor = new OrderProcessor(); // <- Aquí
        return processor.checkout(this.currentOrder);
    }
}

class OrderProcessor {
    checkout(order: Order){/*...*/}
}
```

Todo parece muy lógico y muy sensato. Pero esto no cumple el principio DIP: La clase Customer depende de la clase OrderProcesor.

Si hilamos más fino, tampoco cumple el principio Open/Closed. 

Y si hilamos mucho más fino, un cambio en la forma de construir el objeto OrderProcessor implicaría modificar nuestra clase Customer. Con lo que la clase Customer se ve afectada por una "razón para cambiar" adicional a las previstas, violando el principio de Responsabilidad Única.

Para quitar la dependencia entre Customer y OrderProcesor, recurrimos a las interfaces. Customer dependerá de una Interfaz (una abstracción) en vez de depender de una clase concreta.

Esta dependencia del interfaz se puede implementar a través de métodos setters, a través de un argumento del método buyItems, a través del constructor de Customer o a través de algún mecanismo de inyección de dependencias/proveedor de servicios como el de Angular.

```typescript
class Customer
{
    private currentOrder: Order = null;

    addItem(item: Item) {
        if(!this.currentOrder) {
            this.currentOrder = new Order();
        }
        return this.currentOrder.addItem(item: Item);
    }
    deleteItem(item: Item) {
        if(is_null(this.currentOrder)) {
            return false;
        }
        return this.currentOrder.deleteItem(item: Item);
    }

    buyItems(IOrderProcessor processor) {
        if(!this.currentOrder) {
            return false;
        }

        return processor.checkout(this.currentOrder);
    }
}

interface IOrderProcessor
{
    checkout(order: Order);
}

class OrderProcessor implements IOrderProcessor {
    checkout(order: Order) {/*...*/}
}
```

Ahora la clase Customer depende solamente de la abstracción IOrderProcessor y no de la implementación específica. Es decir, ahora los detalles ya no son importantes para Customer.

## Ejemplo

Aunque SOLID aplica a clases, podemos hacer algo parecido en programación funcional.

```js
function setValuesFromServer() {
  fetch('url').then(
    data => {
      document.getElementById('name').text(data.name);
      document.getElementById('birthdate').text(data.birthdate);
    }
  );
}

setValuesFromServer();
```

El ejemplo anterior incumple:

- SRP: Si cambia la url por otra (origen de los datos), debemos modificar este método. Si cambia la forma de presentación html por otra (por ejemplo csv), debemos modificar este método. Son 2 Razones para cambiar.

- DIP: Porque depende de la url concreta y de exista *document*

Aplicando DIP

```js
let modifyHTMLView = {
  setValues: function(data) {
    document.getElementById('name').text(data.name);
    document.getElementById('birthdate').text(data.birthdate);
  }
}

function setValuesFromServer(url, view) {
  fetch(url).then(data => view.setValues(data));
}

setValuesFromServer('url', modifyHTMLView);
```

Ahora podemos cambiar de url o cambiar de View sin modificar la función.

```js
let modifyHTMLView = {...}
setValuesFromServer('url2', modifyXMLView);
let modifyLocalStorage = {...}
setValuesFromServer('url3', modifyLocalStorage);
```

## Ejercicios

### Ejercicio 1

Solucionar el primer ejemplo anterior pasando la abstracción IOrderProcessor a través del constructor de Customer.

## Resumen

Recordemos los consejos de Robert C. Martin:

- Los módulos de alto nivel no deberían depender de módulos de bajo nivel. Ambos deberían depender de abstracciones.
- Las abstracciones no deberían depender de los detalles. Los detalles deberían depender de las abstracciones.

El principio de inversión de dependencias es crucial para las *clean architectures* como la *arquitectura hexagonal*.


