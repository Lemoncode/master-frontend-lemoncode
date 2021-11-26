# Principio de segregación de interfaz

## Ejercicios

Dado el siguiente interfaz de item IItem:

```typescript
interface IItem
{
    getName(): string;

    applyDiscount(discount: number): number;
    applyPromocode(promocode: string): number;

    setColor(color: string): void;
    setSize(size: string): void;
    setMaterial(material: string): void;

    setPrice(price: number): void;
}
```

1) Programar una clase Book y una clase Shirt que implementen el interfaz
2) Crear un snippet de código que cree un nuevo libro y otro que cree una nueva camiseta aplicando todos los métodos del interfaz que sean aplicables a cada objeto.

¿Os gusta este interfaz?

Este interfaz no es bueno, porque tiene demasiados métodos. Hay métodos que no tienen sentido para objetos Book y otros que no tienen sentido para objetos Shirt. Además ¿qué ocurre si algún tipo de Item no puede tener descuentos o códigos promocionales? El interfaz está obligando a implementar todos los métodos aunque no tengan sentido para algunos tipos de Item.

El principio de segregación de interfaz dice que es mejor tener varios interfaces con pocos métodos que un interfaz con muchos métodos.

3) Separar el interfaz IItem en varios interfaces
4) Reescribir las clases Book y Shirt según los nuevos interfaces

```typescript
interface IItem
{
    getName(): string;
    setPrice(price: number): void;
}

interface IClothes
{
    setColor(color: string): void;
    setSize(size: string): void;
    setMaterial(material: string): void;
}

interface IDiscountable
{
    applyDiscount(discount: number): number;
    applyPromocode(promocode: string): number;
}

class Book implemets IItem, IDiscountable
{
    setPrice(price) {/*...*/}
    applyDiscount(discount){/*...*/}
    applyPromocode(promocode){/*...*/}
}

class KidsClothes implemets IItem, IClothes
{
    setPrice(price){/*...*/}
    setColor(color){/*...*/}
    setSize(size){/*...*/}
    setMaterial(material){/*...*/}
}
```

## Ejercicios

### Ejercicio 1

Segregar el interfaz y crear las clases Car, Bus, Motorbike, Bike

```typescript
interface VehicleInterface {
    startEngine(): void;
    accelerate(): void;
    brake(): void;
    lightsOn(): void;
    lightsOff(): void;
    signalLeft(): void;
    signalRight(): void;
    changeGear(gear): void;
    startRadio(): void;
    stopRadio(): void;
    ejectCD(): void;
    openFrontDoor(): void;
    openBackDoor(): void;
}
```

### Ejercicio 2

Arreglar el siguiente diseño de clases e interfaz:

```typescript
interface IAve {  
    volar(): void;
    comer(): void;
    nadar(): void;
}

class Loro implements IAve{

    volar() {
        //...
    }

    comer() {
        //...
    }

    nadar() {
        //...
    }
}

class Pinguino implements IAve{

    volar() {
        //...
    }

    comer() {
        //...
    }

    nadar() {
        //...
    }
}
```

## Consejo

Las interfaces suele ser mejor definirlas desde el punto de vista de los procesos que las van a utilizar. 

Si se definen pensando en los modelos, saldrán entidades inadecuadas. Si se definen pensando en los procesos, saldrán las interfaces adecuadas.

## Anti patrones

- Fat interfaces