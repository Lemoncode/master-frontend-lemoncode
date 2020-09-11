# Testeo de pipes

Las pipes son los elementos más fáciles de testear en Angular. Pero hay que diferenciar dos casos bien diferenciados: el testeo de pipes puras y el testeo de pipes impuras.

Tomaremos como punto de partida el proyecto 00 - base. Es un mini-proyecto sin tests.

## Testeo de pipes puras

Vamos a testear la pipe _slugify_. Este es su código.

_src/app/pipes/slugify.pipe.ts_

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slugify'
})
export class SlugifyPipe implements PipeTransform {

  transform(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/[\s-]+/g, '-');
  }
}
```

Se puede apreciar que el método transform es una **función pura**. No interacciona con el resto del sistema, no tiene efectos colaterales...

La forma de testear esto será invocar en el test al método transform con el argumento de entrada que nos interese testear y comprobar que la salida es la esperada.

_src/app/pipes/slugify.pipe.spec.ts_

```typescript
import { SlugifyPipe } from './slugify.pipe';

describe('SlugifyPipe', () => {
  let pipe: SlugifyPipe;

  beforeEach(() => {
    pipe = new SlugifyPipe();
  });

  it('Must return string grouped by hyphen and lowercase', () => {
    expect(pipe.transform('Hello World it Work')).toEqual('hello-world-it-work');
  });
});
```

Iremos añadiendo más tests hasta cubrir todas las especificaciones.

## Testeo de pipes impuras

En este ejemplo vamos a testear la pipe _time-ago_.

_src/app/pipes/time-ago.pipe.ts_

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform {

  transform(date: Date): string {
    const seconds = Math.floor(((new Date()).getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
  }

}
```

Como se puede observar, esta función transform ya no es pura, ya que si se invoca dos veces con el mismo argumento de entrada, dará respuestas distintas.

Esto es porque interacciona con el entorno (en este caso con la hora del sistema).

Cuando nos encontramos en un test unitario con una clase que interactúa con el exterior (otras clases, una api, ficheros, la hora del sistema...) debemos recurrir a los dobles (mocks) para aislar nuestra _unit under test_ del exterior.

_src/app/pipes/time-ago.pipe.spec.ts_

```typescript
import { TimeAgoPipe } from './time-ago.pipe';
import MockDate from 'mockdate';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    pipe = new TimeAgoPipe();
  });

  it('Seconds ago', () => {

    const MOCK_DATE_NOW = new Date(2020, 9, 11, 19, 24, 17);
    MockDate.set(MOCK_DATE_NOW);

    const date = new Date(2020, 9, 11, 19, 24, 0);

    expect(pipe.transform(date)).toEqual('17 seconds');
    MockDate.reset();
  });

  it('Minutes ago', () => {

    const MOCK_DATE_NOW = new Date(2020, 9, 11, 19, 32, 10);
    MockDate.set(MOCK_DATE_NOW);

    const date = new Date(2020, 9, 11, 19, 24, 0);

    expect(pipe.transform(date)).toEqual('8 minutes');
    MockDate.reset();
  });

});
```

