# Prinicipio de sustitución de Liskov

"Child classes should never break the parent class' type definitions."

Esto es fácilmente comprobable de la siguiente manera:

"Subtypes must be substitutable for their base types."

## Ejemplo

Clase padre:

```typescript
class Vehicle {
  startEngine() {
    // Default engine start functionality
  }

  accelerate() {
    // Default acceleration functionality
  }

  changeGear(gear) {
    // Default acceleration functionality
  }
}
```

Clases hijas:

```typescript
class Car extends Vehicle {

    // startEngine diferente del padre
    startEngine() {
        this.engageIgnition();
        parent::startEngine();
    }

    private engageIgnition() {
        // Ignition procedure
    }

}

class ElectricBus extends Vehicle {

    // accelerate diferente del padre
    accelerate() {
        this.increaseVoltage();
        this.connectIndividualEngines();
    }

    private increaseVoltage() {
        // Electric logic
    }

    private connectIndividualEngines() {
        // Connection logic
    }

}
```

Uso:

```typescript
class Driver {
  go(v: Vehicle) {
    v.startEngine();
    v.changeGear(1);
    v.accelerate();
    v.accelerate();
    v.changeGear(2);
  }
}
```

Nuestro Driver es capaz de utilizar cualquiera de los vehículos, incluso utilizar el objeto padre Vehicle.

## Ejemplo de violación de LSP

Nuestra aplicación lleva varios meses funcionando a la perfección y nuestro jefe nos pide ahora añadir un nuevo vehículo al sistema: Bicicletas.

Así que creamos la clase Bike, la extendemos de Vehicle y lo

```typescript
class Bike extends Vehicle {
  startEngine() {
    // Lo dejamos vacío porque no hay que hacer nada
  }

  accelerate() {
    // Código necesario para pedalear más rápido
  }

  changeGear(sprocket, chainring) {
    // Código para cambiar de marcha según el plato y el piñón seleccionados
  }
}
```

Si metemos esta clase al sistema, el sistema dará un error si a nuestro Driver le pedimos que conduzca una bicicleta

```typescript
class Driver {
  go(v: Vehicle) {
    v.startEngine();
    v.changeGear(1);
    v.accelerate();
    v.accelerate();
    v.changeGear(2);
  }
}

const driver = new Driver();
const bike = new Bike();
driver.go(bike);
```

El error saltará en el código del Driver, cuyo código seguramente lleve meses sin que nadie lo haya tocado, pero lo hemos roto por meter una clase hija sin cumplir el principio de Liskov.

Una clase hija debe respetar el "contrato" de la clase padre. Si no lo respeta, no puede ser hija suya. Y en el caso de Bike, el contrato es que el método _chageGear_ recibe un único argumento numérico. Y la clase Bike no respeta eso.

Igual en vez de herencia en los vehículos donde deberíamos tener herencia es en los conductores. O igual lo que tenemos que repensar es el proceso de conducir con otro interfaz distinto en el que no se hable de "acelerar" y de "cambios de marcha" sino que se hable simplemente de "cambios de velocidad en km/h".

A veces encontraremos solución para que las clases hijas respeten los contratos:

- cambiando el comportamiento de las clases hijas al contrato de la clase padre o del interfaz
- cambiando el contrato (es decir, cambiando cómo se van a utilizar las clases desde fuera)

En otras ocasiones, terminaremos dándonos cuenta de que realmente tenemos contratos distintos, y por lo tanto, las clases no deben estar relacionadas entre ellas.

## Precondiciones y postcondiciones

Además de respetar los "contratos", se deben respetar las siguientes normas:

- Preconditions can not be strengthened in a subclass.

Asumamos que nuestra clase base trabaja con una propiedad que es un int. Ahora, creamos una subclase que requiere (restringe) esa propiedad int para que sea un entero positivo. Esto es reforzar (hacer más restrictiva) las precondiciones. Cualquier código que funcionara perfectamente con números negativos dejará de funcionar con la subclase.

- Postconditions can not be weakened in a subclass.

Asumamos el mismo escenario, pero en este caso la clase base garantiza que la propiedad sea positiva (no acepta números que no sean positivos en su setter). Y en este caso, la clase base sobreescribe el comportamiento del setter para que permita números negativos. Un código que use un getter de la propiedad asumiendo que siempre va a ser positivo (porque la clase base lo garantizaba) ahora estará roto debido a que se ha debilitado dicha restricción del getter.

## Ejemplo de precondiciones y postcondiciones

Supongamos una clase Employee que tiene programado un proceso de elaboración de un informe:

```ts
// proceso de elaboración de un informe
const report = makeReport(data);
sendReport(employee, report);
```

Supongamos también que la misma clase Employee tiene programado un proceso para presentar informes

```ts
openMeetingRoom();
turnOnLights();
turnOnComputer();
turnOnProjector();

const report = downloadReceivedReport();
makePresentation(report);

turnOffProjector();
turnOffComputer();
turnOffLights();
closeMeetingRoom();
```

Y supongamos que la clase Employee sabe elaborar informes en español y en inglés. Y que sabe presentar informes en español y en inglés. Y que sabe hacer cientos de cosas más.

Y supongamos que todas las clases hijas de Employee (Engineer, Developer, etc) saben elaborar y presentar también en español y en inglés y saben hacer las otras cientos de cosas.

Todo lleva funcionando a la perfección meses o incluso años.

Y contratamos (programamos) un nuevo tipo de empleado que NO sabe inglés.

```ts
class HijoDelDueño extends Employee {}
```

Programamos las cientos de cosas, entre ellas los métodos:

- makeReport(data) que devuelve un objeto Report
- makePresentation(report) que recibe un objeto Report

pero esos métodos restringidos al idioma español.

`HijoDelDueño` cumple los interfaces (argumentos de entrada y salida de las funciones y los tipos). Metemos el nuevo tipo de empleado al sistema. Y durante semanas todo va bien...

Hasta que un día salta un error en el `makePresentation()` del `HijoDelDueño`. ¿Por qué? Porque no hemos cumplido Liskov en concreto:

> Preconditions can not be strengthened in a subclass.

Hay unas precondiciones en el `makePresentation` del Padre, que es que el report recibido (PRE-CONDICIÓN o ARGUMENTO DE ENTRADA) debe estar restringido a Español o a Inglés. Es decir, solamente (restricción) acepta 2 idiomas de los cientos existentes en el mundo. Si llega una clase hija que hace más fuerte, más restrictiva la condición y en vez de aceptar 2 idiomas acepta solamente 1 idioma, el sistema se rompe.

**HA HECHO MÁS FUERTE LA RESTRICCIÓN DE ENTRADA DE DATOS.**

Ahora supongamos que contratamos (programamos) una empleada que sabe español, inglés y francés.

```ts
class HijaDelDueño extends Employee {}
```

Programamos las cientos de cosas, entre ellas los métodos:

- `makeReport(data)` que devuelve un objeto Report
- `makePresentation(report)` que recibe un objeto Report

Pero las restricciones de esos métodos son más laxas, porque es capaz de trabajar en más idiomas. Metemos el nuevo tipo de empleado al sistema. Y durante semanas todo va bien...

Hasta que un día salta un error en el `makePresentation()` de un `Developer` de toda la vida. ¿Por qué? Esta vez no hemos cumplido con:

> Postconditions can not be weakened in a subclass.

Una subclase no puede generar (POST-CONDICIÓN o ARGUMENTO DE SALIDA) datos menos restrictivos de los establecidos por la clase padre. El padre estaba restringido a 2 idiomas y la hija es menos restrictiva, el sistema se rompe.

## Más ejemplos

### Ejemplo: No se respeta el interfaz

Tablero 2D a tablero 3D

```js
class Board {
  height: int;
  width: int;
  // ...

  addFigure(f: Figure, x: int, y: int) {}
  getFigures(x: int, y: int): Figure[] {}
  removeFigure(x: int, y: int) {}
}
```

Parece una buena idea que el tablero 3D sea una extensión del 2D porque es lo mismo pero añadiendo una propiedad más

```js
class Board3D extends Board {
  height: int;
  width: int;
  zpos: int;
  // ...

  addFigure(f: Figure, x: int, y: int, z: int) {}
  getFigures(x: int, y: int, z: int): Figure[] {}
  removeFigure(x: int, y: int, z: int) {}
}
```

Pero en realidad, hay que modificar el interfaz de todos los métodos. Esto hará que nuestras clases Board y Board3D no sean intercambiables en el código. Nos hemos cargado el interfaz común.

### Ejemplo: Preconditions can not be strengthened in a subclass

```typescript
class Car {
    drive();
    playRadio();
    addLuggage();
}

class FormulaOneCar extends Car {
    public void drive() {
        //Code to make it go super fast
    }

    public void addLuggage() {
        throw new Error("No room to carry luggage, sorry.");
    }

    public void playRadio() {
        throw new Error("No radio included.");
    }
}
```

El código programado para funcionar con Car y -en principio- con cualquier subtipo de Car no espera nunca un Error, y no funcionará para el caso concreto de FormulaOneCar.

### Ejemplo: Postconditions can not be weakened in a subclass

```typescript
class ParentClass {
  value: int;

  setValue(value: int) {
    this.value = Math.abs(value);
  }

  getValue(): int {
    return this.value;
  }
}

class ChildClass extends ParentClass {
  value: int;

  setValue(value: int) {
    this.value = value;
  }

  getValue(): int {
    return this.value;
  }
}

const miClase = ParentClass();
miClase.setValue(-7);
const result = miClase.getValue();
// ...
Math.sqrt(result);
```

De nuevo el código programado para funcionar con ParentClass y con sus herederos da por supuesto que nunca recibirá números negativos ya que el padre se asegura de que internamente nunca haya valores negativos.

Todos las clases que hereden funcionarán correctamente excepto si alguna hace más laxa esa postcondición.

- **Precondiciones**: condiciones del entorno en el que se va a ejecutar la clase ANTES de que la clase se ejecute. Si aseguramos que nuestras clases funcionan en un entorno X, una clase que para funcionar requiera (pre) un entorno más reducido/restringido se encontrará situaciones/condiciones inesperadas en las que no funcione porque no está preparada para ello.

- **Postcondiciones**: condiciones del entorno DESPUÉS de haber ejecutado la clase. Si aseguramos que nuesto código funciona en un entorno X, si alguna clase hija crea (post) un entorno más "amplio", no podemos asegurar que todo funcione bien.
