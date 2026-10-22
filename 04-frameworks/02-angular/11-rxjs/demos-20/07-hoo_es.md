# High Order Operators

## HOO: `concatMap`


En esta demostración, probamos el operador de mapeo de orden superior `concatMap`.

Para este ejemplo, emitiremos un conjunto de números. Usamos un operador de mapeo de orden superior para transformar cada uno de esos números en un nuevo observable.

Actualizar `src/app/app.component.ts`

Establezcamos un retraso aleatorio entre las emisiones para que podamos ver mejor la diferencia entre los *high order operators*. Un retraso aleatorio emula mejor el mundo real, donde una respuesta a una petición HTTP siempre tiene una cantidad de retraso indeterminada. Comenzamos creando un método que proporcione una cantidad de retraso aleatoria. Utiliza Math.random para crear un número aleatorio que sea mayor o igual a 0 y menor que 1. Multiplica ese número por 1000 para obtener un número mayor o igual a 0 y menor que 1000. Luego usa Math.floor para redondear hacia abajo. Por último, sumamos 500 al resultado, lo que nos da un número aleatorio entre 500 y 1499 milisegundos.

A continuación, implementamos `OnInit`, agregamos la importación necesaria y creamos el método `ngOnInit`. Eso nos da un lugar para escribir nuestro código.

Usamos la función de creación RxJS `range`. Como sugiere su nombre, el rango emite números enteros en un rango de valores determinado. Pasaremos el número inicial y el conteo. Comenzaremos en 1 y emitiremos 5 números.

A continuación canalizamos el valor emitido a través de un conjunto de operadores. Usaremos el operador `concatMap`. La fuente observable emite un número que representaré con i. Los *high order mapping operators* esperan devolver un observable, por lo que usamos la función de creación y el retorno de i y agregamos el *import* necesario.

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { concatMap, of, range } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5).pipe(
      concatMap((i) => of(i))
    )
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}

```

Con este código, `concatMap` toma un número y lo transforma en un observable que emite ese número, y aquí es donde entra nuestro `randomDelay`. No queremos que el observable emita de inmediato para emular una solicitud HTTP. y respuesta. Retrasaremos la emisión del resultado.

Para hacer eso, canalizamos la emisión y usamos el operador *delay* RxJS. El operador *delay* toma la cantidad de retraso en milisegundos. Llamaremos a nuestro método `randomDelay` para especificar una cantidad aleatoria de retraso y agregar la importación necesaria. No olvidemos suscribirnos y, para la próxima función de devolución de llamada, registraremos una descripción y el valor emitido.

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { concatMap, delay, of, range } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5)
      .pipe(
        concatMap((i) => of(i).pipe(
          delay(this.randomDelay())
        ))
      )
      .subscribe((item) => console.log('concatMap:', item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}

```

```bash
npm start
```

Abrir el navegador, usando las dev tools.

Observe que vemos los números del 1 al 5 emitidos en secuencia. Si vuelves a actualizar, observa la pausa entre las emisiones y verás que siempre aparecen en esa secuencia. Esto se debe a que `concatMap` siempre espera a que se complete cada observable interno antes de procesar el siguiente para que siempre estén en orden.

Antes de continuar, pensemos en esto por un momento. Quizás tengamos una función de comparación de productos en nuestra aplicación. El usuario elige tres productos y usamos los identificadores seleccionados para obtener esos productos. ¿Querríamos recuperar uno, esperar a que regrese la respuesta, luego buscar el siguiente, esperar a que regrese la respuesta y finalmente obtener el último? Eso no es muy eficiente. Tengamos esto en cuenta al seleccionar el operador de mapeo de orden superior adecuado para nuestro escenario. Ahora veamos en qué se diferencia `mergeMap`.

## HOO: mergeMap

En esta demostración vamos a probar el *higher‑order mapping operator* `mergeMap`

Actualizar `src/app/app.component.ts`

Copiemos el código que creamos para el ejemplo `concatMap` y péguelo a continuación. Cambiamos el `range` para comenzar en 11 y emitir 5 elementos. De esa manera, cuando veamos las emisiones de nuestros dos *streams*, veremos fácilmente de dónde provienen los valores.

Como estamos probando `mergeMap`, cambiaremos `concatMap` por `mergeMap` aquí, agregaremos la importación y cambiaremos el mensaje de registro aquí. Y comentemos el ejemplo `concatMap` por un momento para simplificar nuestra salida.

```ts
export class AppComponent implements OnInit {
  pageTitle = "Lemoncode Store";
  cartCount = 0;

  ngOnInit(): void {
    // range(1, 5)
    //   .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
    //   .subscribe((item) => console.log('concatMap:', item));

    range(11, 5)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("mergeMap:", item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

```bash
npm start
```

Abra la consola del navegador y veremos los elementos emitidos. Observe que no están en ningún orden en particular. Como tenemos un `randomDelay`, los elementos pueden emitirse en cualquier momento.

Si refrescamos la página notamos lo rápido que los valores son emitidas, y cada vez que refrescamos podemos observar un orden diferente.

El `mergeMap` emite todos sus valores tan pronto como puede y los fusiona con la salida observable.

Antes de continuar, pensemos en esto por un momento. Pensemos en nuestra función de comparación de productos. El usuario elige tres productos y usamos los identificadores seleccionados para obtener esos productos. Con `mergeMap`, las tres recuperaciones ocurren simultáneamente y las respuestas regresan tan pronto como pueden, por lo que obtenemos todos los datos más rápidamente usando `mergeMap`.

Para ver esto en acción, descomentaemos `concatMap`, miremos la consola y refresquemos.

```ts
export class AppComponent implements OnInit {
  pageTitle = "Lemoncode Store";
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5)
      .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("concatMap:", item));

    range(11, 5)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("mergeMap:", item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

Se emiten varios `mergeMap`, luego nuestro primer `concatMap`, luego el resto de nuestro `mergeMap` y, por último, finaliza el `concatMap` restante.

Haga clic en actualizar para verlo nuevamente. Cada vez, el `mergeMap` se completa mucho antes de que finalice el `concatMap` y, a menudo, antes de que se emita el segundo `concatMap`. Tenga esto en cuenta al seleccionar el *higher‑order mapping operator* apropiado para su escenario. Ahora echemos un vistazo a `switchMap`.

## HOO: switchMap

En esta demo, cambiamos al `switchMap` *higher‑order mapping operator*.

Actualizar `LCS/src/app/app.component.ts`

Copiemos nuevamente el código que creamos para el ejemplo de `concatMap` y péguelo a continuación. Cambie el rango esta vez para comenzar en 21 y emitir 5 elementos. De esa manera veremos fácilmente qué valores en la consola provienen de dónde. Dado que estamos probando `switchMap`, cambiaremos `concatMap` a `switchMap` aquí y en el mensaje de registro aquí, y no olvidemos agregar el *import*. Comentemos las dos suscripciones anteriores por un momento para simplificar nuestro resultado.

```ts
export class AppComponent implements OnInit {
  pageTitle = "Lemoncode Store";
  cartCount = 0;

  ngOnInit(): void {
    // range(1, 5)
    //   .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
    //   .subscribe((item) => console.log('concatMap:', item));

    // range(11, 5)
    //   .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
    //   .subscribe((item) => console.log('mergeMap:', item));

    range(21, 5)
      .pipe(switchMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log("switchMap:", item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

```bash
npm start
```

Abra la consola del navegador. Sólo se emite un valor. Es 25. Intentemos refrescarnos. Sí, solo hay un valor.

¿Que está sucediendo? Cuando se emite el 21, creamos un observable. Tan pronto como se emite el 22, el `switchMap` se da de baja de ese primer observable, cancelándolo. El `switchMap` luego crea un nuevo observable. Luego, cuando se emite el 23, nuevamente se da de baja del observable anterior y crea un nuevo observable, y así sucesivamente. Cuando se emite el 25, se da de baja del observable de 24 y crea un nuevo observable, y como no hay otras emisiones después del 25, el observable de 25 no se da de baja. Su valor se emite y se muestra en la consola.

Pensemos en esto por un momento. Para nuestra función de lista de productos, digamos que usamos switchMap para recuperar tanto el producto como sus reseñas. El usuario elige un producto. Si el usuario se da cuenta rápidamente de que eligió el producto equivocado y vuelve a elegir, las solicitudes HTTP se cancelan y se recuperan los datos para la nueva selección, por lo que podemos cancelar rápidamente solicitudes anteriores usando "switchMap". Veamos a todos nuestros operadores de orden superior en acción. Quitaré el comentario del código y luego lo actualizaré.

```ts
export class AppComponent implements OnInit {
  pageTitle = 'Lemoncode Store';
  cartCount = 0;

  ngOnInit(): void {
    range(1, 5)
      .pipe(concatMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log('concatMap:', item));

    range(11, 5)
      .pipe(mergeMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log('mergeMap:', item));

    range(21, 5)
      .pipe(switchMap((i) => of(i).pipe(delay(this.randomDelay()))))
      .subscribe((item) => console.log('switchMap:', item));
  }

  private randomDelay() {
    return Math.floor(Math.random() * 1000) + 500;
  }
}
```

Mira la consola. Se emitieron varios mergeMaps, luego nuestro primer concatMap, luego el resto de nuestros mergeMaps, nuestro switchMap y, por último, los concatMaps restantes finalizan. Haga clic en Actualizar para verlo nuevamente. Dependiendo de randomDelay, switchMap puede aparecer en cualquier lugar antes o después, pero siempre solo emite su último valor. Tenga en cuenta estas diferencias al seleccionar el operador de asignación de orden superior adecuado para su escenario. Ahora apliquemos lo que aprendimos a nuestra aplicación de muestra y obtengamos esas reseñas de productos.