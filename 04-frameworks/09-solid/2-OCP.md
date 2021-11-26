# Principio Open-Closed

Las clases/modulos/funciones/... que usas deberían estar:

- abiertas para poder extenderse
- cerradas para modificarse.

Traducción: deben poder extenderse sin modificarlas.

## Ejemplos

### Ejemplo 1

En este caso, tenemos una clase CartStorage que almacena el carrito de la compra del usuario en el localStorage.

```typescript
class CartStorage
{
    find(productID) {
        let products = JSON.parse(localstorage.get('cart', []));
        return products.find( p => p.id === productID);
    }

    add(product){/*...*/}
    update(product){/*...*/}
    remove(product){/*...*/}
}
```

Pero de repente queremos trabajar también con SessionStorage y/o con IndexedDB además de con LocalStorage.

¿Cómo abordamos este caso? Hay varias opciones. 

- Una de ellas es modificar todos los métodos de CartStorage, pero esto no cumple el principio abierto/cerrado.

- Otra sería crear otra clase que herede de CartStorage y sobreescribir todos los métodos. Pero no parece muy profesional.

- Otra sería que CartStorage utilice una interfaz e inyectarle la clase concreta en tiempo de ejecución (inversión de dependencias).

```typescript
class CartStorage
{
    private storage;

    setStorageService(storage: StorageService) {
        this.storage = storage;
    }

    find(productID) {
        return this.storage.find(productID)
    }

    add(product){/*...*/}
    update(product){/*...*/}
    remove(product){/*...*/}
}

interface StorageService
{
    find(productID);
    add(product);
    update(product);
    remove(product);
}

class LocalStorageService implements StorageService
{
    find(productID) {
        let products = JSON.parse(localstorage.get('cart', []));
        return products.find( p => p.id === productID);
    }

    add(product);
    update(product);
    remove(product);
}

class SessionStorageService implements StorageService
{
    find(productID) {
        let products = JSON.parse(sessionstorage.get('cart', []));
        return products.find( p => p.id === productID);
    }
    
    add(product);
    update(product);
    remove(product);
}

class IndexedDBStorageService implements StorageService
{
    find(productID) {
        // ...
    }
    
    add(product);
    update(product);
    remove(product);
}

// Uso
const storageService = new IndexedDBStorageService();
const cartStorage = new CartStorage();
cartStorage.setStorageService(storageService);
const product = cartStorage.find(3);
```

Así podemos cambiar el comportamiento de CartStorage sin modificar la clase. Si queremos que trabaje con IndexedDB, le pasaremos la clase IndexedDBStorageService, etc.

Y si en el futuro queremos ampliar la funcionalidad con un nuevo método de Storage, por ejemplo, guardar y recuperar los datos de una API, no hará falta modificar ningún código existente. Bastará con crear una nueva clase que cumpla el interfaz.

```ts
class ApiBackendStorageService implements StorageService
{
    find(productID) {
        // ...
    }
    
    add(product);
    update(product);
    remove(product);
}
```

Ya cumple Open/Close: se puede extender sin modificarla.

Esta solución está basada en el patrón de **inversión de dependencias**.

Otros patrones que suelen funcionar muy bien son el Strategy y el Observer (eventDispatcher/eventEmitter)

## ¿Cómo detectar que estamos violando el principio Open/Closed?

Una de las formas más sencillas para detectarlo es darnos cuenta de qué clases modificamos más a menudo. Si cada vez que hay un nuevo requisito o una modificación de los existentes, las mismas clases se ven afectadas, podemos empezar a entender que estamos violando este principio.

## Ejercicios

### Ejercicio 1

Marcador de progreso de descarga de un fichero

```typescript
class File {
    length: number;
    sent: number;
}

class Progress {
 
    private file;
 
    constructor(file) {
        this.file = file;
    }
 
    getAsPercent() {
        return this.file.sent * 100 / this.file.length;
    }
}
```

Uso:

```typescript

    file = new File();
    file.setLength(200);
    file.setSent(0);
 
    progress = new Progress(file);
    console.log(progress.getAsPercent()); // 0

    file.setSent(100);
    console.log(progress.getAsPercent()); // 50

    file.setSent(150);
    console.log(progress.getAsPercent()); // 75

    file.setSent(200);
    console.log(progress.getAsPercent()); // 100
}
```

Se quiere aprovechar la clase Progress para medir también el progreso en porcentaje de objetos Audio y objetos Video:

```typescript
class Audio {
    duration: number;
    played: number;
}

audio = new Audio();
audio.setDuration(200);
audio.setPlayed(0);

progress = new Progress(audio);
console.log(progress.getAsPercent()); // 0

audio.setPlayed(100);
console.log(progress.getAsPercent()); // 50

audio.setPlayed(150);
console.log(progress.getAsPercent()); // 75

audio.setPlayed(200);
console.log(progress.getAsPercent()); // 100
}
```

Programar el código de la clase Audio y los cambios necesarios en File y en Progress para cumplir los requisitos. Se pueden añadir otras clases/interfaces.


```typescript
interface Measurable {
    getTotal();
    getCurrent();
}
```

```typescript
class Progress {
 
    private item: Measurable;
 
    constructor(item: Measurable) {
        this.item = $item;
    }
 
    function getAsPercent() {
        return this.item.getCurrent() * 100 / this.item.getTotal();
    }
}
```

```typescript
class File implements Measurable {
    public length;
    public sent;

    public function getTotal() { 
        return this.length;
    };

    public function getCurrent() { 
        return this.sent
    };
}
```

```typescript
class Audio implements Measurable {
    public duration;
    public played;

    public function getTotal() { 
        return this.duration;
    };

    public function getCurrent() { 
        return this.played
    };
}
```

El uso quedaría así

```typescript

    file = new File();
    file.setLength(200);
    file.setSent(0);
 
    progress = new Progress(file);
    console.log(progress.getCurrent()); // 0

    file.setSent(100);
    console.log(progress.getCurrent()); // 50

    file.setSent(150);
    console.log(progress.getCurrent()); // 75

    file.setSent(2000);
    console.log(progress.getCurrent()); // 100
}

function testItCanGetTheProgressOfAnAudioAsAPercent() {
    audio = new Audio();
    audio.setDuration(200);
    audio.setPlayed(0);
 
    progress = new Progress(audio);
    console.log(progress.getCurrent()); // 0

    audio.setPlayed(100);
    console.log(progr rent()); // 50

    audio.setPlayed(150);
    console.log(progress.getCurrent()); // 75

    audio.setPlayed(200);
    console.log(progress.getCurrent()); // 100
}
```

## ¿Cuándo debemos cumplir con este principio?

Hay que decir que añadir esta complejidad no siempre compensa, y **como el resto de principios, sólo será aplicable si realmente es necesario**. Si tienes una parte de tu código que es propensa a cambios, plantéate hacerla de forma que un nuevo cambio impacte lo menos posible en el código existente. Normalmente esto no es fácil de saber a priori, por lo que puedes preocuparte por ello cuando tengas que modificarlo, y hacer los cambios necesarios para cumplir este principio en ese momento.

Intentar hacer un código 100% Open/Closed es prácticamente imposible, y puede hacer que sea ilegible e incluso más difícil de mantener. Los principios SOLID son ideas muy potentes, pero hay que aplicarlas donde corresponda y **sin obsesionarnos con cumplirlas en cada punto del desarrollo**. Casi siempre es más sencillo limitarse a usarlas cuando nos haya surgido la necesidad real.