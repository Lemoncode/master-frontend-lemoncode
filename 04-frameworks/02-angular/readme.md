# Conceptos Angular

## Interpolation

```ts
@Component({...})
class MyComponent {
  publicProperty = "Cualquier valor";
}
```

```html
<p>{{ publicProperty }}</p>
```

## Bindings

- Attribute Binding `[]`
  - Primitives: strings, number, obj, date... NO Funcs
- Event Binding `()`
  - Feed with `callback`: Class Component method

```ts
class MyComponent {
  publicProperty = "Cualquier valor";

  myValue = "un valor...";

  inputEvent($event: any) {
    this.myValue = $event.target.value;
  }
}
```

```html
<p>{{ publicProperty }}</p>

<input [value]="myValue" (input)="inputEvent($event)" />
```

## Custom Events

- `@Output`
  - para registrar el atributo de evento para poder pasar un `callback`
- `EventEmitter`
  - Permite lanzar el evento

## Directiva estructural

- `NgFor`

```ts
class Component {
  fruits = ["banana", "apple", "melon"];
}
```

```html

<tr *ngFor="let fruit of fruits">{{fruit}}</tr>
<tr>banana</tr>
<tr>apple</tr>
<tr>melon</tr>
```

## Formularios

- Template - Motor de validaciones HTML5
  - required, min, max...
- Reactive - Motor de validaciones provisto por 'Angular'
  - Permite validaciones pesonalizadas
  - Soporte a validaciones asíncronas

- `ngModel` 
  - Acumula validaciones a nivel de campo de formulario
  - Two way binding
- `ngForm`

## Dependency Injection

```ts
class Employee {
  constructor(private salaryReport: ISalaryReport) {
    // salaryReport = new SalaryReport();
  }

  calcSalary() {
    this.salaryReport.....()
  }
}

interface ISalaryReport {
  getSalaryByHour(hours: number) {}

  getSalaryByRole(role: string) {}
}

class A implements ISalaryReport {}
class B implements ISalaryReport {}

const e = new Employee(new A())
const e = new Employee(new B())
```

## Routing

- Definimos diccionario de rutas para que el servicio de `Router` las pueda usar
- `router-outlet` directiva donde el router inyectara nuestros componentes
- `routerLink` 
- `routerLinkActive` 

## Observables

### Terminos y Sintaxis

- **Observable:** Cualquier flujo (`stream`) de datos
- **Observer:** Observa el flujo de datos. Métodos para procesar 'notificaciones' del flujo de datos (`stream`): `next()`, `error()`, `complete()`
- **Subscriber:** Un observador (`Observer`) que se puede de-subscribir del flujo de datos (`unsubscribe`)
- **Subscription:** Representa la ejecución de un Observable. El método `subscribe()` devuelve una 'Subscripción'

### Creando Observables

Podemos crear un Observable mediante:

- Constructor
- Funciones de creación:
  - of, from, fromEvent, interval, ...
- Angular Features
  - Forms: valueChanges
  - Routing: paramMap
  - HttpClient: get, post, ...

### Arrancando Observables

Un Observable on enitira hasta que se 'arranca':

- Llamar a `subscribe`
- Alimentando un `Observer`
  - `next()`, `error()`, `complete()`

### Parando Observables

Para parar un Observable:

- Llamar a `complete()` en el `Observer`
- Utilizar una función de creación que termine
  - of, from, ...
- Utilizar un operador que termine
  - take, takeUntil, ...
- Emitir un error
- Llamar `unsubscribe()` en el objecto Subscripción

### Operadores

#### `map`

```
------------[55]-----------------[80]----|->

map((x) => x % 2)

------------[1]------------------[0]----|->
```

#### `combineLatest`

```
---[45]-[50]-----------------------------|->

------------[55]-----------------[80]----|->

--[25]------------------[75]-------------|->

combineLatest([obv1, obv2, obv3])

--[50,55,25]-[50,55,75]-[50,80,75]-------|->
```

#### `forkJoin`

```
---mist-silver-----------------pearl|------>

------------blue-gray|--------------------->

--¡------------------taupe|---------------->

forkJoin([obv1, obv2, obv3])

------------------------[pearl,gray,taupe]|>
```

#### `withLatestFrom`

```
---A1-------A2-----------------A3-----|->

-------S1--------------------------S2-|->

--C1------------------C2--------------|->

apple$.pipe(withLatestFrom(stick$, caramel$))

-----------[A2,S1,C1]----[A3,S1,C2]---|->
```

#### `filter`

```
---A-------B-----------------A-----|->

filter(item => item === 'A')

---A-------------------------A-----|->
```

#### `startWith`

```
---A-------B-----------------A-----|->

startWith('Orange')

---OA-------B-----------------A-----|->
```

#### `merge`

```
---A-------B-----------------A-----|->
-------O-------------G-------------|->

merge(...)

---A---O---B---------G-------A-----|->
```

#### `scan`

```
---2-------5-----------------9-----|->

scan((acc, curr) => acc + curr)

---2-------7-----------------16----|->
```

### Observables Manejo errores

Dos estrategias a la hora de tratar errores:

- catch and rethrow
- catch and replace

## Signals

